---
name: amo-feature
description: Use when the user asks how to design or implement a new feature, capability, workflow, page, API, or behavior before coding. Do not use for bug fixes, intentional changes to existing behavior, pure refactors, or second-pass solution challenges.
metadata:
  version: '0.2.0'
---

# Amo Feature

Design new functionality before implementation.

## Use When

- The requested behavior does not already exist.
- The user asks how to implement a new feature or requirement.
- The work needs requirements boundaries, technical shape, affected modules, tradeoffs, and verification.

## Do Not Use

- Existing behavior is being changed or extended; use `amo-improve`.
- Existing behavior is broken; use `amo-fix`.
- Structure is the primary problem with no new behavior; use `amo-refactor`.
- A candidate solution already exists and needs challenge; use `amo-best`.

## Best Standard

Select and state one before recommending a solution:

- **Target-state best**: default for development-stage work when no explicit constraint is stated; prioritize correct boundaries, long-term maintainability, refactoring when needed, and not bending the design around legacy implementation.
- **Constraint best**: use when the user requires compatibility, minimal change, short-term delivery, or limited scope.
- **Evolutionary best**: use when the target design is right, but should be delivered in safe, staged steps.
- **Lowest-risk best**: use when production, data, security, auth, payment, migration, or rollback risk dominates.

## Workflow

1. Clarify target behavior and success criteria.
2. Select the best standard and explain why.
3. Inspect relevant code, patterns, and constraints.
4. Recommend one design with explicit tradeoffs.
5. State affected modules, behavior changes, risks, and verification.

## Key Rules

- Do not turn a feature into a platform unless the requirement demands it.
- Prefer simple, maintainable, production-ready design.
- Do not add speculative compatibility paths, fallback branches, or legacy handling without evidence from the codebase or explicit user requirements.
- If existing behavior must change, call out the `amo-improve` portion.
- If implementation reveals a better approach, pause and explain before switching.

## Output

```text
当前场景：新功能方案
最佳标准：
目标行为：
推荐方案：
取舍：
影响范围：
验证方式：
后续：如需二次压力测试，使用 amo-best
```
