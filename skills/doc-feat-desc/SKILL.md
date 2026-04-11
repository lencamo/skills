---
name: doc-feat-desc
description: Use when the user wants user-facing docs for an implemented feature. Inspect the real implementation first, then write help-center, site-copy, and in-product docs under `doc/<requirement-name>/`.
metadata:
  version: '0.1.0'
---

# Doc Feat Desc

Generate three user-facing docs for an already implemented feature and write them to disk.

Read [references/workspace-projects.md](references/workspace-projects.md) for repo targeting and requirement naming.  
Read [references/doc-variants.md](references/doc-variants.md) for structure, tone, and quality checks.

## Use When

- The user wants docs for a real feature, component, page, API, or module
- You need all three outputs:
  - `help-center-full.md`
  - `official-site-copy.md`
  - `in-product-short.md`
- The docs must come from the real implementation
- The result should be saved under `doc/<requirement-name>/`

## Do Not Use

- For internal architecture docs, ADRs, migration plans, or developer-only docs
- For API reference generation from specs alone
- For speculative copy for features that do not exist yet
- For one-off README edits, release notes, or a single short paragraph

## Core Rules

- Follow the user's language unless another language is explicitly requested
- Keep all three docs in the same language
- Read the implementation before writing
- Do not invent capabilities or hide uncertainty
- Use real product labels, entry names, and terminology
- Keep the docs user-facing and concise

## Workflow

1. Resolve the target repo, subject, requirement name, and output language
2. Read the main implementation and enough nearby code or UI copy to confirm behavior
3. If docs already exist, read them first and preserve correct naming
4. Create `doc/<requirement-name>/` if it does not exist
5. Create or update:
   - `help-center-full.md`
   - `official-site-copy.md`
   - `in-product-short.md`
6. Write the three Markdown files into `doc/<requirement-name>/`
7. Reply with the repo, directory, file paths, and any key assumptions

## Output Rules

- Keep the fixed filenames unless the user explicitly asks otherwise
- Do not create extra README, notes, changelog, or process files
- Keep formatting simple Markdown
- Do not turn internal implementation details into user-facing language
