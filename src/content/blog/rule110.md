---
title: "A 1D Computer You Have To Read In 2D"
date: "Mar 3, 2026"
description: "A compiler that turns Turing machines into Rule 110 cellular automaton tapes, then simulates 338 million cells through 3 billion generations to compute 10 + 21 = 31."
tags: [Tech]
slug: rule110
subtitle: "A verifiable Rule 110 compiler"
image: "/rule110/head_combined.png"
---

Rule 110 is an elementary cellular automaton; a one-dimensional grid of binary cells where each center cell updates based on its 3-cell neighborhood (cells to the left and right of it):

| $l\ c\ r$ | 111 | 110 | 101 | 100 | 011 | 010 | 001 | 000 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **output** | 0 | 1 | 1 | 0 | 1 | 1 | 1 | 0 |

Reading the outputs as a binary number: $01101110_2 = 110_{10}$.

In 2004, Matthew Cook [proved](https://www.dna.caltech.edu/courses/cs191/paperscs191/Cook_Rule110_Full_Unpublished.pdf) the universality of Rule 110; that this is Turing Complete. Given any TM, you can build a Rule 110 initial tape whose evolution faithfully reproduces the computation. Previous universality results for cellular automata worked by designing the automaton's lookup table to implement a chosen algorithm. Cook's approach was the opposite: take the simplest automaton that naturally exhibits complex behavior, and find computation already hiding inside it.

I implemented Cook's full construction as a C++ compiler and simulator. The flagship demo computes $10 + 21 = 31$ entirely through Rule 110: 5 steps of a Turing machine become 338 million cells evolving through nearly 3 billion generations. A 67.7-million-fold blowup.

[Check out the code here.](https://github.com/pyInvenio/rule110-compiler)

---

## Ether and Gliders

If you start Rule 110 from a random row of cells and watch what happens, at first the behavior looks chaotic. But as time progresses, periodic structures emerge and move through a background pattern that Cook calls **ether**.

<img src="/rule110/gliders.png" alt="Rule110 glider catalog" class="img-lg" />

*Gliders emerging from our compiled Rule 110 output. Periodic structures propagate through the ether background at fixed velocities.*

Ether is a lattice of white triangles with spatial period 14 and temporal period 7 (shifting 24 cells every 30 generations). Any localized disturbance in the ether propagates as a **glider**: a persistent, periodic structure that moves at a fixed velocity against the ether background.

<img src="/rule110/catelog.png" alt="All known gliders of Rule 110 from Cook's paper" class="img-full" />

*All recorded gliders of Rule 110 (from Cook's Figure 5). Top row: A through $D_2$. Bottom row: $\bar{E}$ through H and the glider gun. The A gliders can pack closely together ($A^n$); the other extendable gliders ($\bar{B}^n$, $\hat{B}^n$, $E^n$, $G^n$) can be any positive width. Gliders sharing a letter have the same slope.*

Cook catalogs all recorded gliders: $A$, $B$, $\bar{B}$, $\hat{B}$, $C_1$ through $C_3$, $D_1$, $D_2$, $E$, $\bar{E}$, $F$, $G$, $H$, and a glider gun. Each has a characteristic width (measured mod 14, since that's the ether's spatial period) and a period expressible as a combination of $\vec{A}$ and $\vec{B}$ units: the fundamental movement vectors of the A and B gliders. Closely packed $A$ gliders are denoted $A^n$.

| Glider | Width | Period $(t,x)$ | $(\vec{A}, \vec{B})$ |
|:---:|:---:|:---:|:---:|
| $A$ | 6 | (3, 2) | (1, 0) |
| $B$ | 8 | (4, -2) | (0, 1) |
| $C_2$ | 3 | (7, 0) | (1, 1) |
| $D_1$ | 11 | (10, 2) | (2, 1) |
| $D_2$ | 5 | (10, 2) | (2, 1) |
| $\bar{E}$ | 7 | (30, -8) | (2, 6) |
| $F$ | 1 | (36, -4) | (4, 6) |
| $G^n$ | $2+8n$ | (42, -14) | (2, 9) |
| $H$ | 11 | (92, -18) | (8, 17) |

## Preservation of Spacing

The foundational insight of Cook's construction is preservation of spacing. Consider what happens when a cluster of $C_2$ gliders (which are stationary; period $(7,0)$) encounters a cluster of $\bar{E}$ gliders (which move to the left - period $(30,-8)$). Each collision between a $C_2$ and an $\bar{E}$ produces a new $C_2$ and a new $\bar{E}$; effectively, they "cross" each other.

The relative spacings between the $C_2$s are preserved after crossing, and the same is true for the $\bar{E}$s. If two $C_2$s started with a certain gap between them, they still have exactly that gap after an $\bar{E}$ has crossed them both. This means a second $\bar{E}$ will cross the $C_2$s in exactly the same way as the first.

<img src="/rule110/preservespace.png" alt="Preservation of spacing" class="img-md" />

*Preservation of spacing (Cook's Figure 11). When $\bar{E}$s cross $C_2$s, the spacings are preserved - both between the $C_2$s and between the $\bar{E}$s. The $C_2$s end up in the same arrangement they started in.*

<img src="/rule110/glider_detail.png" alt="Glider interactions in compiled output" class="img-full" />

*The same phenomenon in our compiled $10+21$ output. The colored stripes at left are stationary tape data ($C_2$ clusters from E/F/D blocks). The diagonal traces are $\bar{E}$ crossings implementing the computation.*

This solves a fundamental problem in one-dimensional computation: how can two pieces of data cross each other without mutual destruction? By encoding data in the spacings between gliders of the same type, two data streams at different speeds can cross without interference, using just one type of crossing collision.

## Ossification

The second key mechanism is ossification: $A^4$ gliders can convert $\bar{E}$ gliders into $C_2$ gliders. When an $\bar{E}$ collides with an $A^4$, the outcome depends on their relative position. In the "short reaction," the $\bar{E}$ is consumed and a $C_2$ is produced in its place. This converts moving data (encoded as $\bar{E}$ spacings) into stationary tape data (encoded as $C_2$ spacings).

The spacing between two incoming $\bar{E}$s determines the spacing between the resulting $C_2$s, but the relationship is inverted: wider $\bar{E}$ gaps produce narrower $C_2$ gaps, and vice versa. This inversion is a natural consequence of the geometry.

Crucially, $\bar{E}$s that are spaced in the right way relative to the $A^4$s will pass invisibly through the entire ossifier array without being converted. These invisibles traverse both the tape data and the ossifiers with no effect. Since each acceptance or rejection event generates a pair of invisibles, they form a permanent record of the entire computation's history.

<img src="/rule110/ossification.png" alt="Invisibles vs ossification" class="img-md" />

*Invisibles vs. ossification (Cook's Figure 14). $\bar{E}$s spaced at regular intervals from each other can either pass invisibly through the $A^4$ array or be ossified into $C_2$s, based solely on their relative spacing. The five $\bar{E}$s shown have different spacings from each other, producing a mix of crossings and conversions.*

## The Chain of Reductions

Cook's goal is to show that Rule 110 can simulate any Turing machine. He does this by chaining three reductions, each simplifying the computational model until it maps onto glider interactions.

A tag system operates on a word over a finite alphabet. At each step, the first symbol determines a production string that gets appended to the end, and the first $s$ symbols are deleted. Tag systems can simulate Turing machines; the TM's tape contents are encoded into the exponents of repeated symbols, using a base-$s$ positional system. This means each additional tape cell multiplies the word length by $s$.

A cyclic tag system (CTS) simplifies tag systems down to a binary alphabet $\{Y, N\}$ and a fixed cyclic list of appendants. At each step, the first bit is read and deleted. If it was Y, the current appendant is appended; if N, nothing happens. The appendant pointer advances cyclically regardless. Tag symbols are encoded via one-hot encoding: symbol $k$ becomes a block of bits with a single Y at position $k$. This means a tag alphabet of size $|\Phi|$ produces $|\Phi|$ appendants (plus empty padding ones).

The critical observation is that a CTS step maps naturally onto glider collisions: a moving object reads a stationary object, and the result either propagates or doesn't.

## Glider Systems

With these mechanisms in hand (crossing, ossification, invisibles) Cook defines an abstract glider system for simulating a cyclic tag system. The cast:

- **Tape data** — stationary $C_2$ clusters encoding the CTS tape as Y/N values (spacings between $C_2$ pairs)
- **Table data** — $\bar{E}$ clusters gliding in from the right, encoding one appendant's bits
- **Leaders** — a preparatory glider that arrives before each appendant's table data and hits the first piece of tape data
- **Rejectors** — produced when a leader hits an N. The rejector destroys each subsequent component (table data unit) until absorbed by the next leader.
- **Acceptors** — produced when a leader hits a Y. The acceptor crosses over each component, converting it into moving data ($\bar{E}$s) that travels left through the rest of the tape.
- **Ossifiers** — $A^4$ clusters on the left that convert the moving data back into new stationary tape data ($C_2$ clusters), appending it to the tape's end.

One CTS step works like this: a leader arrives from the right and reads the first tape symbol. If it's N (reject), the appendant is destroyed. If it's Y (accept), the appendant is converted to moving data, crosses the tape, hits the ossifiers, and becomes new tape data. Either way, the first tape symbol is consumed. This is exactly what a cyclic tag system does: read and delete the first bit, conditionally append.

<img src="/rule110/glideremulatects.png" alt="Glider system emulating a cyclic tag system" class="img-lg" />

*A glider system emulating a cyclic tag system (Cook's Figure 3). Time flows downward. The vertical stripes in the central chaotic region are stationary tape data (Y in black, N in light gray). Leaders arrive from the right as zig-zag patterns. When a leader hits an N, it produces a rejector that wipes out the table data. When it hits a Y, an acceptor converts the table data into moving data that crosses left through the tape, hits the ossifiers on the left, and becomes new tape data.*

---

## The Compilation Pipeline

The pipeline implements these reductions concretely:

$$\text{Turing Machine} \to \text{Tag System} \to \text{Cyclic Tag System} \to \text{Glider System} \to \text{Rule 110}$$

<img src="/rule110/pipeline.png" alt="Pipeline overview" class="img-full" />

*Pipeline overview for $10+21$. Four panels show the TM tape (5 cells), tag system word (10,862 H/L/R symbols), CTS tape (586,548 bits), and R110 regions (338M cells). The blowup at each stage: $2{,}172\times$, $54\times$, $577\times$ - totaling $67{,}704{,}734\times$.*

<video autoplay loop muted playsinline controls class="w-full my-4">
  <source src="/rule110/cascade.mp4" type="video/mp4" />
</video>

*The cascade animation shows the full pipeline blowup: TM tape cells expand into tag symbols, which expand into CTS bits, which expand into the R110 tape.*

### Stage 1: Turing Machine → Tag System

For a TM with $m$ states and $t$ tape symbols, Cook's encoding uses deletion number $s = t + 2$ and an alphabet of $4m + 3ms$ symbols organized into seven families:

$$\Phi = \underbrace{H_{\psi_i}}_m \cup \underbrace{L_{\psi_i}}_m \cup \underbrace{R_{\psi_i}}_m \cup \underbrace{R^*_{\psi_i}}_m \cup \underbrace{H_{\psi_i,\sigma_j}}_{ms} \cup \underbrace{L_{\psi_i,\sigma_j}}_{ms} \cup \underbrace{R_{\psi_i,\sigma_j}}_{ms}$$

The $H$, $L$, $R$ families encode the TM head, left tape, and right tape respectively. The subscript $\psi_i$ indexes TM states; $\sigma_j$ indexes tape symbols. The first four families are "state-only" symbols that expand into symbol-specific variants during execution:

$$H_{\psi_i} \to H_{\psi_i,\sigma_0}\ H_{\psi_i,\sigma_1}\ \cdots\ H_{\psi_i,\sigma_{s-1}}$$

The symbol-specific productions encode TM transitions. For $\delta(i, j) = (G, Y, \text{LEFT})$:

$$H_{\psi_i,\sigma_j} \to (R^*_G)^{s(s-Y)}\ (H_G)^{j+1}$$
$$L_{\psi_i,\sigma_j} \to L_G \qquad R_{\psi_i,\sigma_j} \to (R_G)^{s^2}$$

Halt transitions produce empty strings, eventually shrinking the word below the deletion threshold.

The initial word is encoded exponentially. For a tape $\ldots\ b_x \ldots b_1\ [c]\ d_1 \ldots d_y\ \ldots$ with the head on symbol $c$ in state $\gamma$:

$$w_0 = (H_\gamma)^{1+s-c}\ (L_\gamma)^{s^{x+1} + \sum_{k=1}^{x}(s-b_k)\cdot s^k}\ (R_\gamma)^{\sum_{k=1}^{y}(s-d_k)\cdot s^k}$$

Tape contents go into the *exponents* using a base-$s$ positional system. For our addition TM ($m=2$, $t=5$, so $s=7$):

- $|\Phi| = 4(2) + 3(2)(7) = 50$ symbols
- 5-cell tape → initial word length: 10,862 symbols
- Compare with $3+7$ (3 cells): only 220 symbols. Two extra tape cells multiply by $\sim 7^2 = 49\times$.

### Stage 2: Tag System → Cyclic Tag System

The conversion uses one-hot encoding: each tag symbol $k$ from an alphabet of size $|\Phi|$ is encoded as a block of $|\Phi|$ bits with a single 1 at position $k$:

$$\text{symbol } k \mapsto \underbrace{0 \cdots 0}_{k}\ 1\ \underbrace{0 \cdots 0}_{|\Phi|-1-k}$$

The tag system's deletion number $s$ means $s$ symbols are consumed per step, which in the CTS translates to $s \cdot |\Phi|$ bits read per tag-step cycle. Of these, exactly $s$ are Y bits (one per symbol), each triggering the corresponding appendant. The other $(s-1) \cdot |\Phi|$ are N bits with empty appendants.

For $10+21$: $|\Phi| = 50$, padded to 54 (Rule 110 block alignment requires multiples of 6). Appendants: 54 real + 324 empty = 378. Initial CTS tape: 586,548 bits. The CTS halts after 46,103,904 steps.

### Stage 3: CTS → Rule 110

The CTS tape and appendants are spatially encoded into a Rule 110 initial condition using twelve block types (A through L), each a precomputed bit pattern that produces specific glider structures when evolved:

| Block | Role | Glider interpretation |
|:---:|:---|:---|
| A | Ether (background) | Pure ether |
| B | Left periodic marker | Clock signal boundary |
| C | Central origin | Origin marker |
| D | CTS tape separator | Boundary between tape symbols |
| E | CTS tape bit = 0 (N) | $C_2$ cluster with wide spacing |
| F | CTS tape bit = 1 (Y) | $C_2$ cluster with narrow spacing |
| G | Tape terminator | End-of-tape marker |
| H-L | Appendant encoding | Components and leaders from the right |

The initial tape has three regions:

$$\underbrace{A^v\ B\ A^{13}\ B\ A^{11}\ B\ A^{12}\ B}_{\text{left periodic (ossifiers)}} \quad \underbrace{C\ [E|F]\ D\ [E|F]\ D\ \cdots\ [E|F]\ G}_{\text{central (tape data)}} \quad \underbrace{[KHIIJ \cdots | L]\ \cdots\ K}_{\text{right periodic (appendants)}}$$

**Central part:** Block C marks the origin. E/F blocks encode CTS tape bits (N/Y), separated by D blocks. This is the stationary $C_2$ tape data from the glider system. G terminates the tape.

**Right periodic part:** Encodes the CTS appendants as leaders and components. Each non-empty appendant becomes $K\ H\ I\ [I|J]\ I\ [I|J]\ \cdots$ where $II$ encodes a Y-bit and $IJ$ encodes an N-bit. Empty appendants become a single L block ("short leaders"). This is the table data that glides in from the right.

**Left periodic part:** The $A^4$ ossifier array. The ether gap $v$ determines the clock rate:

$$v = 76 Y_s + 80 N_s + 60 E_{\text{nonempty}} + 43 E_{\text{empty}}$$

where $Y_s$, $N_s$ count 1-bits and 0-bits across all appendants.

Each block is emitted at a specific phase (0-29) that determines its exact bit pattern. The phase accumulator starts at 18 and advances via $\phi' = (8 - r + \phi) \bmod 30$ where $r$ is a block-specific constant.

For $10+21$, the compiled tape has 338,523,672 cells:

| Region | Content | Size | % |
|:---|:---|---:|---:|
| Left periodic | Ossifier array (ether clock) | 97,155,599 | 28.7% |
| Central | CTS tape as E/F/D blocks | 222,019,435 | 65.6% |
| Right periodic | Appendants as H-L blocks | 19,348,638 | 5.7% |

---

## Simulation Engine

### Direct Simulation

The tape is bit-packed into `uint64_t` words. Rule 110 reduces to a single bitwise operation:

```cpp
uint64_t new_word = (center ^ right) | (~left & right);
```

With 4x loop unrolling, the 338M-cell tape (~5.3M words, ~42 MB) processes one generation in ~38ms. The first 4,800 generations are computed this way to produce the head spacetime image.

### HashLife Acceleration

Direct simulation of 2.9 billion generations would take ~3.5 years. I adapted Bill Gosper's HashLife algorithm for 1D with ring topology.

The key data structure is a canonical binary tree where each node represents $2^k$ cells:

```cpp
struct Node {
    Node* child[2];  // left/right halves
    Node* result;    // memoized step result
    int level;       // 0=leaf, k means 2^k cells
};
```

Every `(left, right)` pair maps to a unique `Node*` via a hash table, so identical subtrees share the same node. Since ether dominates the tape (~96% of cells), the tree is extremely sparse. `step(node)` computes the central $2^{k-1}$ cells after $2^{k-2}$ generations. Because nodes are canonical, identical configurations are never recomputed.

`step_by(node, n)` computes the result after exactly $n$ generations by recursively decomposing:

$$\text{step\_by}(\text{node}, n) = \begin{cases}
\text{step}(\text{node}) & \text{if } n = 2^{k-2} \\
\text{join}(\text{step\_by}(\text{left half}, n), \text{step\_by}(\text{right half}, n)) & \text{otherwise}
\end{cases}$$

The HashLife tree grows to ~40M nodes and advances through 2.9B generations in ~2,262 seconds - an 18,000x speedup over direct simulation.

### Settling Detection

The computation is done when the tape has settled into pure ether. I detect this by comparing the tape at generation $g$ with the tape at generation $g - 720$, offset by 720 cells:

$$\text{mismatch}(g) = \sum_{i} \mathbb{1}\left[\text{cell}(g, i) \neq \text{cell}(g-720, i-720)\right]$$

Why 720? Ether shifts 24 cells per generation with temporal period 30. After 720 generations ($= 24 \times 30$), the ether completes its full spatiotemporal cycle. When the mismatch drops below 300, the tape has settled.

### Active Width Tracking

To track computation progress, we measure the active width: the region of the tape that hasn't yet settled into ether. This is computed by scanning inward from both edges of the central region, looking for the first period-14 break:

```cpp
// From left: find where ether ends
for (size_t i = start + 14; i < end; i++)
    if (cell(i) != cell(i - 14)) { left_ether = i - start; break; }

// From right: find where ether ends
for (size_t i = end - 15; i > start; i--)
    if (cell(i) != cell(i + 14)) { right_ether = end - 1 - i; break; }

active_width = total_width - left_ether - right_ether;
```

The active width starts at the central region size and narrows as ether fills in from both sides, collapsing to zero at settling. For $10+21$, this means ~222M active cells narrowing over nearly 3 billion generations.

---

## The 10 + 21 Computation

The binary addition TM encodes two numbers by interleaving their bits: $10 = 01010_2$, $21 = 10101_2$ - complementary bit patterns. The tape symbol is $1 + x_{\text{bit}} \cdot 2 + y_{\text{bit}}$, giving symbols in $\{1, 2, 3, 4\}$. The machine scans right, propagating carries.

<img src="/rule110/tm_trace.png" alt="TM execution trace" class="img-full" />

*TM execution trace for $10+21$. Each row shows the tape at one step. The machine scans right and halts after 5 steps.*

Initial tape: $[2, 3, 2, 3, 2]$. Final tape: $[2, 4, 2, 4, 2, 0]$. Decoding: $11111_2 = 31$. So $10 + 21 = 31$.

After compilation through the full pipeline:

| Metric | Value |
|:---|:---|
| Tag system alphabet ($|\Phi|$) | 50 (padded to 54) |
| Tag word length | 10,862 |
| CTS appendants | 378 |
| CTS tape length | 586,548 bits |
| CTS steps to halt | 46,103,904 |
| R110 total cells | 338,523,672 |
| Settling generation | 2,918,400,960 |
| Compile time | 1,308 ms |
| Simulation time | 2,286 s |
| Total blowup | $67.7\text{M}\times$ |

Five steps of a Turing machine, faithfully simulated through nearly 3 billion generations across 338 million cells.

---

## Spacetime Diagrams

<img src="/rule110/head_combined.png" alt="Head spacetime combined" class="img-full" />

*Head spacetime (generations 0-4,800). Left and right views of the full 250,000-cell viewport (downsampled). The gap between panels indicates the 338M total cells. Left: left periodic ether (ossifier array, gray). Right: central tape data (colored E/F/D stripes - blue for 0-bits, green for 1-bits, orange separators) meeting the right periodic appendants (pink/red).*

<img src="/rule110/head_r_annotated.png" alt="Right view annotated" class="img-full" />

*Right view annotated. Leaders arrive as diagonal zig-zag patterns from the right, hitting stationary tape data (vertical colored stripes). Accept events produce leftward-moving $\bar{E}$ traces that cross the tape; reject events produce rightward rejectors that destroy the incoming table data. Magenta regions are glider collisions.*

<img src="/rule110/tail_combined.png" alt="Tail spacetime combined" class="img-full" />

*Tail spacetime showing the final moments before settling. The active computation has narrowed to a thin strip, with ether filling in from both sides as the active width collapses to zero.*

The full evolution from generation 0 to settling at ~2.9B, compressed with logarithmic Y axis:

<img src="/rule110/spacetime.png" alt="Full spacetime" class="img-full" />

### Convergence

<img src="/rule110/mismatch_plot.png" alt="Mismatch plot" class="img-full" />

*Mismatch count (blue) and active width (orange) over time. Mismatch initially rises as glider interactions spread, then collapses as the computation completes. Active width narrows monotonically as ether fills in from both edges of the central region.*

---

## Animations

<video autoplay loop muted playsinline controls class="w-full my-4">
  <source src="/rule110/tag_anim.mp4" type="video/mp4" />
</video>

*Tag system animation. The bar is colored by symbol family - orange (H/head), blue (L/left tape), green (R/right tape). The red bracket marks the deletion region (first $s = 7$ symbols). Width scales with word length.*

<video autoplay loop muted playsinline controls class="w-full my-4">
  <source src="/rule110/cts_anim.mp4" type="video/mp4" />
</video>

*CTS animation. The green bar shrinks as bits are consumed over 46M steps.*

<video autoplay loop muted playsinline controls class="w-full my-4">
  <source src="/rule110/head_reveal.mp4" type="video/mp4" />
</video>

*Progressive top-to-bottom reveal of the Rule 110 spacetime diagram, cropped to the data region.*

---

## Verification

Correctness is verified at five levels, from individual pipeline stages through end-to-end round-trip decoding:

1. **TM verification** — run the TM directly, verify the final tape and step count
2. **Tag verification** — TM → Tag, run, verify halting agreement
3. **CTS verification** — full pipeline through CTS, round-trip decode each one-hot block:

$$\forall i: \text{CTS\_tape}[i \cdot |\Phi| + k] = 1 \iff k = \text{tag\_word}[i]$$

4. **R110 structure** — verify left periodic ether satisfies the shift-24 property:

$$\text{cell}(0, i-24) = \text{cell}(1, i) \quad \forall i \in [1000, 101000]$$

5. **Round-trip decode** — from the compiled R110 tape, decode back through the full pipeline. The tag word is parsed as $(H_\gamma)^a (L_\gamma)^b (R_\gamma)^c$, and the exponents are base-$s$ decoded back to a TM tape. The decoded configuration must exactly match the actual TM state.

```
Checks:
  TM halts <=> CTS halts: PASS
  R110 settled: PASS

  10 + 21 = 31  (computed through Rule 110)
```

All seven test cases pass all five verification levels.

## Base Test Cases

The same pipeline runs on simpler TMs. Here are three base cases on 2-symbol machines.

### Immediate Halt

A 1-state TM that halts immediately: 0 computation steps, but still produces a 2.5M-cell R110 tape that settles in 1.7M generations. The entire overhead comes from the encoding, not the computation.

<img src="/rule110/immediate_halt/pipeline.png" alt="Immediate halt pipeline" class="img-full" />

<img src="/rule110/immediate_halt/head_annotated.png" alt="Immediate halt spacetime" class="img-full" />

*Even with zero computation, the tape produces glider traces. The left periodic ether dominates since the central region encodes only a single tape cell.*

<video autoplay loop muted playsinline controls class="w-full my-4">
  <source src="/rule110/immediate_halt/cascade.mp4" type="video/mp4" />
</video>

### Binary Increment

A 3-state TM that increments a binary number (5 steps). 30.8M cells settling in 20M generations. The most complex 2-symbol test case, with the largest transition table.

<img src="/rule110/binary_increment/pipeline.png" alt="Binary increment pipeline" class="img-full" />

<img src="/rule110/binary_increment/head_combined.png" alt="Binary increment spacetime" class="img-full" />

*Head spacetime for binary increment. The right panel shows denser glider interactions than simpler test cases, reflecting the 3-state TM's larger transition table and 86K CTS steps.*

<video autoplay loop muted playsinline controls class="w-full my-4">
  <source src="/rule110/binary_increment/head_reveal.mp4" type="video/mp4" />
</video>

### Unary Increment

A 2-state TM that appends a tally mark (2 steps). 13.2M cells.

<img src="/rule110/unary_increment/pipeline.png" alt="Unary increment pipeline" class="img-full" />

<img src="/rule110/unary_increment/head_combined.png" alt="Unary increment spacetime" class="img-full" />

*Head spacetime for unary increment. Sparser glider traces than binary increment — fewer CTS steps (15K vs 86K) means fewer leader/appendant interactions.*

<video autoplay loop muted playsinline controls class="w-full my-4">
  <source src="/rule110/unary_increment/cascade.mp4" type="video/mp4" />
</video>

### Binary Addition (3 + 7)

The same addition TM but with a 3-cell tape. 121M cells settling in 89M generations. Same TM, different input size - useful for seeing how the exponential encoding scales.

<img src="/rule110/3_7/pipeline.png" alt="3+7 pipeline" class="img-full" />

<img src="/rule110/3_7/head_combined.png" alt="3+7 spacetime" class="img-full" />

*Compare the region proportions with $10+21$: here the left periodic ether dominates (80.3%) because the central region is much smaller (11.8K CTS bits vs 586K).*

<video autoplay loop muted playsinline controls class="w-full my-4">
  <source src="/rule110/3_7/head_reveal.mp4" type="video/mp4" />
</video>

## Scaling

The gens/CTS step ratio varies dramatically:

| Test | CTS Steps | Settling Gen | Gens/CTS Step |
|:---|---:|---:|---:|
| Immediate halt | 288 | 1,743,330 | 6,053.2 |
| Left-then-halt | 2,880 | 8,001,390 | 2,778.3 |
| Unary increment | 15,264 | 10,875,420 | 712.5 |
| Binary increment | 86,592 | 20,060,730 | 231.7 |
| Addition ($3+7$) | 861,840 | 89,419,080 | 103.8 |
| Addition ($10+21$) | 46,103,904 | 2,918,400,960 | 63.3 |

Trivial computations pay high overhead; as complexity grows, the ratio approaches a more efficient regime. The tape size grows as $O(s^{|\text{tape}|})$ — each additional tape cell multiplies everything by $s$. Two extra tape cells from $3+7$ to $10+21$ multiply the tag word by $7^2 = 49\times$, cascading through every stage.

This construction is spectacularly impractical for actual computation. That was never the point.

---

## Implementation

```
TuringMachine          (concrete state machine)
    |
    v  [TMToTag — Cook's symbol algebra]
TagSystem              (word + deletion number + production rules)
    |
    v  [TagToCyclic — one-hot encoding, alphabet padding to mod 6]
CyclicTagSystem        (binary tape + cyclic appendants)
    |
    v  [Rule110Compiler — block emission with phase-tracked alignment]
Rule110State           (three-region bit vector + block maps)
    |
    v  [Rule110Runner — 64-bit parallel simulation]
    v  [HashLife1D — quadtree memoization for exponential speedup]
    |
    v  [BlockDetector — visualization]
    v  [Decoder — round-trip verification R110 → CTS → Tag → TM]
```

Each layer is independently testable. The 12 block types (A-L) are precomputed bit patterns stored in `BlockData.hpp` (497 lines, ~147 KB). Each block has a pattern for each of 30 phases. Block A (ether) is 28 bits wide and identical across all phases. Other blocks range from 22 to 350 bits depending on phase.

The `BlockDetector` tracks clusters across generations by matching period-14 breaks (non-ether regions). Each cluster inherits its block type from the previous generation via nearest-center matching (within 50 cells). Collisions between glider structures are detected and colored magenta.

The simulator runs in three phases: direct simulation for the first 4,800 generations (producing the head spacetime image), HashLife with exponentially growing step sizes to find the settling point, then a rolling-buffer direct simulation for the tail image. During HashLife, ~1000 spacetime crops are sampled at logarithmically-spaced generations for the full-evolution diagram.

The hardest parts were HashLife and phase tracking. HashLife on a ring topology with partial stepping required careful verification: the memoization makes it difficult to debug when results are wrong, since the error could originate from any cached subtree. I validated by comparing HashLife results against direct simulation for the first few thousand generations. Phase tracking (ensuring each block is emitted at the correct phase offset so glider structures align properly) was similarly tedious; a single off-by-one in the phase accumulator produces a tape that looks almost right but fails to compute.

CMake 3.10+, C++17. No external C++ dependencies.

---

This project mechanizes Cook's universality proof for Rule 110. Given any Turing machine, the compiler produces a Rule 110 tape, the simulator evolves it to completion, and round-trip decoding confirms the result.
