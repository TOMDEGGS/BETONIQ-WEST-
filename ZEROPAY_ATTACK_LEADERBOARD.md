# ZerôPâŷ Money — Public Attack Leaderboard

Tracking every attempt to break the offline double-spend protocol described in
`ZEROPAY_DOUBLESPEND_CRYPTOGRAPHIC_PROOF.md` and modeled formally in
`formal_verification/ZeroPayDoubleSpend.tla`.

See `ZEROPAY_DOUBLESPEND_BOUNTY_CHALLENGE.md` for how to submit an attempt.

| # | Date | Researcher / Handle | Attack Type | Target Layer | Result | Notes |
|---|------|---------------------|-------------|---------------|--------|-------|
| — | — | — | — | — | No submissions yet | Leaderboard opens on first public promotion of the challenge |

**Legend for "Target Layer":**
- `state-machine` — attacking the public TLA+ model / proof paper logic
- `hardware` — attacking the undisclosed PUF / distance-bounding layer (requires MNDA claim description first)

**Legend for "Result":**
- `BROKEN` — successful double-spend demonstrated, invariant violated
- `DEFENDED` — attack attempted, invariant held
- `PENDING` — under review

---
*BETONIQ WEST LTD — RC 1496603 — This file is updated as submissions come in via GitHub Issues.*
