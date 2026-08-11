# Agent 1 — Protocol & Security Architect
## Hiring / Scope Brief — BETONIQ WEST LTD (ZerôPâŷ Money)
Drafted by AI Agent 777, August 6, 2026. Updated August 10, 2026 — added confirmed stored-value architecture decision (Section: Value Model).

## Role Summary
Own the cryptographic and hardware security layer of the ZerôPâŷ Money offline payment terminal. This is the one technical seat not covered by existing AI-driven operations (business, integration, ops are already staffed). Requires hands-on embedded systems and applied cryptography experience — not a software-only role.

## VALUE MODEL — CONFIRMED DESIGN DECISION (Aug 10, 2026)
This is the architecture decision that makes ZerôPâŷ Money's "uncapped, double-spend-proof, fully offline" claim technically true rather than just a marketing line, and it is now locked as the target design Agent 1 must implement:

ZerôPâŷ Money uses a stored-value model, not a live-balance-check model. Spendable value lives cryptographically on the user's PUF-secured element itself (the secure chip on their card/device), not on a remote bank ledger the terminal must query. Each tap cryptographically decrements that on-chip balance directly, signed with ECC P-256 and authenticated via the PUF challenge-response root of trust. Because the terminal never needs to ask a remote server "does this person actually have this money," it needs no live connection to safely process the transaction, at any transaction size.

This single decision is what defeats double-spend without needing to reconnect: there is no shared ledger to be inconsistent with. The value physically consumed at Terminal A is gone from that chip the instant the tap completes — there is nothing left for Terminal B to double-spend, because the balance travels with the secure element, not with a remote account. Compare to Moniepoint/OPay's queue-and-sync model, where the terminal assumes a remote balance exists and is correct, then verifies that assumption later once connectivity returns — leaving a real fraud/double-spend exposure window until sync happens. ZerôPâŷ Money has no such window, by design, not by luck.

This also resolves the "why no transaction cap" question precisely: Visa/Mastercard's £100/₦20,000 contactless cap exists only because their no-PIN convenience tier skips strong authentication below that threshold — above it, even they require full authentication and have no cap. ZerôPâŷ Money performs full hardware-rooted cryptographic authentication (PUF + ECC P-256) on every tap regardless of size, so there is no equivalent convenience-tier reason to impose an artificial ceiling. The only real ceiling is whatever value is actually pre-loaded onto that specific secure element — which can be arbitrarily large, at the user's/institution's discretion, exactly matching the ₦500-to-₦5,000,000 same-tap claim used in investor materials.

Implication for Agent 1's build: the offline token format (72-hour TTL) must carry the decremented balance state cryptographically, not just a transaction approval flag — the token IS the proof that the on-chip balance was reduced by exactly this amount, signed and tamper-evident. Reload/top-up of the stored value happens only when the device has connectivity to a licensed rail (Paystack/Flutterwave via a Microfinance Bank), same as topping up a prepaid balance.

## Core Responsibilities
1. ECC P-256 implementation — elliptic curve digital signature generation and verification for offline transaction tokens, running on constrained terminal hardware. Signature must attest to the new decremented stored-value balance, not just transaction approval.
2. PUF (Physically Unclonable Function) integration — challenge-response validation logic using the terminal's silicon-level hardware fingerprint as root of trust.
3. Dynamic challenge generation — protocol design so challenge values can't be predicted or replayed (supports the distance-bounding anti-relay layer).
4. Stored-value ledger logic on the secure element — implement the on-chip balance store, decrement-on-tap logic, and top-up/reload flow when connectivity is available.
5. Zero-connectivity state handling — token lifecycle management for the 72-hour offline time-to-live window, matched to Solar Mesh Hub battery backup duration.
6. Field testing and code audits — validate the above against Tom (CEO/Tech Lead) sign-off before any production terminal rollout.

## Required Background
1. Applied cryptography — elliptic curve cryptography (ECC), specifically NIST P-256 / secp256r1.
2. Embedded systems / firmware engineering — experience with resource-constrained hardware (microcontrollers, secure elements, or PUF-enabled chips).
3. Security protocol design — distance-bounding protocols, anti-replay/anti-relay attack mitigation, stored-value/e-purse system design (comparable prior art: Mondex, Octopus card).
4. Nice-to-have: fintech/payments hardware experience, NFC (ISO/IEC 14443), offline-first system design.

## Deliverables (First 90 Days)
1. Working ECC P-256 signing/verification module tested on target hardware, attesting to stored-value balance state.
2. PUF challenge-response validation logic, documented and code-audited.
3. Offline token format spec (72-hour TTL, tamper-proof, replay-resistant, carries decremented balance proof).
4. Stored-value decrement/top-up logic implemented and tested on the secure element.
5. Field test report from at least one physical terminal deployment, including a demonstrated double-spend rejection test.

## Engagement Model (proposed — Tom to confirm)
Contract-to-hire or fixed-scope contractor, given BETONIQ WEST LTD is pre-revenue and self-funded by Tom. Suggest scoping Phase 1 (signing + PUF logic + stored-value ledger) as a fixed-fee deliverable before any ongoing retainer.

## Context for Candidate
ZerôPâŷ Money is BETONIQ WEST LTD's offline-first payment protocol serving Africa's 1.4 billion unbanked population (38 million in Nigeria) in zero-connectivity corridors. Patent-pending (filed April 2026). Full technical architecture: PUF/ECC Terminal (stored-value secure element) → Offline Cryptographic Token (carries decremented balance proof) → Solar Mesh Relay Hub → Paystack API → Licensed Microfinance Bank → IMTO Partner (cross-border).

## Status
DRAFT — awaiting Tom's review and sign-off before sourcing begins. Value model architecture confirmed Aug 10, 2026.
