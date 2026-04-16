# Project Consistency Guard

Use this reference for any new or modified page, section, or reusable UI component unless the user explicitly asks for a different visual direction.

## Default

New frontend work should adapt to the existing codebase by default.

Do not treat a new page as a blank canvas.

If the user did not explicitly ask for a redesign, new visuals, or a new component system:

- keep the existing project style
- prefer existing components and wrappers before page-local rebuilds
- reuse the existing page structure
- reuse the existing components and nearby code paths
- reuse existing style primitives and local layout rhythms before inventing new values
- avoid writing new styles unless existing styles are clearly insufficient

## Check First

1. Which page or component in the repo is the closest match.
2. Which layout primitives or shared components already solve most of the job.
3. Which existing styles, tokens, utility classes, or variables are already available.
4. Whether the task can be solved by composition or extension instead of new page-local markup and CSS.
5. What the local visual baseline is for height, typography, spacing, radius, border, and width.

## Reuse Decision

Before writing new page-local markup, decide in this order:

1. can an existing shared component be used as-is
2. can an existing shared component be extended safely
3. can a local module component be reused or extracted
4. only then write new page-local structure and styles

If your implementation adds a popup/card/form/action subtree with multiple dedicated class blocks, treat that as a signal to re-check this decision.

## Visual Alignment

When adding or changing a local section inside an existing page, do not only ask "does it look fine on its own?" Ask "does it match the size relationships of the neighboring UI?"

Check these:

1. action hierarchy matches nearby buttons and links
2. title, body, and helper text feel like the same typography system
3. height, padding, radius, border, and width stay within the local range of adjacent controls or blocks
4. spacing rhythm follows nearby sections instead of introducing a new cadence
5. local custom styles stay limited to the truly new part of the UI

Before reusing a nearby control as a size reference, classify the new control correctly:

- primary CTA
- secondary action
- inline entry
- list-card action
- input or form field
- helper or explanatory text

Do not size a secondary entry button as if it were the page's primary submit button.

## Screenshot Handling

If the user provides a screenshot or mock:

1. treat it as a constraint, not just inspiration
2. prefer the project when it already answers the decision; use the screenshot to resolve the remaining details
3. first match proportions, then colors and minor decoration
4. do a final visual pass specifically for "too large / too small / too heavy / too light" issues
5. explicitly check whether the screenshot shows a lighter secondary control instead of a full-width primary button

## When New Styles Are Justified

New styles are justified only when at least one of these is true:

- the repo has no suitable existing primitive
- the task introduces a genuinely new UI pattern
- the existing shared abstraction would become more harmful than a small local style
- the user explicitly asks for a new visual direction
