# Repository Targeting

Infer the target repo in this order:

1. repo name, project name, or explicit path given by the user
2. the repo owning the file path given by the user
3. the repo owning the current active file
4. the most direct implementation file in the current working context
5. if the workspace contains multiple sibling repos, prefer the one containing the target file

If the target is still unsafe to infer, ask one short question only.

Write the docs under the target repo root:

`doc/<requirement-name>/`

Create `doc/` if it does not exist.

The requirement name is the directory name. Keep it short, stable, and easy to recognize.

Rules:

1. if the user provides one, use it
2. if the user provides a stable product-facing feature name, reuse it
3. if only code identifiers exist, convert to concise kebab-case
4. avoid low-signal suffixes like `feature`, `doc`, `docs`, `requirement` unless they add clarity
