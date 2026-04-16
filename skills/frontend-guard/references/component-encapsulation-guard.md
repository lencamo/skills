# Component Encapsulation Guard

Use this reference when page work also requires creating or modifying reusable components, wrapper components, or third-party UI wrappers.

Its purpose is to constrain how those components are written and encapsulated.

Preventing wrapper side effects is one rule in this reference, not the only rule.

Typical cases:

- popup, modal, drawer, bottom-sheet
- transition wrappers
- slot wrappers
- form-field wrappers
- list-item wrappers
- third-party UI components wrapped by local components

## Core Rule

Write reusable components as stable building blocks for pages.

The page should not need to know internal wrapper details to use the component safely.

## Rules

- Treat the root wrapper as part of the component contract.
- Keep the component API simple. Do not leak internal structure requirements to the page.
- Keep layout responsibility clear. Do not silently mix page layout responsibility into a reusable component.
- Keep state responsibility clear. Hidden, closed, disabled, loading, and reset behavior should be intentional.
- Prefer component-level prevention over asking every page to patch component side effects locally.
- Reuse existing project conventions for naming, structure, props, slots, events, and file placement.

## Wrapper Side Effects

A component may look correct while its wrapper still leaks side effects through layout, spacing, scroll height, event propagation, focus behavior, conditional rendering, or state lifetime.

Check these points when writing or modifying a component:

1. Separate the component root wrapper from the visible child content.
2. Check whether the root still participates in normal flow.
3. Check whether the wrapper adds layout-affecting styles such as `flex`, `height`, `min-height`, `padding`, or `overflow`.
4. Check whether only a child node is `fixed` or `absolute`.
5. Check whether hidden state still leaves wrapper DOM mounted.
6. Separate mount-container behavior, visible-content behavior, and state lifetime.

## High-Risk Patterns

- wrapper node with `flex: 1`
- wrapper node inside `flex-direction: column`
- normal-flow wrapper plus `position: fixed` child
- hidden component rendered without `v-if`
- wrapper adding scroll or overflow constraints
- wrapper silently owning state that should reset on close
- local wrapper around third-party component without inspecting the third-party root node

## Fix Order

1. Confirm whether the problem belongs to the wrapper node, not the visible child.
2. If the component is shared, ask whether the side effect should be prevented at the component level.
3. If the shared fix is risky, apply the smallest page-local fix first.
4. Use `v-if` when hidden wrapper DOM should not remain mounted.
5. If the wrapper must remain mounted, move it out of document flow at page level.
6. Patch the shared component when the wrapper pattern is harmful across multiple pages.
