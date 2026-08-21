# ZerôPâŷ Money — Cryptographic State-Machine Validation of Offline Double-Spend Resistance

**Prepared by:** BETONIQ WEST LTD (RC 1496603)
**Author of record:** Tom Ugbodaga, Shareholder & CEO — MSc Computer Systems Security (University of Gloucestershire — England)
**Classification:** For accredited deep-tech / cryptography technical review only, under Mutual NDA (MNDA)
**Status:** Mathematical/state-machine validation only. No source code, chip-level firmware, or distance-bounding parameters are disclosed in this document.

---

## Abstract

We present a state-machine formalization of the ZerôPâŷ Money offline value-transfer protocol and prove, at the protocol-logic level, that any attempt to duplicate a spent value-token is either (a) rejected at the point of second presentation if the receiving device has any residual connectivity state, or (b) detectably invalidated ("bricked") at the next ledger reconciliation event, with the duplicate's issuing device cryptographically identifiable. This is achieved without either device performing a live balance check against a remote ledger at time of transaction — the defining requirement of a true zero-connectivity payment system, as distinct from "store-and-forward" approaches used by existing offline-capable agent-banking terminals.

## 1. The Problem Formally Stated

Let a value-bearing object *T* (a "token") represent a unit of spendable value held on a hardware-secured element. A double-spend occurs if *T*, or any valid derivative of *T*, is successfully redeemed for value more than once, without both redemptions being reconciled against a shared source of truth at the time of redemption.

Existing offline-capable systems (agent banking, POS store-and-forward) tolerate this risk by capping offline transaction size and probabilistically reconciling later — i.e., they accept a bounded fraud window. A cryptographically sound offline system must instead make the *token itself* single-use by construction, independent of network availability.

## 2. System Model

Two device classes participate: **Origin Devices** (senders, e.g. a merchant terminal or a user's card/phone) and **Receiving Devices** (recipients). Each device is provisioned with a hardware-rooted secret derived from a Physically Unclonable Function (PUF) response unique to its silicon — a value that cannot be extracted or cloned without destroying the chip, and which is never stored in plaintext at provisioning time.

We define the token state machine with five states:

```
[UNISSUED] --(spend event, Origin Device)--> [ISSUED]
[ISSUED]   --(NFC/offline transfer)--------> [IN-TRANSIT]
[IN-TRANSIT] --(signature + counter check pass, Receiving Device)--> [PROVISIONALLY-REDEEMED]
[PROVISIONALLY-REDEEMED] --(reconnect to Solar Mesh Hub, ledger sync)--> [RECONCILED]
[PROVISIONALLY-REDEEMED] --(duplicate nonce detected at sync)--> [INVALIDATED / BRICKED]
```

Each token *T* is the tuple:

**T = (N, V, Pk_A, C_A, Sig_A(N ‖ V ‖ C_A))**

where:
- **N** — a nonce, unique per issuance, derived from the PUF response and a locally monotonic counter (never reused, never externally settable)
- **V** — the value being transferred
- **C_A** — Origin Device A's monotonic issuance counter, which the chip's hardware logic guarantees can only increase, never be rewound or replayed
- **Pk_A** — Origin Device A's public key, bound at provisioning to its PUF-derived identity
- **Sig_A(...)** — a signature over the above, produced only by Device A's secure element, which the Receiving Device verifies before crediting any provisional value

## 3. The Invariant That Prevents Double-Spend

**Claim (Token Uniqueness Invariant):** For any two redemption events *R₁* and *R₂* of the same token *T* at any two Receiving Devices (or the same device twice), if *R₁ ≠ R₂*, then at most one of *R₁, R₂* survives ledger reconciliation as valid.

**Proof sketch:**

1. Because *C_A* is a hardware-enforced monotonic counter, Device A's secure element physically cannot re-issue the same *(N, C_A)* pair twice. A duplicate token can therefore only arise from **replay** — an adversary capturing a valid *T* off Device A and re-presenting the identical *T* to a second Receiving Device, or to the same device twice.

2. Each Receiving Device maintains a local nonce cache (Bloom filter or equivalent) of every *N* it has already provisionally credited. A replay presented to the **same** Receiving Device a second time is rejected immediately at [IN-TRANSIT] — no provisional credit occurs, no reconnection required.

3. A replay presented to a **different** Receiving Device (one with no knowledge of the first redemption, by construction of the offline scenario) *is* accepted provisionally, exactly once, at [PROVISIONALLY-REDEEMED] — this is the unavoidable "fog of war" period inherent to any true zero-connectivity system, and is bounded by the token's Time-To-Live window (72 hours, matched to Solar Mesh Hub supercapacitor/battery cycling).

4. At the next reconnection of **either** Receiving Device to a Solar Mesh Hub, the global spent-token registry (keyed on *N*) is queried. The registry accepts the **first-seen** *N* as [RECONCILED] and marks **every subsequent presentation of the same N** as [INVALIDATED / BRICKED] — cryptographically, not just administratively: the Receiving Device holding the bricked token can no longer produce a valid downstream spend signature chained from that token, because the ledger's rejection is itself signed and propagated back into that device's own local state, poisoning any attempt to further transfer the bricked value.

5. Because *Sig_A* is bound to *Pk_A*, the registry additionally flags **Device A's public key** as having produced a duplicate-nonce event — meaning the origin of the double-spend attempt (rather than merely the fact one occurred) is cryptographically attributable, enabling the operator to freeze or re-provision that specific device without needing to trust any self-reported account activity.

**Conclusion:** The system degrades gracefully to a bounded, self-healing exposure window (the token TTL) rather than an unbounded fraud vector, and every double-spend event is both detected and attributable at reconciliation without requiring either device to have checked a live balance at the moment of the original transaction. This is the property that distinguishes ZerôPâŷ Money from "approve now, verify later" offline agent-banking systems, which cap transaction size specifically because they lack an equivalent invariant.

## 4. What Remains Proprietary (Not Disclosed Here)

This paper deliberately withholds, pending signed MNDA and accredited reviewer engagement:
- The exact PUF response extraction and key-derivation function
- Distance-bounding protocol parameters used to defeat relay/wormhole attacks between Origin and Receiving Devices
- Solar Mesh Hub-to-hub gossip/sync protocol internals
- Firmware and chip-level implementation

**Patent status:** Patent-pending. Full protocol specification available for independent technical due diligence under Mutual NDA to accredited cryptography reviewers or institutional deep-tech investors.

## 5. Independent Verification

BETONIQ WEST LTD is actively engaging an independent cryptography academic reviewer to validate this state-machine model against the full (non-public) protocol specification under NDA. Findings will be made available to prospective investors on request once complete.

---
*BETONIQ WEST LTD — RC 1496603 — Confidential technical document. zeropointfeild_nonwnt@zeropay.site*
