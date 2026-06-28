---
name: signature-svg-generator
description: Use when generating reusable signature-style SVG assets or Vue components from font files, including personal signatures, handwritten wordmarks, font-derived SVG paths, or mask-based handwriting animations. Use only when the user wants font-based output, not general logo design.
metadata:
  version: '0.2.0'
---

# Signature SVG Generator

## Purpose

Generate reusable signature-style SVG and Vue component assets from real font files. Use the bundled script as the source of truth for font resolution, SVG output, and Vue component output.

## When Not To Use

- Do not use for hand-drawn custom logos unless the user explicitly wants font-derived SVG paths as a starting point.
- Do not copy font files into runtime app directories.
- Do not create productized font pickers or preview UIs unless the user asks for them.

## Required Inputs

Require these before generation:

1. Signature text, for example `Avery Stone`, or `Mira Chen`.
2. Font input, using one of:
   - bundled font name, for example `Caveat`
   - local `.ttf` or `.otf` path
   - Google Fonts family name for script download

Do not invent missing required inputs. If more than one required input is missing, ask for all missing inputs in one response.

## Missing Input Handling

Respond in the user's language.

If the user gives only signature text, explain that font input is still required. Show the supported font input methods and run `--list-fonts` when possible to show the actual bundled font list.

If the user gives text but no font, show the supported font input methods and run `--list-fonts` when possible to show the actual bundled font list.

If all required inputs are available, generate immediately.

When asking for missing inputs, keep the response short: acknowledge provided inputs, list only missing inputs, show supported font input methods, and include one concrete example.

## Bundled Fonts

Bundled font files live in `assets/fonts/`. Font aliases are matched by filename token, so `Caveat` resolves to `Caveat[wght].ttf` and `Sacramento` resolves to `Sacramento-Regular.ttf`.

Use the script to list project fonts, existing generated candidates, and bundled fonts:

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs --list-fonts
```

Use the actual skill directory for `<skill-dir>`, for example `skills/signature-svg-generator`.

If a font name matches multiple files, rerun with the exact listed font name instead of guessing.

## Font Resolution

Resolve fonts in this order:

1. `--font <file>`: use the explicit local font path without copying it into the output.
2. `--font-name <name>`: search legacy project fonts under `signatures/fonts` from the project root for backward compatibility.
3. Search bundled fonts in `<skill-dir>/assets/fonts`.
4. If still missing, download the requested family from Google Fonts into an OS temp cache.

Do not block generation only because commercial status is unknown. Always report the status after generation. If Google Fonts download is needed, network access must be available.

## Generate One Signature

Run from the target project root:

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs \
  --text "Avery Stone" \
  --font-name Sacramento \
  --id avery-stone-sacramento \
  --component-name AveryStoneSignatureSacramento \
  --label Sacramento \
  --width 106 \
  --height 27 \
  --font-size 52 \
  --stroke-width 1.65
```

Use `--font <file>` instead of `--font-name <name>` for an explicit local font path.

## Batch Generation

Use a JSON config when generating or comparing multiple variants:

```json
{
  "text": "Avery Stone",
  "variants": [
    {
      "id": "avery-stone-sacramento",
      "label": "Sacramento",
      "component": "AveryStoneSignatureSacramento",
      "fontName": "Sacramento",
      "width": 106,
      "height": 27,
      "fontSize": 52,
      "strokeWidth": 1.65,
      "handwritingStrokes": []
    }
  ]
}
```

Run:

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs --config signature-batch.json
```

## Handwriting Animation

The script always emits both static and animated artifacts. The legacy `handwritingAnimation` flag is accepted but no longer required.

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs \
  --text "Mira Chen" \
  --font-name Caveat \
  --id mira-chen-caveat \
  --component-name MiraChenSignatureCaveat
```

Generated output always includes a static SVG, animated SVG, static Vue component, animated Vue component, stroke guide SVG, and stroke guide Vue component.

