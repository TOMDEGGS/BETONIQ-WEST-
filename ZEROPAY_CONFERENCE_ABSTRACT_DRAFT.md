# ZerôPâŷ Money — Conference Talk Abstract (DRAFT — NOT SUBMITTED)

**Status: draft only. Requires Tom's explicit "send" approval before submission to any conference portal.**

## Suggested target venues
- Real World Crypto (submission portal, academic/industry program committee review)
- DEF CON Crypto & Privacy Village (call-for-papers / lightning talk track)

## Draft Title
"Offline Double-Spend Prevention Without a Live Ledger: A Formally Verified State Machine for NFC-Based Payment Tokens"

## Draft Abstract (≈200 words, typical CFP limit)

Existing offline-capable payment systems (agent banking, POS store-and-forward) tolerate double-spend risk by capping transaction size and reconciling probabilistically after the fact — accepting a bounded fraud window rather than solving the problem. We present a token state machine for NFC-based offline value transfer that makes the token itself single-use by construction, independent of network availability, using a hardware-rooted (PUF-derived) monotonic counter and a first-seen-wins reconciliation invariant at the point of eventual reconnection.

We formalize this protocol in TLA+ and use the TLC model checker to exhaustively verify two safety invariants — token uniqueness and cryptographic attribution of the duplicate-presenting device — and one liveness property, across every reachable ordering of adversarial replay events against up to 5 receiving devices (437 distinct states, zero violations). We also present a negative-control specification with the deduplication mechanism removed, which the same model checker breaks in 5 states, demonstrating the verification is meaningful rather than vacuous.

We discuss what remains intentionally undisclosed at this stage (PUF extraction method, distance-bounding parameters) pending patent and MNDA processes, and invite public scrutiny of the disclosed model.

## Speaker note
Talk would be given by Tom Ugbodaga (Shareholder & CEO, BETONIQ WEST LTD, MSc Computer Systems Security — University of Gloucestershire, England) or a delegated technical reviewer, pending Tom's decision.

## Why this matters for the raise
A conference abstract — even a *rejected* one — is a checkable, timestamped signal that this work is being positioned in front of the real cryptography community, not just described in an investor deck. Acceptance would be materially stronger.

---
*BETONIQ WEST LTD — RC 1496603 — DO NOT SUBMIT without Tom's explicit go-ahead.*
