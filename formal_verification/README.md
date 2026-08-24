# ZerôPâŷ Money — Formal Verification (TLA+ / TLC)

This directory contains a machine-checkable formal model of the offline
double-spend prevention protocol described in
`../ZEROPAY_DOUBLESPEND_CRYPTOGRAPHIC_PROOF.md`, verified with the TLA+
model checker (TLC).

## Files
- `ZeroPayDoubleSpend.tla` / `.cfg` — the real protocol model.
- `tlc_verification_results.txt` — full, unedited TLC output. Result:
  **437 distinct states, no error found.** Both safety invariants
  (Token Uniqueness, No-Silent-Double-Credit) and the liveness property
  (Eventual Resolution) hold across every reachable ordering of events,
  with up to 5 adversarial replay targets.
- `ZeroPayDoubleSpend_BROKEN_control.tla` / `.cfg` — a deliberately broken
  negative-control version with the deduplication logic removed.
- `tlc_negative_control_results.txt` — full, unedited TLC output for the
  broken version. Result: **invariant violated in 5 states** — proving the
  model checker is actually detecting real double-spends when the defense
  is absent, so the clean pass on the real spec is not vacuous.

## How to reproduce this yourself
1. Install Java (`apt-get install default-jre-headless` or equivalent).
2. Download `tla2tools.jar` from the official TLA+ GitHub releases page.
3. `java -cp tla2tools.jar tlc2.TLC -deadlock -config ZeroPayDoubleSpend.cfg ZeroPayDoubleSpend.tla`

Anyone — investor, engineer, or skeptic — can run this exact command
against these exact files and get the same result. No trust required.
