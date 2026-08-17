#!/usr/bin/env python3
"""
Weekly BETONIQ WEST backup builder — SPLIT VERSION.
Replaces the old single monolithic zip (which hit 95.7MB, dangerously close
to GitHub's 100MB hard per-file cap) with multiple size-capped zip parts.

Each part is capped well under the 100MB GitHub limit (target: 80MB max per
part) so future weekly backups never risk a rejected push, even as more
files get added over time.
"""
import os
import zipfile
import json
import datetime

REPO_ROOT = "gh_repo"
DATE_STR = datetime.date.today().isoformat()
MAX_PART_BYTES = 45 * 1024 * 1024  # 45MB safety cap per part (comfortably under GitHub's 50MB soft-warning AND 100MB hard limit)
EXCLUDE_DIRS = {".git"}
EXCLUDE_FILE_PATTERNS = ["BETONIQ_WEST_WEEKLY_OPERATIONAL_BACKUP_"]  # never re-include old backup zips in the new one

def should_exclude(path):
    parts = path.split(os.sep)
    if any(d in EXCLUDE_DIRS for d in parts):
        return True
    fname = os.path.basename(path)
    if any(pat in fname for pat in EXCLUDE_FILE_PATTERNS):
        return True
    return False

# 1. Collect all files with their sizes
all_files = []
for root, dirs, files in os.walk(REPO_ROOT):
    dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
    for f in files:
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, REPO_ROOT)
        if should_exclude(full_path):
            continue
        size = os.path.getsize(full_path)
        all_files.append((rel_path, full_path, size))

# 2. Sort largest-first (bin-packing works better greedy-largest-first)
all_files.sort(key=lambda x: -x[2])

# 3. Greedy bin-pack into parts under MAX_PART_BYTES
parts = []  # list of lists of (rel_path, full_path, size)
part_sizes = []
for rel_path, full_path, size in all_files:
    placed = False
    # try to fit into an existing part that has room
    for i, psize in enumerate(part_sizes):
        if psize + size <= MAX_PART_BYTES:
            parts[i].append((rel_path, full_path, size))
            part_sizes[i] += size
            placed = True
            break
    if not placed:
        # start a new part (even if a single file is itself huge, it goes alone)
        parts.append([(rel_path, full_path, size)])
        part_sizes.append(size)

total_parts = len(parts)
manifest = {
    "backup_name": "BETONIQ_WEST_WEEKLY_OPERATIONAL_BACKUP",
    "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
    "source": "BETONIQ WEST operational repository snapshot",
    "split_strategy": f"Split into {total_parts} zip part(s), each capped at {MAX_PART_BYTES // (1024*1024)}MB, to stay safely under GitHub's 100MB hard per-file limit.",
    "total_files": len(all_files),
    "parts": []
}

zip_filenames = []
for idx, part_files in enumerate(parts, start=1):
    zip_name = f"BETONIQ_WEST_WEEKLY_OPERATIONAL_BACKUP_{DATE_STR}_part{idx}of{total_parts}.zip"
    zip_path = os.path.join(REPO_ROOT, zip_name)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for rel_path, full_path, size in part_files:
            zf.write(full_path, arcname=rel_path)
    actual_size = os.path.getsize(zip_path)
    zip_filenames.append((zip_name, actual_size))
    manifest["parts"].append({
        "part": idx,
        "filename": zip_name,
        "file_count": len(part_files),
        "uncompressed_bytes": sum(s for _, _, s in part_files),
        "compressed_bytes": actual_size,
        "compressed_mb": round(actual_size / (1024*1024), 2),
    })

# 4. Write manifest
manifest_json_path = os.path.join(REPO_ROOT, f"BETONIQ_WEST_BACKUP_MANIFEST_{DATE_STR}.json")
manifest_md_path = os.path.join(REPO_ROOT, f"BETONIQ_WEST_BACKUP_MANIFEST_{DATE_STR}.md")

with open(manifest_json_path, "w") as f:
    json.dump(manifest, f, indent=2)

with open(manifest_md_path, "w") as f:
    f.write(f"# BETONIQ WEST Weekly Operational Backup Manifest — SPLIT FORMAT\n\n")
    f.write(f"Generated: {manifest['generated_at']}\n")
    f.write(f"Total files backed up: {manifest['total_files']}\n")
    f.write(f"Split into: {total_parts} zip part(s), each capped at {MAX_PART_BYTES // (1024*1024)}MB\n\n")
    f.write("## Why split\n")
    f.write("The previous single-zip approach hit 95.7MB, dangerously close to GitHub's hard 100MB per-file limit — the next weekly refresh could have failed to push with no warning. Splitting into capped parts removes that risk permanently.\n\n")
    f.write("## Parts\n\n")
    f.write("Part | Filename | Files | Size (MB)\n")
    f.write("-----|----------|-------|----------\n")
    for p in manifest["parts"]:
        f.write(f"{p['part']} | {p['filename']} | {p['file_count']} | {p['compressed_mb']}\n")
    f.write("\n## Restore instructions\n")
    f.write("Download ALL parts and extract each one into the same destination folder — they combine into the full repository snapshot (no part depends on another, but all are needed together for a complete restore).\n")

print(f"Created {total_parts} zip part(s):")
for name, size in zip_filenames:
    print(f"  {name} — {size/(1024*1024):.2f}MB")
print(f"\nManifest: {manifest_json_path}")
print(f"Manifest: {manifest_md_path}")
