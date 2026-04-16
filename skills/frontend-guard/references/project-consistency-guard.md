# Project Consistency Guard

Use this reference for any new or modified page, section, or reusable UI component unless the user explicitly asks for a different visual direction.

## Default

New frontend work should adapt to the existing codebase by default.

Do not treat a new page as a blank canvas.

If the user did not explicitly ask for a redesign, new visuals, or a new component system:

- keep the existing project style
- reuse the existing page structure
- reuse the existing components and nearby code paths
- avoid writing new styles unless existing styles are clearly insufficient

## Check First

1. Which page or component in the repo is the closest match.
2. Which layout primitives already exist.
3. Which existing components already solve part of the UI.
4. Which existing styles, tokens, utility classes, or variables are already available.
5. Whether the task can be solved by composition instead of new styling.

## Reuse Order

Prefer reuse in this order:

1. same page or same module patterns
2. same app or package patterns
3. shared components and shared styles
4. new local code only when existing code is not enough

## Rules

- Match the surrounding page style before adding new visual ideas.
- Prefer existing shared components over rebuilding the same UI locally.
- If an existing component is close but not exact, extend it carefully before creating a new primitive.
- Prefer existing spacing, radius, color, border, shadow, typography tokens, utility classes, and shared styles over new page-local style blocks.
- Keep unavoidable new styles local and minimal.
- Reuse existing loading, empty, error, and disabled-state patterns.
- Reuse existing naming and file placement conventions.
- Do not introduce a second visual language into an existing product area.

## When New Styles Are Justified

New styles are justified only when at least one of these is true:

- the repo has no suitable existing primitive
- the task introduces a genuinely new UI pattern
- the existing shared abstraction would become more harmful than a small local style
- the user explicitly asks for a new visual direction
