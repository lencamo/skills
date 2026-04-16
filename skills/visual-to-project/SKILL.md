---
name: visual-to-project
description: Convert screenshots, HTML drafts, or mockups into frontend pages matching the project style. Reuse existing components and styles.
metadata:
  version: '0.1.0'
---

# Visual to Project

Convert screenshots or HTML mockups into pages that fit the current project.

## Use When

- User provides a screenshot or HTML mockup and wants it implemented
- User wants the page to reuse existing project components
- User wants the page to follow project colors, spacing, tables, forms, and modal styles

## Do Not Use

- For backend-only tasks
- For copy or documentation work
- When user explicitly wants a new design system

## Core Rule

**Never reinvent UI**. Before writing any code:

1. Find existing components that match the mockup's elements (buttons, inputs, tables, cards, modals)
2. Match project colors, spacing tokens, typography, border radius
3. Reuse existing table, form, and modal patterns
4. Only write new styles when no existing component fits

## Workflow

1. Analyze the screenshot/HTML: identify elements (buttons, inputs, tables, cards, modals, forms)
2. Search the project for existing components that match each element type
3. For each element:
   - If found: reuse it directly
   - If similar but needs adjustment: extend it minimally
   - If not found: check if nearby patterns can be adapted
4. Apply project style tokens: colors, spacing, typography, radii
5. Implement with minimal new styles
6. Before finishing, verify: no duplicate styles, all components exist in project

## Style Matching Checklist

Check these against existing project patterns:

- **Colors**: Use existing color tokens (not hardcoded hex values)
- **Spacing**: Match existing padding/margin values (8px, 12px, 16px, 24px...)
- **Typography**: Use existing font sizes and weights
- **Buttons**: Match button variants (primary, secondary, ghost, danger)
- **Inputs**: Match form input styles and validation feedback
- **Tables**: Match table header/body/row styles
- **Cards**: Match card padding, border, shadow patterns
- **Modals/Popups**: Match modal wrapper, backdrop, header, footer styles

## Output

Before implementation, state:

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
