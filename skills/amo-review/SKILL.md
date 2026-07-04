---
name: amo-review
description: Use when the user asks to review implemented code for code style, redundancy, unnecessary abstractions, wrappers, helpers, adapters, parsers, type guards, TypeScript type noise, or composable usage clarity. Do not use for solution design, bug diagnosis, refactor planning, or commit messages.
metadata:
  version: '0.1.0'
---

# Amo Review

Review implemented code for style, redundancy, unnecessary abstraction, and TypeScript type clarity.

## Shared Output Marker

Prefix the first output line inline with `🧹 [amo-review]`. Do not put the marker in a separate paragraph.

## Use When

- The user asks for code style review, redundancy review, or cleanup suggestions.
- The code has already been implemented or a diff/file is available to review.
- The review should focus on unnecessary abstractions, TypeScript type noise, composable usage clarity, or maintainability issues.

## Do Not Use

- No implementation exists yet; use `amo-feature`, `amo-improve`, `amo-fix`, or `amo-refactor`.
- A proposal needs best-solution pressure testing; use `amo-best`.
- The user asks for bug root-cause analysis; use `amo-fix`.
- The user asks for commit message generation.

## Workflow

1. Inspect the real code or diff before judging.
2. Identify only issues with concrete maintenance, readability, type-safety, or behavior-source impact.
3. Prefer fewer, higher-confidence findings over broad style opinions.
4. Separate must-fix issues from optional cleanup.
5. Provide exact file/line references when available.

## Code Style Rules

- Do not create or keep helper, wrapper, adapter, parser, type guard, or similar intermediate abstractions for a single call site or one-line logic. After moving code, lifting scope, exporting APIs, or refactoring, re-check by call site. Inline the expression unless the abstraction clearly improves error boundaries, testability, or readability.
- When using composable return values, destructure display-only ref/computed values as needed. Keep state-changing or side-effect functions under the composable namespace by default so the behavior source stays clear.

## TypeScript Type Rules

- Prefer TypeScript inference. Avoid redundant type annotations for intermediate variables, internal functions, and simple return values.
- Declare explicit types at public boundaries: DTOs, component props, exported function parameters, public protocols, request payloads, and response data structures.
- Do not repeat types already determined by generics or framework wrappers. For example, business APIs, controllers, and stores should not handwrite `Promise<ApiResponse<T>>` or `Promise<ApiResult<T>>`.
- Do not handwrite complex generic return types that third-party libraries or factory functions can reliably infer. When reuse is needed, prefer simple utility types such as `ReturnType<typeof fn>`.
- Keep type design simple. Prefer direct `interface` / `type`; avoid complex generics, conditional types, mapped types, or over-abstracted type models for small amounts of code.
- Do not add aliases, wrapper functions, dynamic key parsers, or intermediate abstractions only for semantic naming, future extension, or generalization when they have no current payoff. In self-maintained code with clear structure, prefer direct access and direct calls so type and value sources stay singular and traceable.
- Prefer direct expressions and existing data structures for TypeScript narrowing. Do not add a type guard used by only one call site. Extract a type guard only when the predicate is complex, reused in multiple places, or part of a public boundary API.
- Extract shared types on demand. Add a shared type package only when multiple apps or packages stably reuse the same group of types.

## Key Rules

- Do not ask for abstraction removal unless the abstraction is single-use, redundant, misleading, or hiding behavior source.
- Do not demand explicit types where TypeScript inference is already clear and local.
- Do not rewrite style preferences into findings unless they improve maintainability or correctness.
- Do not propose large refactors from a style review; if the issue is architectural, say it belongs in `amo-refactor`.

## Output

Use the user's language for output labels and content.

```text
🧹 [amo-review] Scenario: code style review
Conclusion:
Must fix:
Suggested cleanup:
No change needed:
Verification:
```
