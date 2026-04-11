---
name: doc-feat-desc
description: Generate a three-file user doc bundle for a real feature by inspecting the implementation first, then writing help-center, site-copy, and in-product docs under `doc/<requirement-name>/`. Follow the user's language unless another language is explicitly requested.
metadata:
  version: "0.1.0"
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
4. Run `scripts/init_doc_bundle.sh <repo-root> <requirement-name>` from this skill directory
5. Write the three Markdown files into `doc/<requirement-name>/`
6. Reply with the repo, directory, file paths, and any key assumptions

## Output Rules

- Keep the fixed filenames unless the user explicitly asks otherwise
- Do not create extra README, notes, changelog, or process files
- Keep formatting simple Markdown
