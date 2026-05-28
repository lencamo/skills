---
name: split-pencil-file
description: Split an imported Pencil `.pen` design file into one folder per top-level Frame, each containing `index.pen` and the local image assets referenced by that frame. Use for Figma-to-Pencil imports or large `.pen` files that need page/frame-level isolation.
metadata:
  version: '0.1.0'
---

# Split Pencil File

Split a large Pencil `.pen` file into reusable per-frame folders.

## Use When

- A `.fig` file has been imported into Pencil and saved as one large `.pen`
- The user wants each top-level Layer/Frame as a separate Pencil file
- The desired output is:
  - `output-dir/<frame-name>/index.pen`
  - copied local image assets beside that `index.pen`
- The user wants repeated `Container` or duplicate names preserved with numbered folders

## Do Not Use

- For editing the visual design itself
- For splitting every nested text, icon, button, or child layer
- For source Figma files that have not been imported into Pencil yet
- When the user needs multi-page Figma import behavior confirmed in Figma rather than in the `.pen` file

## Core Rules

- Confirm the real `.pen` structure before splitting. Do not assume Page or Frame structure.
- Split only top-level `frame` nodes by default.
- Skip non-frame top-level nodes such as background rectangles and annotation groups unless the user explicitly asks otherwise.
- Preserve each frame node as-is; do not rewrite child layout, styles, text, image references, ids, or coordinates.
- Sanitize folder names for the local filesystem and append `-2`, `-3`, etc. for duplicates.
- Copy only local image files referenced by each frame into that frame folder.
- If the `.pen` contains multiple pages, select the requested page by exact name or index before splitting. If no target page is clear, ask before proceeding.

## Script

Use the bundled script for deterministic splitting:

```bash
node skills/split-pencil-file/scripts/split-pencil-file.js \
  --input dev_design/source.pen \
  --output-dir dev_design \
  --force
```

Useful options:

- `--input <file>`: required source `.pen`
- `--output-dir <dir>`: output root; defaults to the source file directory
- `--page <name-or-index>`: target page when the `.pen` has a top-level `pages` array
- `--force`: overwrite existing generated frame folders
- `--dry-run`: print the plan without writing files

## Workflow

1. Inspect the source:

   ```bash
   jq -r 'keys_unsorted[]' <source.pen>
   jq -r '.children | to_entries[] | "\(.key)\t\(.value.type)\t\(.value.id)\t\(.value.name // "")"' <source.pen>
   ```

2. If the file has `pages`, inspect pages and pick the target page explicitly:

   ```bash
   jq -r '.pages | to_entries[] | "\(.key)\t\(.value.name // "")\t\((.value.children // []) | length)"' <source.pen>
   ```

3. Run the script with `--dry-run` if the output structure or count is uncertain.
4. Run the script for real.
5. Validate:
   - generated folder count equals the number of selected top-level frames
   - every folder has `index.pen`
   - every `index.pen` parses as JSON and contains one top-level frame
   - local image references exist beside their `index.pen`
6. Report:
   - output root
   - generated frame count
   - skipped non-frame top-level nodes
   - manifest path
   - any copied image assets

## Output

The script writes:

```text
<output-dir>/
  <frame-name>/
    index.pen
    image-import.png
  <frame-name-2>/
    index.pen
  frame-split-manifest.json
```

The manifest records original frame names, ids, output directories, `index.pen` paths, copied images, and skipped top-level nodes.
