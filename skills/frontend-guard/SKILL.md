---
name: frontend-guard
description: Use before writing or modifying frontend pages or UI components. Apply as a preventive guard to keep implementations consistent with the existing codebase and avoid common structure, layout, wrapper, and interaction mistakes.
metadata:
  version: '0.1.0'
---

# Frontend Guard

Apply this skill before writing frontend pages or UI code.

This is a pre-implementation guard skill. Use it to avoid page code that is structurally messy, inconsistent with the repo, or likely to leak layout and interaction side effects later.

Read [references/project-consistency-guard.md](references/project-consistency-guard.md) for any new or modified page, section, or component unless the user explicitly asks for a different visual direction.

Read [references/component-encapsulation-guard.md](references/component-encapsulation-guard.md) if page work also requires creating or modifying reusable components, wrapper components, or third-party UI wrappers. This reference constrains component encapsulation in page work; preventing wrapper side effects is one part of it.

## Use When

- Writing or modifying frontend pages, sections, UI code, or page-level interactions
- Building reusable components or wrappers as part of page work
- You want a pre-implementation guardrail to keep structure, style, and behavior simple, consistent, and production-safe

## Do Not Use

- For purely visual copywriting or documentation work
- For backend-only tasks
- For trivial text replacement with no layout, state, or interaction impact
- As a deep post-hoc debugging playbook after the bug is already isolated

## Core Rule

Do not jump straight to implementation. First confirm:

1. the nearest project pattern
2. the layout context, scroll owner, and fixed-layer structure
3. whether the page or component root and wrappers participate in layout
4. whether hidden or conditional state leaves DOM, layout, or event side effects behind
5. how loading, empty, error, and disabled states should be expressed
6. the smallest safe implementation

## Workflow

1. Find `1-3` similar implementations in the repo. If none exist, follow the nearest project convention in the same app, directory, or framework layer.
2. Read `references/project-consistency-guard.md` and follow it unless the user explicitly asks for a different direction.
3. If page work also requires creating or modifying reusable components, wrapper components, or third-party UI wrappers, read `references/component-encapsulation-guard.md` and follow its component encapsulation rules.
4. Before writing code, identify the page structure, scroll owner, fixed layers, and state boundaries.
5. Briefly state the chosen pattern and the main layout or interaction risks before implementation.
6. Implement the smallest safe change.
7. Before finishing, explicitly check hidden DOM, wrapper nodes, and state transitions that may still participate in layout or interactions.

## Guardrails

- Keep page structure shallow and intentional. Do not add wrappers that only make the markup look tidy.
- Treat wrapper nodes and reusable component shells as part of the public behavior of the page or component.
- Do not assume a visible child or a `fixed` child represents the behavior of the whole component root.
- Make loading, empty, error, and disabled states explicit instead of leaving them implicit in scattered conditions.
- Prefer preventing side effects in component design over patching pages later.

## Output

Before implementation, briefly state:

- which existing page or component pattern you will follow
- which layout, wrapper, or state-boundary risks you will guard against

When finishing a frontend implementation, explicitly state:

- which existing page or component pattern you followed
- which layout, wrapper, or state-boundary risk you guarded against
- whether you introduced new styles and why they were necessary
- whether the prevention happened in shared component design or only at page level
- any residual layout, state, or interaction risk
