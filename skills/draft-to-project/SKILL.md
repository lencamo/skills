---
name: draft-to-project
description: Convert UI drafts such as screenshots, HTML drafts, local file:// prototype pages, or mockups into frontend pages inside an existing project. Reuse existing components and styles, and keep the provided layout structure close to the source draft unless the user asks for redesign.
metadata:
  version: '0.2.0'
---

# Draft to Project

Convert UI drafts into frontend pages that fit the current project.

## Use When

- User provides a screenshot or HTML mockup and wants it implemented
- User provides a local `file://...html` draft or prototype page and wants a real project page based on it
- User wants the page to reuse existing project components
- User wants the page to follow project colors, spacing, tables, forms, and modal styles

## Do Not Use

- For backend-only tasks
- For copy or documentation work
- When user explicitly wants a new design system
- When user asks for a full redesign instead of implementing the provided draft

## Core Rule

**Do not reinvent project UI**. Before writing any code:

1. Find existing components that match the mockup's elements (buttons, inputs, tables, cards, modals)
2. Match project colors, spacing tokens, typography, and border radius
3. Reuse existing table, form, and modal patterns
4. Write new styles only when no existing component or local pattern fits

## Layout Constraint

When the user provides a screenshot, HTML draft, or local `file://` page, treat it as the layout baseline by default.

- Preserve the draft's structure unless the user explicitly asks for redesign
- Adapt the visual style to the project, but do not add extra summary blocks, wrappers, or control areas that materially change the page structure unless the user asks for it
- Make necessary adjustments for existing component constraints, responsive behavior, and accessibility

## Workflow

1. Analyze the screenshot/HTML: identify both the UI elements and the fixed layout structure
2. Search the project for existing components that match each element type
3. For each element:
   - If found: reuse it directly
   - If similar but needs adjustment: extend it minimally
   - If not found: check if nearby patterns can be adapted
4. Apply project style tokens: colors, spacing, typography, radii
5. Implement with minimal new styles
6. Before finishing, verify: no duplicate styles, all components exist in project, the implemented layout still matches the draft structure, and available checks pass

## Style Matching Checklist

Check these against existing project patterns:

- **Colors**: Use existing color tokens when available; avoid one-off hardcoded colors
- **Spacing**: Match existing padding/margin values (8px, 12px, 16px, 24px...)
- **Typography**: Use existing font sizes and weights
- **Buttons**: Match button variants (primary, secondary, ghost, danger)
- **Inputs**: Match form input styles and validation feedback
- **Tables**: Match table header/body/row styles
- **Cards**: Match card padding, border, shadow patterns
- **Modals/Popups**: Match modal wrapper, backdrop, header, footer styles

## Output

Before non-trivial implementation, state:

- which existing components you will reuse (with file paths)
- which project style tokens you will align to
- whether any new components or styles are necessary (and why)

Example:

```
Reuse:
- Button: src/components/ui/button.tsx (primary variant)
- Input: src/components/ui/input.tsx
- Table: src/components/data-table.tsx
- Card: src/components/ui/card.tsx

Style alignment:
- Colors: Use project tokens from src/styles/variables.css
- Spacing: 16px padding (matches existing cards)
- Typography: 14px body, 16px headings (matches project)

New styles: None, all elements covered by existing components
```
