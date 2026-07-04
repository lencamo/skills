# skills

English | [中文](./README.zh-CN.md)

Practical agent skills for real engineering workflows.

Repository: `https://github.com/lencamo/skills`

## Workflow Skills

| Skill                                                    | Goal                                                       | Trigger                                                                      |
| :------------------------------------------------------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------- |
| [`amo-feature`](skills/amo-feature/SKILL.md)             | Design a new feature and choose the right best-standard     | "How should we implement this new feature?"                                  |
| [`amo-improve`](skills/amo-improve/SKILL.md)             | Plan existing-feature changes with the right best-standard  | "How should we improve or change this existing behavior?"                    |
| [`amo-fix`](skills/amo-fix/SKILL.md)                     | Diagnose a bug and choose the right fix standard            | "Why is this bug happening, and what is the right fix?"                      |
| [`amo-refactor`](skills/amo-refactor/SKILL.md)           | Plan refactors and architecture boundaries by standard      | "Should this be refactored, and where should the boundary be?"              |
| [`amo-best`](skills/amo-best/SKILL.md)                   | Re-check the chosen best-standard and pressure-test a plan  | "Is this the best solution, or is there a better approach?"                 |
| [`amo-review`](skills/amo-review/SKILL.md)               | Review implemented code style, redundancy, and TS typing    | "Review this code for redundancy, style, and type issues."                  |
| [`amo-draft`](skills/amo-draft/SKILL.md)                 | Write target-focused docs and copy without context pollution | "Write clean page copy or requirement docs from this context."             |

Typical workflow:

```text
amo-feature / amo-improve / amo-fix / amo-refactor
→ amo-best
→ implement
→ amo-review
→ amo-draft
```

The primary design workflow skills choose a best-standard first: target-state, constraint, evolutionary, or lowest-risk. `amo-best` is only for second-pass review of an existing proposal. `amo-review` is for implemented-code style review. `amo-draft` is for target-focused content drafting.

Detailed `amo-*` workflow routing and ambiguous-case rules live in [`skills/RESOLVER.md`](skills/RESOLVER.md).

## Tool Skills

| Skill                                                                | When                                                                                                                                | What it does                                                                                                    |
| :------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| [`brand-asset-generator`](skills/brand-asset-generator/SKILL.md)     | When source logo images should become reusable web, PWA, desktop app, tray, ICO, or ICNS assets, or be wired into an app project    | Generates transparent source marks plus `web/` and `desktop/` image asset packages with background and shape rules |
| [`doc-feat-desc`](skills/doc-feat-desc/SKILL.md)                     | When an implemented feature needs user-facing documentation                                                                         | Generates three docs under `doc/<requirement-name>/` from the real implementation                               |
| [`draft-to-project`](skills/draft-to-project/SKILL.md)               | When a UI draft such as a screenshot, HTML draft, local `file://` prototype, or mockup should be implemented in a real project page | Reuses existing components and styles while keeping the provided draft layout structure close to the source     |
| [`git-smart-commit`](skills/git-smart-commit/SKILL.md)               | When a commit message needs to match repo conventions                                                                               | Detects commit rules and drafts a short matching header, with body or split guidance only when needed           |
| [`global-project-rules`](skills/global-project-rules/SKILL.md)       | When a project needs always-on agent behavior rules                                                                                 | Enforces Chinese replies, senior engineer style, simple maintainable solutions, and protected git changes       |
| [`signature-svg-generator`](skills/signature-svg-generator/SKILL.md) | When reusable font-based signature SVG assets or Vue components should be generated                                                 | Emits static and animated SVG/Vue signature artifacts under `signatures/<text-slug>/` from real font paths      |
| [`solution-design-review`](skills/solution-design-review/SKILL.md)   | When a solution, implementation plan, bug-fix approach, root-cause analysis, or tradeoff discussion is needed before coding         | Separates root cause, quick fixes, durable solutions, tradeoffs, impact, and verification before implementation |
| [`split-pencil-file`](skills/split-pencil-file/SKILL.md)             | When a large imported Pencil `.pen` file should be split into one folder per top-level Frame                                        | Generates `<frame-name>/index.pen` folders and copies each frame's local image assets                           |

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
npx skills add lencamo/skills -a codex -g -y -s amo-feature
npx skills add lencamo/skills -a codex -g -y -s amo-improve
npx skills add lencamo/skills -a codex -g -y -s amo-fix
npx skills add lencamo/skills -a codex -g -y -s amo-refactor
npx skills add lencamo/skills -a codex -g -y -s amo-best
npx skills add lencamo/skills -a codex -g -y -s amo-review
npx skills add lencamo/skills -a codex -g -y -s amo-draft
npx skills add lencamo/skills -a codex -g -y -s brand-asset-generator
npx skills add lencamo/skills -a codex -g -y -s doc-feat-desc
npx skills add lencamo/skills -a codex -g -y -s draft-to-project
npx skills add lencamo/skills -a codex -g -y -s global-project-rules
npx skills add lencamo/skills -a codex -g -y -s signature-svg-generator
npx skills add lencamo/skills -a codex -g -y -s solution-design-review
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
- [Animated SVG Logo](https://antfu.me/posts/animated-svg-logo)
