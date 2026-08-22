# ZerôPâŷ Money — Public Timestamp Anchor for the Cryptographic Proof Paper

**BETONIQ WEST LTD (RC 1496603)**

## What this is

We took the SHA-256 hash of `ZEROPAY_DOUBLESPEND_CRYPTOGRAPHIC_PROOF.md` and submitted it
to the OpenTimestamps network, which anchors it into the Bitcoin blockchain via multiple
independent calendar servers. This creates a free, public, tamper-proof record proving
this exact document existed at this exact hash on this date — without revealing anything
we haven't already published, and without costing anything.

## The hash (SHA-256 of the proof paper, as of this commit)

`fc99ada951e488924da7d432263ec85e5a191d02d2fbfe9718aefefcdb00024b`

## The proof file

`formal_verification/PROOF_PAPER_TIMESTAMP.ots`

## How anyone can verify this themselves (no trust required)

1. Install the OpenTimestamps client: `pip install opentimestamps-client`
2. Download this repo's `ZEROPAY_DOUBLESPEND_CRYPTOGRAPHIC_PROOF.md` and
   `formal_verification/PROOF_PAPER_TIMESTAMP.ots`
3. Run: `ots verify formal_verification/PROOF_PAPER_TIMESTAMP.ots`
4. Once the Bitcoin calendar servers finish attesting (can take a few hours to confirm
   on-chain), this will show the exact Bitcoin block the document's hash was anchored to.

## Why this matters

It strengthens "patent-pending" language with something independently, publicly
verifiable — a provable priority date for this specific document, established the same
way, using the same public infrastructure serious cryptography projects use to prove
they didn't quietly rewrite history after the fact.

---
*BETONIQ WEST LTD — RC 1496603 — Public record. No IP disclosed beyond what is already public in the proof paper itself.*
