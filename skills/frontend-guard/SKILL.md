---
name: frontend-guard
description: Use before writing or modifying frontend pages or UI components. Apply as a preventive guard to reuse existing components, align with the project, fit local UI sizing, and avoid unnecessary new styles.
metadata:
  version: '0.1.11'
---

# Frontend Guard

Use this skill before implementing frontend pages or UI code. Prioritize component reuse, project alignment, local size fit, and minimal new styling.

Read [references/project-consistency-guard.md](references/project-consistency-guard.md) for any new or modified page, section, or component unless the user explicitly asks for a different visual direction.

Read [references/component-encapsulation-guard.md](references/component-encapsulation-guard.md) when implementing a page also requires writing a new child component, shared component, wrapper component, or local wrapper around a third-party UI primitive. Those components should follow the `component-encapsulation-guard` constraints.

## Use When

- Writing or modifying frontend pages, sections, UI code, or page-level interactions
- Implementing the page also requires writing a new child component, shared component, or wrapper

## Do Not Use

- For backend-only tasks
- For copy or documentation work
- For trivial text-only changes with no layout, state, or interaction impact
- For post-hoc debugging after the problem is already isolated

## Core Rule

Do not jump straight to implementation. Follow this order first:

1. the nearest project pattern
2. the best existing reusable component or wrapper you can build on
3. the existing project style baseline and nearby local patterns you can reuse
4. the local visual baseline for size, spacing, radius, and typography
5. whether only a small amount of new manual styling is still necessary
6. the layout context, scroll owner, fixed layers, and wrapper or state boundaries
7. the smallest safe implementation

## Workflow

1. Find `1-3` similar implementations in the repo. If none exist, follow the nearest project convention in the same app, directory, or framework layer.
2. Read `references/project-consistency-guard.md` and follow it unless the user explicitly asks for a different direction.
3. Reuse components and wrappers first: existing shared component, existing local module component, extension of an existing primitive, or only then new page-local markup.
4. Reuse the project's existing style baseline and nearby local patterns next: spacing rhythm, typography, radii, borders, utility classes, and local layout patterns before inventing new values.
5. Fit element and typography sizing against adjacent existing UI or a provided screenshot. Do not size new UI in isolation.
6. Only then add a small amount of new manual styling when reuse still cannot cover the requirement.
7. If implementing the page also requires writing a new child component, shared component, wrapper component, or local wrapper around a third-party UI primitive, read `references/component-encapsulation-guard.md` and follow its constraints.
8. Before writing code, identify the page structure, state boundaries, and main layout or wrapper risks.
9. Implement the smallest safe change.
10. Before finishing, explicitly check hidden DOM or wrapper side effects, state transitions, adjacent visual proportion, and whether new styles could have been reduced by reuse.

## Guardrails

- Reuse components before writing new page-local structures. Treat page-local markup as the fallback, not the default.
- Reuse existing style baselines and nearby local patterns before inventing new values.
- Fit sizes against adjacent existing UI before introducing new measurements in isolation.
- Treat manual page-local styling as the last resort, not the starting point.
- Align new UI to the existing product area, not to an isolated local ideal.
- Keep new manual styles minimal when they are still necessary.
- If a popup, form, card, or action block needs a large custom subtree plus many local styles, stop and re-check ownership and reuse.

## Output

Before implementation, briefly state:

- which existing pattern you will follow
- which reuse path you chose
- which style baseline and size reference you will align to
- whether any new manual styles still seem necessary

When finishing a frontend implementation, explicitly state:

- which existing pattern you followed
- which reuse path you used
- which style baseline and size reference you aligned to
- whether new styles were minimized and why any remained
- which main risk you guarded against
- any residual layout, state, interaction, or visual matching risk