Animated mode keeps the font outline as the final shape. Best-quality signature replay requires `handwritingStrokes`: centerline paths drawn in human writing order. The script uses those strokes as a mask timeline and keeps a final complete outline layer for stability.

The script always writes a flat stroke guide SVG and matching Vue component beside the generated assets.

Without `handwritingStrokes`, the animated SVG and Vue component use `data-handwriting-mode="fallback-wipe"` and the script also writes a flat stroke template beside the generated assets.

Font outlines do not contain real pen stroke order. For true signature replay from beginning to end, draw or provide `handwritingStrokes`. The legacy `handwritingPaths` field is accepted as an alias, but prefer `handwritingStrokes`.

Treat `fallback-wipe` as a visual placeholder, not real handwriting. For true signing motion, provide `handwritingStrokes`.

Stroke timing is automatic by path length unless a stroke provides `durationMs` or `delayMs`. Use `--animation-duration-ms <ms>` or `animationDurationMs` only when the user asks for a fixed total fallback duration.

For `stroke-timeline` output, each mask stroke must use a path-length dashoffset timeline with a small guard length: `stroke-dasharray="<length> <length>"`, `stroke-dashoffset="<length>"`, and a matching `--path-length` style variable. Do not replace this with `pathLength="1"` or animate `stroke-dasharray`; that changes the rendered signing behavior.

For high fidelity, provide `handwritingStrokes` as an array on the config variant:

```json
{
  "text": "Mira Chen",
  "variants": [
    {
      "id": "mira-chen-caveat",
      "component": "MiraChenSignatureCaveat",
      "fontName": "Caveat",
      "handwritingStrokes": [
        {
          "d": "M17 15 C15.5 21 13.5 31 10.2 46",
          "strokeWidth": 8,
          "durationMs": 190,
          "delayMs": 0
        }
      ]
    }
  ]
}
```

Recommended authoring workflow:

1. Generate once with no strokes.
2. Open `signatures/<signature-text-slug>/<id>.stroke-guide.svg`.
3. Draw centerline strokes over the glyphs in natural writing order.
4. Paste the exported stroke `d` values into `handwritingStrokes`.
5. Regenerate and verify the SVG/Vue animation.

## Output Contract

When generation succeeds, the script writes a flat folder under `signatures/` named from the signature text. For example, `Ting Note!` becomes `signatures/ting-note/`.

```text
signatures/
└── ting-note/
    ├── tingnote-caveat.svg
    ├── tingnote-caveat.animated.svg
    ├── TingNoteSignatureCaveat.vue
    ├── TingNoteSignatureCaveatAnimated.vue
    ├── TingNoteSignatureCaveatStrokeGuide.vue
    ├── tingnote-caveat.stroke-guide.svg
    └── tingnote-caveat.strokes.template.json
```

Each generated variant must keep together:

- static SVG
- animated SVG
- static Vue component
- animated Vue component
- stroke guide SVG
- stroke guide Vue component
- stroke template when `handwritingStrokes` are not provided

Do not copy font files or license files into the output folder.

## Vue Usage

For comparison, import generated components into a local preview UI and render them via `<component :is="...">`.

For final production use, keep only the selected SVG/component artifacts. Do not create a global font picker unless the user asks for productized settings.

## Validation

Before claiming completion:

1. Confirm the expected static SVG, animated SVG, static Vue component, animated Vue component, stroke guide SVG, and stroke guide Vue component exist.
2. Confirm generated files are non-empty and contain real SVG path data.
3. Confirm the output folder is flat and contains no copied `fonts/`, `generated/`, `components/`, or `authoring/` subfolders.
4. Report the used font path, source (`explicit`, `project`, `bundled`, or `downloaded`), output folder, commercial-use status, and any skipped fonts. Treat a missing local-font license as unknown status, not generation failure.

## Dependencies

The script uses the bundled `scripts/opentype.js` from `opentype.js@1.3.4`. It does not install dependencies, modify the target project's `package.json`, or assume the target project uses a specific package manager.
