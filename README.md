# skills

English | [中文](./README.zh-CN.md)

Practical agent skills for real engineering workflows.

Repository: `https://github.com/lencamo/skills`

## Skills

| Skill                                                    | When                                                                                                                                | What it does                                                                                                |
| :------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| [`doc-feat-desc`](skills/doc-feat-desc/SKILL.md)         | When an implemented feature needs user-facing documentation                                                                         | Generates three docs under `doc/<requirement-name>/` from the real implementation                           |
| [`draft-to-project`](skills/draft-to-project/SKILL.md)   | When a UI draft such as a screenshot, HTML draft, local `file://` prototype, or mockup should be implemented in a real project page | Reuses existing components and styles while keeping the provided draft layout structure close to the source |
| [`git-smart-commit`](skills/git-smart-commit/SKILL.md)   | When a commit message needs to match repo conventions                                                                               | Detects commit rules and drafts a short matching commit header                                              |
| [`split-pencil-file`](skills/split-pencil-file/SKILL.md) | When a large imported Pencil `.pen` file should be split into one folder per top-level Frame                                        | Generates `<frame-name>/index.pen` folders and copies each frame's local image assets                       |

Each skill lives in its own folder instead of a single markdown file. A skill can include bundled references and helper resources when needed.

## Install

This repository follows the standard `skills` layout and can be installed with the `skills` CLI for multiple agents. Common `-a <agent>` values include `codex`, `claude-code`, `cursor`, `opencode`, `gemini-cli`, `continue`, `windsurf`, and `trae`; for the full and current list, check the `skills` CLI docs or run `npx skills --help`.

List available skills:

```bash
npx skills add lencamo/skills --list
```

Install all skills for Codex:

```bash
npx skills add lencamo/skills -a codex -g -y
```

Install all skills for Claude Code:

```bash
npx skills add lencamo/skills -a claude-code -g -y
```

Install selected skills for a specific agent:

```bash
npx skills add lencamo/skills -a codex -g -y -s doc-feat-desc
npx skills add lencamo/skills -a codex -g -y -s draft-to-project
npx skills add lencamo/skills -a claude-code -g -y -s git-smart-commit
npx skills add lencamo/skills -a claude-code -g -y -s split-pencil-file
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
├── AGENTS.md
├── CLAUDE.md
├── LICENSE
├── marketplace.json
├── README.md
├── README.zh-CN.md
└── skills
    └── example-skill
        ├── SKILL.md
        ├── agents
        ├── references
        ├── scripts
        └── templates
```

## References

- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- [tw93/Waza](https://github.com/tw93/Waza)
