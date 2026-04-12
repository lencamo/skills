# skills

English | [中文](./README.zh-CN.md)

Codex skills for practical engineering workflows.

Repository: `https://github.com/lencamo/skills`

## Skills

| Skill | When | What it does |
| :--- | :--- | :--- |
| [`doc-feat-desc`](skills/doc-feat-desc/SKILL.md) | When an implemented feature needs user-facing documentation | Generates three docs under `doc/<requirement-name>/` from the real implementation |
| [`git-smart-commit`](skills/git-smart-commit/SKILL.md) | When a commit message needs to match repo conventions | Detects commit rules and drafts a short matching commit header |

Each skill lives in its own folder instead of a single markdown file. A skill can include bundled references and helper resources when needed.

## Install

Install all available skills:

```bash
npx skills add lencamo/skills -a codex -g -y
```

List available skills:

```bash
npx skills add lencamo/skills --list
```

Install selected skills:

```bash
npx skills add lencamo/skills -a codex -g -y -s doc-feat-desc
npx skills add lencamo/skills -a codex -g -y -s git-smart-commit
```

Use the local repository during development:

```bash
git clone git@github.com:lencamo/skills.git
cd skills
npx skills add . -a codex -g -y
```

## License

This repository is released under the MIT License. See [LICENSE](./LICENSE) for the full text.

## Structure

```text
.
├── LICENSE
├── marketplace.json
├── README.md
├── README.zh-CN.md
└── skills
    ├── doc-feat-desc
    │   ├── references
    │   └── SKILL.md
    └── git-smart-commit
        └── SKILL.md
```
