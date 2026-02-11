---
title: "Beating Claude Opus 4.5 at Anthropic's Performance Take-Home"
date: "Feb 7, 2026"
description: "Going from 147,734 cycles down to 1,356 cycles on Anthropic's VLIW SIMD kernel optimization take-home."
tags: [Tech, AI/ML]
slug: anthropickerneloptimization
subtitle: "109x speedup on a VLIW SIMD kernel"
---

Anthropic recently posted an article on [AI-resistant take-home assignments](https://www.anthropic.com/engineering/AI-resistant-technical-evaluations) and open-sourced their [original performance take-home](https://github.com/anthropics/original_performance_takehome) problem, along with benchmarked cycle counts for Sonnet and Opus 4.5 solving it autonomously. With only some university knowledge about kernel optimization, I aimed to beat the models myself.

Here's how I went from 147,734 cycles down to 1,356 cycles—a 109x speedup.

<img src="/kernel_perf/result.png" alt="Results" class="img-full" />

[Check out my code here](https://github.com/pyInvenio/original_performance_takehome)

---

## The Problem

The task was a binary tree traversal kernel for a VLIW SIMD architecture. You have 256 elements that each traverse a binary tree (height 10, 2047 nodes) for 16 rounds. In each round, an element:

1. XORs its value with the current tree node
2. Hashes the result through a 6-stage hash function
3. Moves left (if hash is even) or right (if odd)
4. Wraps back to root if it falls off the tree

The hash function was represented as:

```python
HASH_STAGES = [
    ("+", 0x7ED55D16, "+", "<<", 12),  # Stage 0
    ("^", 0xC761C23C, "^", ">>", 19),  # Stage 1
    ("+", 0x165667B1, "+", "<<", 5),   # Stage 2
    ("+", 0xD3A2646C, "^", "<<", 9),   # Stage 3
    ("+", 0xFD7046C5, "+", "<<", 3),   # Stage 4
    ("^", 0xB55A4F09, "^", ">>", 16),  # Stage 5
]
```

Each stage computes: `val = (val OP1 C) OP2 (val SHIFT k)`, where `C` is the constant, `OP1`/`OP2` are the operators, and `k` is the shift amount.

### The Architecture Constraints

The target was a VLIW SIMD machine with strict per-cycle resource limits:

| Resource | Slots/Cycle | Description |
|----------|-------------|-------------|
| VALU | 6 | Vector ALU operations |
| ALU | 12 | Scalar ops (across 8 lanes) |
| LOAD | 2 | Memory loads |
| STORE | 2 | Memory stores |
| FLOW | 1 | Control flow, vselect |
| VLEN | 8 | Vector width |

The baseline implementation was completely sequential: 147,734 cycles. The target to beat was Claude Opus 4.5's improved test-time compute harness score: 1,363 cycles. (Humans have since reached close to 1,000, but I just wanted to beat Opus at this point.)

---

## Phase 1: Vectorization and Double Buffering (147k → 9.5k cycles)

Since the baseline processed everything sequentially, the lowest hanging fruit was to actually use the vector hardware. With VLEN = 8, and each element's traversal being completely independent, I could process 32 batches of 8 elements each.

The key insight was double buffering. By allocating two sets of vector registers (A and B), I could:
- Calculate hash functions for batch A
- While simultaneously computing addresses and loading batch B

```python
while batches_remaining:
    # Batch A: compute hash stages
    val_a = hash_stage_0(val_a)
    val_a = hash_stage_1(val_a)
    # ...

    # Batch B: load next data (overlapped)
    addr_b = compute_address(batch_b)
    val_b, idx_b = load(addr_b)
```

Since hashing and tree traversal for a single element is strictly sequential (each hash stage depends on the previous), we had to parallelize across elements (SIMD) and hide memory latency behind computation. This was the start of implementing full diagonal pipelining.

Result: ~15x speedup from using the vector units properly.

---

## Phase 2: Algebraic Optimization with multiply_add (9.5k → 8,583 cycles)

One of the first observations I had when writing the initial optimizations was that the hash function was very sequential and ate up many cycles just for computation. Looking through the available ops in `problem.py`, I spotted a `multiply_add` instruction.

On even stages (0, 2, 4), the hash pattern was always:
```
val = (val + C) + (val << k)
```

I could algebraically transform this:
```
val = val + C + val * 2^k
    = val * (1 + 2^k) + C
    = multiply_add(val, (1 + 2^k), C)
```

This reduced three VALU ops into one:

```python
# Before: 3 VALU operations
tmp = val << 12           # shift
tmp = tmp + val           # add
val = tmp + 0x7ED55D16    # add constant

# After: 1 VALU operation
val = multiply_add(val, (1 + 2^12), 0x7ED55D16)  # 4097 * val + C
```

The same trick applied to the index update formula `idx = idx * 2 + 1`, which is just `multiply_add(idx, 2, 1)`.

Another key change here was offloading some VALU work to ALU. Since ALU has 12 slots and was mostly idle, I moved the XOR operations there—they work the same on scalars across vector lanes.

Result: ~900 cycles saved from instruction count reduction.

<img src="/kernel_perf/phase2.png" alt="Phase 2 perf trace" class="img-full" />

---

## Phase 3: Group Pipelining (8.5k → 3,316 cycles)

The previous double buffering only used two VALU slots out of six possible per cycle. We should be matching the hardware's parallelism. In this phase, I spawned 6 contexts that the engine could work on simultaneously, each processing a separate batch.

Given the available scratch space, each context got its own allocated registers:

```python
# 6 contexts, each with its own state
contexts = [
    {"idx": alloc(8), "val": alloc(8), "node": alloc(8), "tmp1": alloc(8), "tmp2": alloc(8)}
    for _ in range(6)
]

# Now VALU can do 6 XORs in parallel
cycle N:  XOR batch0, XOR batch1, XOR batch2, XOR batch3, XOR batch4, XOR batch5
```

When implementing this, I ran into a problem: tree loads were killing parallelism. Each batch needed to load tree nodes, but LOAD only has 2 slots per cycle. For 6 batches doing scattered loads (8 loads each), that's 48 loads competing for 2 slots.

The solution was tree level caching. For early tree levels (0-2), most elements would hit one of only 7 nodes. Instead of loading these every time, I preloaded them into vector registers at init time and used `vselect` to pick the right one:

```python
# Init: broadcast tree levels 0-2 to vectors
v_node_0 = vbroadcast(tree[0])  # root
v_node_1 = vbroadcast(tree[1])  # level 1, left
v_node_2 = vbroadcast(tree[2])  # level 1, right
# ... nodes 3-6 for level 2

# Runtime: use vselect instead of scattered load
# Level 1: pick node 1 or 2 based on index bit 0
node = vselect(idx & 1, v_node_1, v_node_2)
```

The scheduler at this point was primitive—just greedy arrays tracking which operations were ready. For scattered loads, I'd pack ALUs for address calculation, then pack LOADs and VALUs for the XOR and hashing stages.

The perf trace shows better utilization but with visible gaps—these were `vselect` bottlenecks since FLOW only has 1 slot per cycle.

<img src="/kernel_perf/phase3.png" alt="Phase 3 perf trace" class="img-full" />

Result: ~2.5x speedup from better VALU utilization.

---

## Phase 4: Interleaved Batch Scheduling (3.3k → 2,282 cycles)

Around this time I was working on this in parallel with my actual day job, so I didn't have much time for detailed code writing and review. Previous optimizations used minimal AI tooling, but I started running Claude in loops to explore ideas. However, it became clear that without a proper harness and thorough testing, it couldn't break past a "theoretical 1,728 cycles." So, using debug tools like perf traces and my own research, I had to guide it toward better solutions.

The previous optimizations only unlocked VALU parallelism for some operations; fully saturating VALU became my priority. The problem was the `vselect` chains for tree levels 1 and 2. With only 1 FLOW slot per cycle, these created "ramp-up" periods where VALU sat idle waiting for node selection to complete.

The solution was true interleaving: start every batch's pipeline immediately, and pack VALU with whatever was ready. When batch 0 is waiting for a vselect, batches 1-5's AND/shift operations can run:

```
Cycle 100: [vselect batch0] [AND batch1] [AND batch2] [shift batch3] [hash batch4] [hash batch5]
Cycle 101: [XOR batch0]     [vselect batch1] [AND batch2] [AND batch3] [shift batch4] [hash batch5]
Cycle 102: [hash batch0]    [XOR batch1]     [vselect batch2] [AND batch3] [AND batch4] [shift batch5]
```

Since scratch space was limited, I couldn't have all 32 batches in flight simultaneously. I limited it to groups of 24 batches, with stores happening at the end of each group.

Other optimizations included overlapping address calculations across round boundaries and overlapping XOR computation with the previous round's stores.

In the perf trace, you can see more VALU utilization and interleaved ops. There are periodic bursts which signify the scattered tree node loads (levels 3+), and ALUs firing during address calculation.

<img src="/kernel_perf/phase4.png" alt="Phase 4 perf trace" class="img-full" />

Result: ~1,000 cycles saved from better interleaving.

---

## Phase 5: Context Aliasing and Full Interweaving (2.3k → 1,510 cycles)

In this phase, I tried to pack even more batches into each group. The perf trace shows a trial run with two major groups of 18 and 14 batches each. Scratch space was clearly the constraint preventing better packing.

Looking through each batch's context setup, I found allocations that were never used simultaneously. For example, `addr` (used for address calculation) and `tmp1` (used during hashing) never overlapped in their lifetimes. By aliasing these storage slots, each batch context shrank significantly:

```python
# Before: 5 separate allocations per batch = 40 slots
ctx = {"idx": alloc(8), "val": alloc(8), "node": alloc(8), "tmp1": alloc(8), "tmp2": alloc(8)}

# After: aliased allocations = 32 slots
ctx = {"idx": alloc(8), "val": alloc(8), "node": alloc(8), "tmp1": alloc(8), "tmp2": alloc(8)}
ctx["addr"] = ctx["tmp1"]  # addr and tmp1 never live simultaneously
```

This freed up enough scratch space to process all 32 batches in a single group (or close to it), eliminating the synchronization overhead between groups.

With this optimization, VALUs were much better packed as shown in the perf. However, there were still some idle slots, and the tail (final rounds across all batches) was especially poorly optimized. Stores were also completely synchronous—all happening at the very end.

<img src="/kernel_perf/phase5.png" alt="Phase 5 perf trace" class="img-full" />

Result: ~770 cycles saved from better packing.

---

## Phase 6: DAG-Based Scheduling (1.5k → 1,417 cycles)

After perusing MIT lectures and talking with some friends about optimal scheduling strategies, I learned about using dependency graphs for instruction scheduling. The previous hand-written scheduler had hard-to-maintain level-specific logic and made suboptimal greedy decisions. A better approach: build a DAG of all instructions with their dependencies, analyze critical paths, and schedule using priority heuristics.

The implementation had three phases:

### 1. Build Phase
Run through all batches and rounds, creating operation nodes with explicit dependencies:

```python
class Op:
    resource: Resource      # VALU, ALU, LOAD, STORE, FLOW
    slots: int             # how many resource slots needed
    latency: int           # cycles until result ready
    preds: List[Op]        # operations this depends on
    succs: List[Op]        # operations depending on this

# Example: hash stage 1 depends on hash stage 0
h0 = dag.add_op(Resource.VALU, 1, 1, "hash0", ...)
h1 = dag.add_op(Resource.VALU, 1, 1, "hash1", ...)
dag.add_edge(h0, h1)  # h1 depends on h0
```

### 2. Analyze Phase
Compute ASAP (As Soon As Possible) and ALAP (As Late As Possible) times using forward and backward passes:

```python
def analyze(self):
    topo = self.topological_order()  # Kahn's algorithm

    # Forward pass: ASAP = earliest possible start
    for op in topo:
        op.asap = max((p.asap + p.latency for p in op.preds), default=0)

    # Backward pass: ALAP = latest start without delaying completion
    critical_path = max(op.asap + op.latency for op in topo)
    for op in reversed(topo):
        if not op.succs:
            op.alap = critical_path - op.latency
        else:
            op.alap = min(s.alap - op.latency for s in op.succs)

    # Slack = scheduling flexibility (0 = critical path)
    for op in topo:
        op.slack = op.alap - op.asap
```

### 3. Schedule Phase
Use a priority queue to schedule operations, preferring:
1. VALU operations (the bottleneck resource)
2. Operations with low slack (on critical path)
3. Earlier batches (to start stores sooner)

```python
priority = (-valu_boost, stage, batch, round, slack, op_id)
```

The main insight from building the DAG was that some hash computations depended on XOR results rather than the previous hash stage. This exposed parallelism the hand-written scheduler missed. The DAG scheduler filled slots with much higher consistency.

<img src="/kernel_perf/phase6.png" alt="Phase 6 perf trace" class="img-full" />

Result: ~93 cycles saved from optimal scheduling.

---

## Phase 7 & 8: Flow Optimization and Tail Compression (1.4k → 1,356 cycles)

To finalize my performance, I noticed that FLOW operations (only 1 slot per cycle) were becoming a bottleneck. Each batch needed to compute two addresses using FLOW's `add_imm` instruction—that's 128 FLOW operations just for addressing across all batches and stores.

### Address Chaining
Instead of computing each batch's address independently, I chained them using ALU:

```python
# Before: FLOW for every batch
batch_0_addr = add_imm(base, 0)    # FLOW
batch_1_addr = add_imm(base, 8)    # FLOW
batch_2_addr = add_imm(base, 16)   # FLOW

# After: FLOW once, then ALU chain
batch_0_addr = add_imm(base, 0)           # FLOW (only first batch)
batch_1_addr = batch_0_addr + 8           # ALU
batch_2_addr = batch_1_addr + 8           # ALU
```

This moved 62 operations from FLOW (1 slot) to ALU (12 slots), freeing up FLOW for other work and creating natural dependency chains for the scheduler.

### Overflow Check Optimization
At round 15 (when elements might fall off the tree), I replaced 3 VALU operations with 1 FLOW `vselect`:

```python
# Before: 3 VALU ops
tmp = idx < n_nodes      # compare
mask = -tmp              # negate to create mask
idx = idx & mask         # zero out if overflow

# After: 1 FLOW op
idx = vselect(idx < n_nodes, idx, 0)  # keep idx if valid, else 0
```

This saved 64 VALU operations (2 per batch × 32 batches) and VALU was the bottleneck.

### Tail Scheduling
The final optimization was adjusting scheduling priority for late rounds (14-15). Instead of spreading work across batches, I prioritized completing rounds:

```python
# Normal priority: stage → batch → round
priority = (stage, batch, round, slack)

# Late rounds (14-15): round → batch → stage
priority = (round, batch, stage, slack)
```

This packed the tail work more tightly, filling the gaps that were visible in earlier perf traces.

<img src="/kernel_perf/phase7.png" alt="Phase 7-8 perf trace" class="img-full" />

Final result: 1,356 cycles

---

## Results Summary

| Phase | Cycles | Speedup | Key Optimization |
|-------|--------|---------|------------------|
| Baseline | 147,734 | 1.0x | Sequential processing |
| Phase 1 | ~9,500 | 15.5x | Vectorization + double buffering |
| Phase 2 | 8,583 | 17.2x | multiply_add algebraic optimization |
| Phase 3 | 3,316 | 44.5x | 6-context group pipelining |
| Phase 4 | 2,282 | 64.7x | Interleaved batch scheduling |
| Phase 5 | 1,510 | 97.8x | Context aliasing, full interweaving |
| Phase 6 | 1,417 | 104.3x | DAG-based scheduling |
| Phase 7-8 | 1,356 | 108.9x | FLOW optimization, tail compression |

---

## Conclusion

This challenge reinforced why kernel optimization requires both systematic thinking and deep problem understanding. The biggest gains came from fundamentals—vectorization, pipelining, and hiding latency—but the final optimizations required careful analysis of resource bottlenecks and dependency graphs.

A few things that worked well: understanding the hardware constraints forced me to think carefully about resource utilization. The perf traces were essential—every gap in VALU utilization pointed to an optimization opportunity. The `multiply_add` transformation was simple math but saved nearly 1,000 cycles, which reminded me that instruction-level optimizations should come before complex scheduling. Moving to DAG-based scheduling was a turning point; it found parallelism I missed and scheduled more consistently. Finally, while Claude helped explore ideas and write boilerplate, it couldn't break through performance walls without guidance—the deep optimizations required understanding *why* something was slow.

There's still significant room for improvement. Humans have reached around 1,000 cycles. Some approaches I considered but didn't fully explore:

- Extended vselect caching to level 3 (15 nodes total) would eliminate more scattered loads, though it requires more scratch space and longer vselect chains.
- Problem-specific control flow using conditional jumps. Rather than treating each round uniformly, you could structure the kernel to handle different tree levels with dedicated code paths.
- Deeper ALU offloading—there may be more VALU operations that could be decomposed into scalar ALU ops across the 8 lanes.
- Store interleaving with computation for later batches could hide store latency and free up scratch space earlier.