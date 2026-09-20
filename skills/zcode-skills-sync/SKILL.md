---
name: zcode-skills-sync
description: >-
  MANUAL-ONLY maintenance skill. Run it ONLY when the user explicitly invokes it
  by name: "$zcode-skills-sync", "运行 zcode-skills-sync", "use
  zcode-skills-sync", or "用 zcode-skills-sync 同步". Do NOT trigger on generic
  requests such as "同步技能", "sync skills", or "同步 ZCode 技能". Rebuilds
  ~/.zcode/skills as symlinks into ~/.cc-switch/skills.
metadata:
  version: '1.0.0'
---

# ZCode Skills Sync

CC Switch has no ZCode target, so this skill bridges the two: it rebuilds
`~/.zcode/skills` as symlinks into `~/.cc-switch/skills`.

## Trigger policy (manual-only)

This skill must never be auto-triggered.

- Run **only** on an explicit named invocation: `$zcode-skills-sync`, or the user
  saying "运行 zcode-skills-sync" / "use zcode-skills-sync" / "用 zcode-skills-sync".
- Do **not** run on generic phrases like "同步技能", "sync skills", or
  "同步 ZCode 技能", and do not run just because a skill was added/changed in
  CC Switch — only when this skill is named.
- If the user asks to sync without naming this skill, tell them to invoke
  `$zcode-skills-sync` explicitly; do not run it silently.

## How to run

Run the script from this skill's installed location (the default path assumes
the standard ZCode skill directory):

```bash
python3 ~/.zcode/skills/zcode-skills-sync/scripts/sync_zcode_skills.py
```

If ZCode's skill directory ever moves (e.g. after a major release), pass it:

```bash
python3 <path-to-this-skill>/scripts/sync_zcode_skills.py --zcode-dir ~/.zcode/skills
```

Then report the single output line, for example:

```
zcode skills synced: removed=26 added=26 total=27
```

## Restoring after reinstalling ZCode

This skill lives in the `lencamo/skills` repo, so it survives a ZCode
uninstall. After reinstalling ZCode:

1. Import this skill into ZCode from CC Switch, or copy this folder into
   ZCode's skill directory.
2. Invoke `$zcode-skills-sync` in ZCode. The agent runs the script and the
   enabled skill set reappears as symlinks to CC Switch.

Do not use ZCode's own "import skills from Claude" shortcut for the rest of
the set (see Rules).

## Principle

1. **CC Switch is the single source of truth.** Real skill folders live in
   `~/.cc-switch/skills/`.
2. **ZCode discovers skills only in `~/.zcode/skills/`.** Each entry there is a
   symlink to the CC Switch folder, so content stays shared automatically.
3. **The sync is just clear-and-copy:** delete every symlink in
   `~/.zcode/skills`, then recreate one symlink per skill that CC Switch enables
   for opencode (`enabled_opencode=1`), excluding owner `stablyai`.
   - Real directories are never touched; only symlinks are cleared, so this
     skill's own folder stays.
   - This skill's own symlink is never removed, so importing it as a symlink
     and running the sync is safe.
4. **Orca skills are excluded** (`stablyai/orca`): they are enabled for opencode
   only to work inside Orca, and their `computer-use` would clash with ZCode's
   own CUA.
5. **Content updates are automatic** through the symlinks. Only add/remove of
   skills needs this skill.

## Rules

- Do not hand-edit `~/.zcode/skills`; change the set in CC Switch (opencode
  target), then run this skill.
- Do not use ZCode's "import skills from Claude" feature; it recreates links
  pointing at `~/.claude/skills`.
- To follow a different app or allow Orca skills, edit `FLAG` / `EXCLUDE_OWNER`
  in `scripts/sync_zcode_skills.py`.

## Troubleshooting

- A skill is missing: enable it in CC Switch for the opencode target, re-run.
- An Orca skill appears unexpectedly: check `EXCLUDE_OWNER` in the script.
- Links point at `~/.claude/skills`: re-run this skill.
- `CC Switch database not found`: verify `~/.cc-switch/cc-switch.db` exists.
