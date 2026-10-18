# Amo Workflow Resolver

English | [中文](./RESOLVER.zh-CN.md)

This file exists only for `amo-*` workflow routing.

README is the public catalogue: it lists all skills, install commands, and short descriptions.
This resolver is the maintenance guide for cases where several `amo-*` skills could match the same request.

Runtime trigger source remains each `skills/amo-*/SKILL.md` frontmatter `description`. Keep this file short and update it only when an `amo-*` trigger boundary changes.

## Shared Output Marker

All `amo-*` workflow skills prefix the first output line inline with their skill marker:

| Skill | Marker |
| :---- | :----- |
| `amo-feature` | `🧩 [amo-feature]` |
| `amo-improve` | `🧰 [amo-improve]` |
| `amo-fix` | `🛠️ [amo-fix]` |
| `amo-refactor` | `🧱 [amo-refactor]` |
| `amo-best` | `🏆 [amo-best]` |
| `amo-research` | `🔬 [amo-research]` |
| `amo-detail` | `🔎 [amo-detail]` |
| `amo-implement` | `🔨 [amo-implement]` |
| `amo-review` | `🧹 [amo-review]` |
| `amo-draft` | `📝 [amo-draft]` |

Keep the marker inline with the first line, not as a standalone paragraph.

## Primary Routing

| User intent | Use |
| :---------- | :-- |
| Build behavior that does not exist yet | `amo-feature` |
| Intentionally change, extend, improve, or redesign existing behavior | `amo-improve` |
| Explain and fix broken, wrong, flaky, regressed, or failing existing behavior | `amo-fix` |
| Change structure, ownership, coupling, state/data flow, module boundaries, or component boundaries | `amo-refactor` |
| Challenge an existing proposal: "is this best?", "better way?", "tradeoff right?", "scope right?" | `amo-best` |
| Research competitor products, community practices, or open-source implementations for mature, reusable approaches | `amo-research` |
| Understand an existing proposal's overall flow, impact, and frontend/backend changes | `amo-detail` |
| Implement an already defined proposal and verify the result | `amo-implement` |
| Review implemented code for redundancy, unnecessary abstractions, TypeScript type noise, or composable usage clarity | `amo-review` |
| Write or edit target-focused page copy, requirement notes, implementation docs, version notes, release notes, or temporary project documentation | `amo-draft` |

## Best Standard Routing

Design-oriented `amo-*` skills must choose one primary best standard before recommending a solution. `amo-research`, `amo-detail`, and `amo-implement` follow existing decisions without choosing a new best standard. `amo-review` and `amo-draft` do not choose a best standard.

| User signal | Standard |
| :---------- | :------- |
| No explicit constraint, development-stage code, user wants the right design | Target-state best |
| "Fast", "minimal change", "few changes", "compatible", "ship first", short-term delivery, limited scope | Constraint best |
| Target design is right but one-step delivery is too broad or risky | Evolutionary best |
| Production, data, security, auth/permission, payment, migration, rollback, irreversible impact | Lowest-risk best |

Default to target-state best when no constraint is stated. Do not invent compatibility, fallback, or legacy paths without code evidence or explicit user requirements.

## Ambiguous Cases

1. New behavior plus messy existing code: use `amo-feature`; call out the refactor portion inside the plan.
2. Existing behavior should intentionally change: use `amo-improve`, not `amo-fix`.
3. Existing behavior is wrong or failing: use `amo-fix`; mention refactor only if root cause requires boundary work.
4. No behavior change, only structure: use `amo-refactor`.
5. A candidate proposal already exists and the user asks whether it is best: use `amo-best`.
6. Implemented code exists and the user asks for redundancy, style, or TypeScript type review: use `amo-review`.
7. The user asks to write clean target content from context, reference style, examples, or implementation history: use `amo-draft`.
8. Implementing an already defined proposal: use `amo-implement`; direct small edits, assets, and commit messages do not require the amo design workflow.

## Chaining

Skills do not automatically chain.

Typical manual chain:

```text
amo-feature / amo-improve / amo-fix / amo-refactor
-> amo-best
-> amo-detail
-> amo-implement
-> amo-review
-> amo-draft
```

Use `amo-best` only as a second-pass pressure test after a concrete proposal exists.
Use `amo-research` independently or as optional external implementation research to support decisions in `amo-feature`, `amo-improve`, `amo-fix`, `amo-refactor`, and `amo-best`; it provides evidence and reuse advice without automatically invoking other skills.
Use `amo-detail` to present an existing proposal's flow, impact, and frontend/backend changes; the proposal may come from the user or a primary design skill, optionally reviewed by `amo-best`.
Use `amo-implement` to code and verify an existing proposal while controlling comment noise, frontend content pollution, and scope creep.
Use `amo-review` only after code exists.
Use `amo-draft` when the next artifact is content, not code.

## Maintenance Rule

Do not duplicate each skill's full rules here. This file should answer only one question:

```text
For this user request, which amo workflow skill should be used first?
```
