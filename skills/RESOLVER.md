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
| Review implemented code for redundancy, unnecessary abstractions, TypeScript type noise, or composable usage clarity | `amo-review` |
| Write or edit target-focused page copy, requirement notes, implementation docs, version notes, release notes, or temporary project documentation | `amo-draft` |

## Best Standard Routing

Design-oriented `amo-*` skills must choose one primary best standard before recommending a solution. `amo-review` and `amo-draft` do not choose a best standard.

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
8. The user asks for a direct edit, assets, or commit message: do not use `amo-*` unless they ask for solution design first.

## Chaining

Skills do not automatically chain.

Typical manual chain:

```text
amo-feature / amo-improve / amo-fix / amo-refactor
-> amo-best
-> implementation
-> amo-review
-> amo-draft
```

Use `amo-best` only as a second-pass pressure test after a concrete proposal exists.
Use `amo-review` only after code exists.
Use `amo-draft` when the next artifact is content, not code.

## Maintenance Rule

Do not duplicate each skill's full rules here. This file should answer only one question:

```text
For this user request, which amo workflow skill should be used first?
```
