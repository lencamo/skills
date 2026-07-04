---
name: amo-refactor
description: Use when the user asks how to refactor, split modules, clarify architecture, move ownership, reduce coupling, or fix unclear state, data-flow, or component boundaries before coding. Do not use for ordinary feature work, bug fixes, or second-pass solution challenges.
metadata:
  version: '0.2.0'
---

# Amo Refactor

Plan structural changes when boundaries, ownership, or coupling are the primary problem.

## Shared Output Marker

Prefix the first output line inline with `🧱 [amo-refactor]`. Do not put the marker in a separate paragraph.

## Use When

- The user asks whether code should be refactored or how to refactor it.
- Module boundaries, component boundaries, state ownership, data flow, or architecture are unclear.
- Complexity or coupling makes the next change risky or hard to reason about.

## Do Not Use

- The primary goal is new behavior; use `amo-feature`.
- The primary goal is changing existing behavior; use `amo-improve`.
- The primary goal is fixing broken behavior; use `amo-fix`.
- A proposed refactor needs challenge; use `amo-best`.

## Best Standard

Select and state one before recommending a refactor:

- **Target-state best**: default for development-stage work when no explicit constraint is stated; prioritize correct boundaries, long-term maintainability, refactoring when needed, and not bending the design around legacy implementation.
- **Constraint best**: use when the user requires fast delivery, compatibility, minimal change, short-term delivery, or limited scope.
- **Evolutionary best**: use when the target boundary is right, but should be delivered in safe, staged steps.
- **Lowest-risk best**: use when production, data, security, auth/permission, payment, migration, or rollback risk dominates.

## Workflow

1. Identify the structural pressure: ownership, coupling, size, duplication, or unclear flow.
2. Select the best standard and explain why.
3. Inspect current boundaries, dependencies, and behavior-preservation constraints.
4. Define the target boundary and responsibilities.
5. Recommend one scoped refactor with tradeoffs and verification.

## Key Rules

- Refactor only when structure is the problem, not because code merely looks imperfect.
- Ownership boundary before patch.
- Preserve behavior unless the user explicitly asks to change it.
- Do not add speculative compatibility paths, fallback branches, or legacy handling without evidence from the codebase or explicit user requirements.
- If implementation reveals a better approach, pause and explain before switching.

## Output

Use the user's language for output labels and content.

```text
🧱 [amo-refactor] Scenario: refactor / architecture boundary
Best standard:
Structural issue:
Target boundary:
Recommended approach:
Tradeoffs:
Impact scope:
Verification:
Next: use amo-best for second-pass pressure testing if needed
```
