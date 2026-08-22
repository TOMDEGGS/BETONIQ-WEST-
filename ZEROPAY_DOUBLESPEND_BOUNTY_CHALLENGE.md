# ZerôPâŷ Money — Public "Break My Math" Challenge

**BETONIQ WEST LTD (RC 1496603)**

## The Challenge

We claim ZerôPâŷ Money's offline payment protocol cannot be double-spent — meaning nobody can copy a payment token and spend it twice — even with zero internet connection at the moment of payment.

This is a public, standing challenge to cryptographers, security researchers, and engineers: **prove us wrong.**

## What We've Already Published (no NDA required)

1. `ZEROPAY_DOUBLESPEND_CRYPTOGRAPHIC_PROOF.md` — the state-machine proof of the Token Uniqueness Invariant.
2. `formal_verification/ZeroPayDoubleSpend.tla` — a machine-checkable TLA+ specification of the same protocol.
3. `formal_verification/tlc_verification_results.txt` — full TLC model-checker output: 437 distinct states exhaustively explored, zero violations of the Token Uniqueness Invariant, zero violations of attribution, liveness property holds under fair scheduling.
4. `formal_verification/ZeroPayDoubleSpend_BROKEN_control.tla` — a deliberately broken negative-control version (dedup logic removed) that TLC breaks in 5 states flat, proving the checker is actually catching something real, not passing vacuously.

## What We're NOT Disclosing (pending MNDA)

The PUF key-extraction method, distance-bounding parameters, and firmware/chip-level implementation remain confidential pending a signed Mutual NDA — standard practice for patent-pending hardware security work.

## How to Participate

1. Read the public proof paper and the TLA+ spec above.
2. If you believe you can construct a double-spend against the *modeled state machine* (not the undisclosed hardware layer), open an issue in this repository describing the attack.
3. If you believe you can defeat the *hardware layer* (PUF cloning, relay attack past distance-bounding, etc.) without seeing the undisclosed spec, describe your approach — if it's credible, we will consider it grounds for an MNDA technical review call.

## What Happens If You Win

Public credit in this repository, first right of technical review conversation, and — once revenue funding allows — a bounty payment (amount TBD, pending Tom's approval; not yet committed).

## What Happens If You Can't

That's the point of a public model-checked proof: it's not us telling you it's safe, it's a computer exhaustively checking every possible ordering of events and finding no way to break the core invariant.

---
*BETONIQ WEST LTD — RC 1496603 — zeropointfeild_nonwnt@zeropay.site*
*Status: OPEN. No expiry date. Pending Tom's explicit approval before public promotion of this challenge.*
