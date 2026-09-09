---
title: 'Atomic Settlement on Tempo'
date: 'Sep 8, 2026'
description: 'A universal Delivery-versus-Payment and Receive-versus-Payment settlement engine for Tempo, with signed instructions, modular asset adapters, and no prefunded escrow.'
tags: [Tech]
slug: tempo-dvp
subtitle: 'Universal DvP/RvP without escrow'
image: '/tempo-dvp.svg'
---

An onchain trade moves at least two balances. The seller delivers an asset and the buyer makes payment. Delivery-versus-Payment (DvP) states the seller’s condition: delivery only happens if payment succeeds. Receive-versus-Payment (RvP) states the buyer’s: payment only happens if the asset is received.

I built a settlement engine on Tempo that executes both conditions in one transaction without escrowing either asset beforehand. Each leg independently selects an adapter, so the same instruction format can pair fungible tokens, NFTs, token batches, vault positions, wrapped native assets, custodian-held funds, or payment FX.

[Check out the code here.](https://github.com/pyInvenio/tempo-dvp) The repository also has the complete [testnet walkthrough](https://github.com/pyInvenio/tempo-dvp/blob/main/docs/06-deployment.md#moderato-end-to-end-tutorial).

---

## The Problem

The normal implementation of a sale is two `transferFrom` calls:

```text
payment.transferFrom(buyer, seller, 25)
asset.transferFrom(seller, buyer, 3)
```

Inside one EVM transaction, this is already atomic. If the second call reverts, the first one reverts with it. Solidity can execute payment first without leaving the buyer exposed because the final unit of commitment is the transaction, not the individual external call.

`UniversalDVP` does not improve that rollback property. A purpose-built swap containing the same two calls is equally atomic.

Atomicity does not specify the instruction being settled. An institutional transaction must also bind authority, asset identity, execution route, quantities, deadlines, evidence, and replay behavior.

## What this copies from institutional finance

DvP predates blockchains. Securities settlement systems use it to ensure that final delivery occurs if and only if final payment occurs. The [BIS describes three models](https://www.bis.org/cpmi/publ/d06.pdf): gross securities against gross funds, gross securities against net funds, and net securities against net funds.

This contract is closest to Model 1. One settlement—or one hierarchical leaf—moves its asset and payment legs gross and atomically. It does not net a participant's obligations across a settlement cycle.

The institutional pattern also separates trading from settlement. A trade is executed and affirmed upstream; later, matched instructions reach the settlement system. In TARGET2-Securities, for example, securities accounts and central-bank cash accounts sit on a common platform, and matched instructions settle DvP. The [ECB describes the money and securities changing hands simultaneously](https://www.ecb.europa.eu/paym/t2s/html/index.en.htmlpub/pdf/mobu/mb200711en.pdf). Block-trade allocation is also an upstream post-trade process: the investment manager tells the broker how the aggregate execution maps to underlying funds before settlement. [DTCC describes that allocation and affirmation workflow](https://www.dtcc.com/dtcc-connection/articles/2022/march/21/the-results-are-in-automated-institutional-trade-processing-required).

The onchain version keeps the same separation:

```text
execution / agreement -> affirmation / authorization -> settlement
```

The matching engine or portfolio system agrees the trade. The parties authorize its exact terms. `UniversalDVP` performs the final exchange. A `contentDigest` links the settlement back to the confirmation or allocation file without asking the contract to become the trading system or document store.

| Institutional function              | Onchain analogue                                      |
| ----------------------------------- | ----------------------------------------------------- |
| Matched settlement instruction      | Stored `Settlement` plus buyer credential             |
| Securities account and cash account | Independently selected asset and payment adapters     |
| Settlement reference                | Single-use `settlementId`                             |
| Settlement operator                 | Permissionless relayer that cannot alter signed terms |
| Block-allocation file               | Merkle root with independently proven allocations     |

Tokenizing both legs on one ledger removes the need to coordinate a securities ledger with a separate cash ledger. The [BIS describes single-ledger token settlement](https://www.bis.org/publications/future-securities-settlement) as atomic settlement that can achieve gross DvP. The improvement here is not a new form of transaction atomicity; it is a programmable settlement instruction for assets that already share the EVM.

This contract does not reproduce a CSD, central-bank money, settlement-bank guarantees, netting, auto-collateralization, or legal finality. Those are separate institutional functions.

## Atomic call versus DvP instruction

A one-off atomic buy function is enough when one application controls the workflow, the asset pair is fixed, the caller is the payer, and reconciliation only needs a transaction hash. The DvP model becomes useful when settlement must be a reusable boundary shared by trading, custody, treasury, and operations systems.

| Property                                | One-off atomic buy/sell                  | DvP instruction                                  |
| --------------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| Roll back both legs together            | Yes                                      | Yes                                              |
| Record terms before execution           | Application-specific                     | Explicit `INITIATED` state and deadlines         |
| Buyer consent                           | Caller or application-specific signature | EIP-712 signature over every economic term       |
| Separate authorization from submission  | Usually coupled                          | Any relayer may submit an unchanged instruction  |
| Asset and execution route               | Hardcoded by the function                | Signed adapter and payload for each leg          |
| Duplicate prevention                    | Application-specific                     | Permanent settlement-ID tombstone                |
| Reconciliation                          | Decode transaction-specific calldata     | Settlement ID, content digest, state, and events |
| Custody, FX, redemption, and allocation | Separate bespoke paths                   | One authorization and settlement state machine   |

None of these controls is impossible in an ordinary swap contract. If an application adds all of them, it has effectively built its own DvP settlement layer. The value of the model is making that layer explicit and reusable instead of rebuilding it inside every marketplace, treasury tool, or tokenization product.

“Better” here means a better abstraction for shared institutional settlement, not stronger rollback than the EVM and not a claim that a new contract is safer than mature market infrastructure.

## Where modern institutions need DvP

A retail token swap usually collapses several roles into one wallet. The wallet chooses the trade, holds the tokens, approves the tokens, and submits the transaction. Institutional systems separate those jobs.

Consider a client buying 1,000 tokenized fund shares for 100,000 deposit tokens:

```text
portfolio system agrees the trade
buyer/trader authorizes the instruction
custodian account holds the payment
fund or dealer holds the shares
transfer agent retains the confirmation
omnibus position is allocated to beneficial accounts
```

For a neobank, the payment token may represent its own deposit liability rather than a generic coin. Exchanging that liability for a fund share or security changes positions on both sides. If the legs are sequenced, whichever institution moves first extends unsecured exposure until the other leg completes. Every exception then needs limits, reconciliation, and a recovery process. Same-transaction DvP reduces that interval to zero for assets available to the transaction.

Without a shared settlement boundary, these become a sequence of operations. Payment can confirm before delivery fails. Delivery can complete while the payment approval has been revoked. An FX trade can execute without the asset transfer. The omnibus account can receive 1,000 shares while the administrator records allocations totaling 990. Each failure produces a receivable, a manual return, or a mismatch between the chain and the books.

| Failure                                               | Result without DvP                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| Payment succeeds; delivery fails                      | Buyer has paid and must recover the money                          |
| Delivery succeeds; payment fails                      | Seller has delivered and becomes a creditor                        |
| Relayer changes token, amount, or route               | Execution no longer matches buyer authorization                    |
| The same instruction is submitted twice               | Duplicate settlement unless every surrounding system is idempotent |
| Onchain transfer cannot be joined to the confirmation | Operations must reconcile by time, amount, and counterparty        |

For this transaction, the DvP instruction becomes the join point between systems. The TIP-403 adapter lets the trader authorize payment from a custodian account. The digest commits to the retained confirmation. The Merkle root commits to the beneficial-owner allocation. One settlement ID follows the transaction through execution, settlement, and reconciliation.

The seller creates the instruction, the named buyer signs every economic term, and any account can relay it. The buyer signature is the RvP authorization. Successful execution of the same instruction provides DvP to the seller. If either leg fails, the state write, both transfers, and any intermediate conversion revert.

This is useful when a neobank has tokenized liabilities—such as deposit tokens—and settles them against assets controlled by another party: fund shares, tokenized securities, invoices, collateral, or other deposit tokens. It also applies when treasury conversion or vault redemption must occur inside the same failure boundary.

It is not required for every banking operation. A transfer between two accounts on one internal ledger can be committed atomically in the bank's database. If one leg is an offchain wire or an asset on another chain, this contract cannot make the pair atomic. The relevant case is two independently controlled assets that can both move in one Tempo transaction.

## Direct Settlement

Pre-funding both legs would reserve their availability, but would also require cancellation, expiry withdrawals, refunds, receiver hooks, and stuck-asset recovery. The protocol has no escrow mode.

Initiation stores terms but moves no value. At execution, each adapter transfers directly from its source account to its recipient. Before and after a normal settlement, the contract’s intended balance is zero.

This changes the guarantee. A pending instruction is not a reservation. The seller can move the asset; the buyer can move the payment; either can revoke approval. If they do, settlement fails atomically.

## The Instruction

Each settlement stores a single-use ID and the full terms:

```solidity
struct Settlement {
    address assetAdapter;
    uint96 assetAmount;
    address paymentAdapter;
    uint96 paymentAmount;
    address seller;
    uint64 expiresAt;
    State state;
    address buyer;
    uint64 expiresAtBlock;
    bool isHierarchical;
    bool used;
    bytes32 contentDigest;
    bytes32 assetPayloadHash;
    bytes32 paymentPayloadHash;
    uint96 paymentSettled;
    uint96 assetSettled;
}
```

The payload hashes are important. An adapter address says which program moves the asset; its payload says what that program acts on. For an ERC-20 it contains the token address. For an ERC-721 it contains the collection and token ID. For an ERC-4626 position it also specifies whether to transfer shares or redeem them, plus the minimum acceptable underlying output.

The buyer’s EIP-712 signature covers the settlement ID, digest, parties, adapters, payload hashes, amounts, deadlines, and hierarchy flag. A relayer can pay gas and choose when to submit within the deadline, but cannot replace NFT `#381` with `#382`, switch the payment token, widen the FX slippage, or turn a share transfer into a redemption.

IDs are tombstoned permanently. Cleanup can delete the large record after settlement or expiry, but the same ID can never become valid again. An old signature has nowhere to replay.

## Evidence

`contentDigest` is a 32-byte commitment to whatever gave the transfer meaning outside the EVM: a trade confirmation, invoice, allocation file, subscription document, or delivery record.

The contract does not know what the digest means. It cannot prove that the document is true, legally binding, or still available. It proves a narrower fact: this exact document hash was part of the instruction the buyer signed and the chain executed.

A matching engine, portfolio manager, invoice workflow, or fund administrator produces the terms upstream. The digest is the join key from the onchain execution back to that record.

## Adapters

Hardcoding every asset standard into the core contract grows bytecode and makes every new integration a rewrite. Allowing users to supply arbitrary execution code is worse; an arbitrary `delegatecall` target effectively owns the settlement contract.

The universal engine uses an immutable middle ground. The constructor fixes an adapter allowlist for the lifetime of the deployment. Every settlement chooses from that set, and the buyer signs the chosen adapter addresses.

| Adapter             | Payload                               | Action                                                       |
| ------------------- | ------------------------------------- | ------------------------------------------------------------ |
| ERC-20 / TIP-20     | token                                 | Call `transferFrom` for the specified units                  |
| ERC-721             | token, token ID                       | Transfer one unique token                                    |
| ERC-1155            | token, token ID                       | Transfer units of one position                               |
| Batch ERC-721       | token, token IDs                      | Transfer an NFT basket                                       |
| Batch ERC-1155      | token, IDs, amounts                   | Transfer a semi-fungible basket                              |
| ERC-4626            | vault, redeem flag, minimum output    | Transfer shares or redeem to underlying                      |
| Wrapped native      | wrapped token, unwrap flag            | Transfer wrapped value or deliver native value               |
| TIP-403 delegation  | token, custodian                      | Transfer custodian-held funds for an approved trader         |
| Stablecoin exchange | source, target, input, minimum output | Convert through Tempo’s stablecoin DEX and pay the recipient |

Adapters execute by `delegatecall`. Approvals therefore point at `UniversalDVP`, not the adapter. Each canonical adapter rejects direct calls and has no mutable storage, but the allowlist remains the code-execution boundary. Supporting a new adapter requires a new deployment.

The separation keeps the core at 10,367 bytes of runtime code, 14,209 bytes below the EVM contract-size limit. The optimized TIP-20-only engine is 7,755 bytes. Asset-specific logic lives once in each adapter rather than being copied into the core.

---

## Examples

### NFT against a deposit token

A seller delivers ERC-721 `#381`; a buyer pays 50,000 units of a deposit token.

```text
seller -- ERC-721 #381 -----------> buyer
buyer  -- 50,000 deposit tokens --> seller
```

The asset payload commits the collection and token ID. `assetAmount` must equal one. If the seller no longer owns `#381`, its transfer reverts and the 50,000-token payment rolls back.

There is no listing, bid, matching, fee schedule, or price discovery. The contract receives already-agreed terms.

### Vault redemption against payment

A fund holder sells 1,000 ERC-4626 shares, but the buyer wants the underlying asset rather than the shares. The asset adapter first pulls the shares into the transaction, redeems them to the buyer, and checks a signed `minAssetsOut` floor.

```text
seller vault shares -> redeem -> underlying -> buyer
buyer payment ------------------------------> seller
```

If redemption returns less than the floor, the redemption and payment both revert. The intermediate vault shares exist at the settlement address only inside the transaction; there is no resting position.

### Custodian-funded payment

The buyer authorizing a payment is not always the account holding the funds. The TIP-403 path separates the trader from the custodian.

```text
buyer/trader signs instruction
custodian approves buyer/trader in registry
custodian approves UniversalDVP at the token
custodian payment ----------------> seller
seller asset ---------------------> buyer
```

Both approvals are required. Revoking either one blocks future execution. The current registry approval is global to a `(custodian, trader)` pair; token and notional limits come from the underlying allowance. A deployment needing narrower policy should encode it in a separately reviewed registry.

### Payment with atomic FX

The buyer holds one stablecoin and the seller prices in another. The FX adapter pulls a bounded source amount, trades through Tempo’s stablecoin DEX, delivers the contractual target amount, and refunds surplus output.

```text
buyer USDC -> DEX -> 25 PathUSD -> seller
seller asset --------------------> buyer
```

The source amount and minimum target output are signed. If liquidity disappears or the rate moves past the bound, the whole settlement reverts. There is no period where the buyer has paid but the seller is waiting for conversion.

### Omnibus allocation

A block trade may have one seller and buyer but hundreds of beneficial recipients. Storing the allocation file at initiation would duplicate the whole file onchain. Hierarchical mode stores its 32-byte Merkle root instead.

Each allocation is hashed as:

```text
Li = keccak256(abi.encode(
  LEAF_TYPEHASH,
  deliveryDigest,
  paymentAmount,
  assetAmount,
  assetRecipient,
  assetPayloadHash,
  paymentPayloadHash
))
```

Internal nodes sort their two inputs before hashing:

```text
H(a, b) = keccak256(min(a, b) || max(a, b))

L0          L1          L2          L3
 \          /            \          /
    H01                       H23
       \                     /
                  root
```

An odd node is paired with itself. Sorting the pair at every level matches OpenZeppelin's `MerkleProof`, which the contract uses onchain.

Suppose a 1,000-share block trade is allocated equally across four accounts, with total payment of 100,000 units. The parent instruction commits the root, 1,000 shares, and 100,000 payment units. Each leaf commits one recipient, 250 shares, and 25,000 payment units. A relayer submits one leaf and its two-hash proof rather than the other three allocations.

The contract verifies the proof, checks that the leaf has not been claimed, requires its two payload hashes to match the parent, and increments the asset and payment totals. It then moves that leaf's payment from buyer to seller and the asset from seller to the leaf recipient. The state remains `INITIATED` after the first three allocations and becomes `SETTLED` only when both cumulative totals match the parent.

Claims can arrive in any order. Duplicate leaf hashes are rejected by the Rust tree builder because the onchain claimed set is keyed by leaf hash. Over-allocation reverts, but the contract cannot discover an under-allocation hidden behind a valid root; the tree producer must make both leaf sums equal the parent totals.

Atomicity is per leaf. If three leaves settle and the fourth later expires, the first three do not roll back. That is different from `settleBatch`, which groups up to 100 independent non-hierarchical settlements into one transaction and reverts all of them if one fails. It is also different from an ERC-721 or ERC-1155 batch adapter, where several token IDs form one settlement leg.

All leaves share the parent payload hashes. If allocations require different token contracts, token IDs, vault modes, custodians, or FX routes, they need an adapter-level batch or separate parent settlements.

## Verification

The implementation is checked at four levels:

1. Core behavior — initiation, settlement, expiry, cleanup, replay, deadlines, ERC-1271 signatures, and exact rollback behavior.
2. Adapter behavior — ERC-721, ERC-1155, batches, vault redemption floors, native unwrap, delegated custody, and stablecoin FX failure cases.
3. Stateful invariants — settlement states only move forward, IDs stay used, token conservation holds, and the contracts retain no intended custody or optimized-path allowance.
4. Cross-language vectors — Solidity and Rust independently reproduce the same type hashes, authorization digests, signatures, and content digests.

`./scripts/check.sh` currently reports 128 passing Solidity tests. The CI profile runs each invariant suite for 256 runs of 64 calls and the universal round-trip fuzz test for 10,000 inputs. Rust passes 32 unit tests and three integration/vector tests.

The important negative tests are the ones where payment executes first and delivery then fails. Moving the seller’s asset, supplying the wrong NFT ID, missing a custodian approval, exceeding an FX bound, or presenting a forged buyer signature must leave both parties exactly where they started.

Fee-on-transfer and rebasing tokens are outside the canonical adapter assumptions. Cross-chain assets cannot share one EVM transaction and require a separate finality and compensation protocol. The implementation is experimental and unaudited.
