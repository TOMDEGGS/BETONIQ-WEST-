# BETONIQ WEST Weekly Operational Backup Manifest — SPLIT FORMAT

Generated: 2026-08-17T12:02:26.807704Z
Total files backed up: 213
Split into: 2 zip part(s), each capped at 80MB

## Why split
The previous single-zip approach hit 95.7MB, dangerously close to GitHub's hard 100MB per-file limit — the next weekly refresh could have failed to push with no warning. Splitting into capped parts removes that risk permanently.

## Parts

Part | Filename | Files | Size (MB)
-----|----------|-------|----------
1 | BETONIQ_WEST_WEEKLY_OPERATIONAL_BACKUP_2026-08-17_part1of2.zip | 17 | 63.32
2 | BETONIQ_WEST_WEEKLY_OPERATIONAL_BACKUP_2026-08-17_part2of2.zip | 196 | 39.89

## Restore instructions
Download ALL parts and extract each one into the same destination folder — they combine into the full repository snapshot (no part depends on another, but all are needed together for a complete restore).
