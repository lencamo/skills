# lencamo-skill

Codex skills collected from real daily workflows.

This repository is the first version of my public skill project. The goal is simple:

- build a Waza-style skill repository structure
- keep the repository lightweight
- copy in my existing local Codex skills first
- improve individual skills later

## Skills

| Skill | When | What it does |
| :--- | :--- | :--- |
| [`doc-feat-desc`](skills/doc-feat-desc/SKILL.md) | When an implemented feature needs user-facing documentation | Generates three docs under `doc/<requirement-name>/` from the real implementation |
| [`git-smart-commit`](skills/git-smart-commit/SKILL.md) | When a commit message needs to match repo conventions | Detects commit rules and drafts a short matching commit header |

Each skill is a folder, not just a single markdown file. A skill can include `references/`, `scripts/`, and other bundled resources when needed.

## Install

**Codex**

```bash
npx skills add lencamo/lencamo-skill -a codex -g -y
```

**List available skills**

```bash
npx skills add lencamo/lencamo-skill --list
```

**Install selected skills**

```bash
npx skills add lencamo/lencamo-skill -a codex -g -y -s doc-feat-desc
npx skills add lencamo/lencamo-skill -a codex -g -y -s git-smart-commit
```

**Local development**

```bash
cd lencamo-skill
npx skills add . -a codex -g -y
```

## Structure

```text
.
├── LICENSE
├── marketplace.json
├── README.md
└── skills
    ├── doc-feat-desc
    │   ├── references
    │   ├── scripts
    │   └── SKILL.md
    └── git-smart-commit
        └── SKILL.md
```

## Notes

- This repository currently focuses on project construction first, not full skill polish.
- The current skills are copied from my local Codex global skills as the starting point.
- `marketplace.json` is kept to stay close to the Waza-style repository layout.
