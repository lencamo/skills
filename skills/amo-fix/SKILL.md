---
name: amo-fix
description: Use when the user asks why existing behavior is broken, incorrect, flaky, regressed, unexpected, or runtime/build behavior is failing and wants a bug-fix approach before coding. Do not use for planned feature changes, pure refactors, or second-pass solution challenges.
metadata:
  version: '0.2.0'
---

# Amo Fix

Diagnose a bug from symptom to root cause before choosing the fix.

## Shared Output Marker

Prefix the first output line inline with `🛠️ [amo-fix]`. Do not put the marker in a separate paragraph.

## Use When

- Existing behavior is wrong, broken, flaky, regressed, inconsistent, or unexpected.
- Runtime, build, framework, state, data flow, or rendered behavior does not match expectation.
- A quick patch may hide a deeper ownership, state, or flow problem.

## Do Not Use

- The requested change is intentional product behavior; use `amo-improve`.
- The task is a new capability; use `amo-feature`.
- Structure is the primary problem with no bug symptom; use `amo-refactor`.
- A proposed fix needs challenge; use `amo-best`.

## Best Standard

Select and state one before recommending a fix:

- **Target-state best**: default for development-stage work when no explicit constraint is stated; prioritize correct boundaries, long-term maintainability, refactoring when needed, and not bending the design around legacy implementation.
- **Constraint best**: use when the user requires fast delivery, compatibility, minimal change, short-term delivery, or limited scope.
- **Evolutionary best**: use when the root fix needs target design work, but should be delivered in safe, staged steps.
- **Lowest-risk best**: use when production, data, security, auth/permission, payment, migration, or rollback risk dominates.

## Workflow

1. State symptom and expected behavior.
2. Select the best standard and explain why.
3. Inspect the real code path, state/data flow, runtime behavior, or rendered output.
4. Separate root cause from symptoms and secondary effects.
5. Recommend one fix with tradeoffs, regression risk, and verification.

## Key Rules

- Root cause before fix.
- Do not present a workaround as the best fix.
- Do not add speculative compatibility paths, fallback branches, or legacy handling without evidence from the codebase or explicit user requirements.
- If the real fix requires refactoring, say so explicitly.
- If implementation reveals a better approach, pause and explain before switching.

## Output

Use the user's language for output labels and content.

```text
🛠️ [amo-fix] Scenario: bug fix
Best standard:
Symptom:
Root-cause judgment:
Recommended fix:
Tradeoffs:
Impact scope:
Verification:
Next: use amo-best for second-pass pressure testing if needed
```
