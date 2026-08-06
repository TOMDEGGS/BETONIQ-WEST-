# Agent 1 — Protocol & Security Architect
## Hiring / Scope Brief — BETONIQ WEST LTD (ZeroPay)
Drafted by AI Agent 777, August 6, 2026

## Role Summary
Own the cryptographic and hardware security layer of the ZeroPay offline payment terminal. This is the one technical seat not covered by existing AI-driven operations (business, integration, ops are already staffed). Requires hands-on embedded systems and applied cryptography experience — not a software-only role.

## Core Responsibilities
1. ECC P-256 implementation — elliptic curve digital signature generation and verification for offline transaction tokens, running on constrained terminal hardware.
2. PUF (Physically Unclonable Function) integration — challenge-response validation logic using the terminal's silicon-level hardware fingerprint as root of trust.
3. Dynamic challenge generation — protocol design so challenge values can't be predicted or replayed (supports the distance-bounding anti-relay layer).
4. Zero-connectivity state handling — token lifecycle management for the 72-hour offline time-to-live window, matched to Solar Mesh Hub battery backup duration.
5. Field testing and code audits — validate the above against Tom (CEO/Tech Lead) sign-off before any production terminal rollout.

## Required Background
1. Applied cryptography — elliptic curve cryptography (ECC), specifically NIST P-256 / secp256r1.
2. Embedded systems / firmware engineering — experience with resource-constrained hardware (microcontrollers, secure elements, or PUF-enabled chips).
3. Security protocol design — distance-bounding protocols, anti-replay/anti-relay attack mitigation.
4. Nice-to-have: fintech/payments hardware experience, NFC (ISO/IEC 14443), offline-first system design.

## Deliverables (First 90 Days)
1. Working ECC P-256 signing/verification module tested on target hardware.
2. PUF challenge-response validation logic, documented and code-audited.
3. Offline token format spec (72-hour TTL, tamper-proof, replay-resistant).
4. Field test report from at least one physical terminal deployment.

## Engagement Model (proposed — Tom to confirm)
Contract-to-hire or fixed-scope contractor, given BETONIQ WEST LTD is pre-revenue and self-funded by Tom. Suggest scoping Phase 1 (signing + PUF logic) as a fixed-fee deliverable before any ongoing retainer.

## Context for Candidate
ZeroPay is BETONIQ WEST LTD's offline-first payment protocol serving Africa's 1.4 billion unbanked population (38 million in Nigeria) in zero-connectivity corridors. Patent-pending (filed April 2026). Full technical architecture: PUF/ECC Terminal → Offline Cryptographic Token → Solar Mesh Relay Hub → Paystack API → Licensed Microfinance Bank → IMTO Partner (cross-border).

## Status
DRAFT — awaiting Tom's review and sign-off before sourcing begins.
