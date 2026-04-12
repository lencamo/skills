# AGENTS.md

This file defines how skills in this repository should be maintained. It does not define the behavior of any specific skill.

## Repository Positioning

This is an agent skill collection repository, not a CLI or runtime project.

Goals:

- clear trigger conditions
- simple structure
- low maintenance cost
- real, non-speculative behavior

## Directory Conventions

```text
skills/<skill-name>/SKILL.md
skills/<skill-name>/references/
README.md
README.zh-CN.md
marketplace.json
AGENTS.md
```

Rules:

1. Each skill lives in `skills/<skill-name>/`.
2. Directory names use `kebab-case`.
3. Each skill must include `SKILL.md`.
4. Add `references/` only when supporting material is actually needed.

## Skill Design

- A new skill should at minimum cover: when to use it, when not to use it, workflow, key rules, and output.
- Section names do not have to be identical, but these pieces of information should be easy to find.
- A skill should solve one clear problem and avoid becoming too broad.
- `description` should be trigger-oriented, not vague.
- Keep the main instructions short and move details into `references/` when appropriate.
- If execution depends on a reference file, `SKILL.md` should explicitly say to read it first.
- Do not duplicate the same rule in both `SKILL.md` and `references/`.

## Skill Maintenance

1. Do not change skill behavior unless the task explicitly requires it.
2. Prefer structural cleanup over expanding content just to make it look more complete.
3. Do not rewrite existing skills only to force template consistency.
4. Keep trigger conditions and output expectations stable.

## Repository Sync

Update repository-level docs when any of the following happens:

- a skill is added
- a skill is removed
- a skill is renamed
- a skill's public positioning or description changes

Files to update:

- `README.md`
- `README.zh-CN.md`
- `marketplace.json`
