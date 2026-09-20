#!/usr/bin/env python3
"""Rebuild ~/.zcode/skills from CC Switch (opencode's enabled set).

Simple model: clear ZCode's skill symlinks, then copy over the skills CC Switch
enables for opencode.

Orca skills (owner `stablyai`) are excluded: they are enabled for opencode only
so they work inside Orca, and their computer-use would clash with ZCode's own
CUA.

Content updates are automatic through the symlinks; run this after adding or
removing skills in CC Switch.
"""
import argparse
import os
import sqlite3
import sys

HOME = os.path.expanduser("~")
CC_DIR = os.path.join(HOME, ".cc-switch/skills")
DB = os.path.join(HOME, ".cc-switch/cc-switch.db")
DEFAULT_ZC = os.path.join(HOME, ".zcode/skills")

FLAG = "enabled_opencode"      # ZCode follows opencode's enabled set
EXCLUDE_OWNER = "stablyai"     # never bridge Orca skills into ZCode
SELF = "zcode-skills-sync"     # never delete this skill's own link


def source_names():
    if not os.path.exists(DB):
        raise SystemExit(f"CC Switch database not found: {DB}")
    con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    try:
        rows = con.execute(
            f"select directory from skills "
            f"where {FLAG}=1 and (repo_owner is null or repo_owner != ?)",
            (EXCLUDE_OWNER,),
        ).fetchall()
    finally:
        con.close()
    return sorted(
        d for (d,) in rows if d and os.path.isdir(os.path.join(CC_DIR, d))
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--zcode-dir", default=DEFAULT_ZC,
        help="ZCode's skill directory (default: %(default)s)",
    )
    args = ap.parse_args()
    zc = args.zcode_dir
    os.makedirs(zc, exist_ok=True)

    removed = 0
    for n in os.listdir(zc):
        p = os.path.join(zc, n)
        if os.path.islink(p) and n != SELF:
            os.unlink(p)
            removed += 1

    added = 0
    for n in source_names():
        p = os.path.join(zc, n)
        if not os.path.lexists(p):
            os.symlink(os.path.join(CC_DIR, n), p)
            added += 1

    total = len([n for n in os.listdir(zc) if not n.startswith(".")])
    print(f"zcode skills synced: removed={removed} added={added} total={total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
