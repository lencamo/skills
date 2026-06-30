---
name: signature-svg-generator
description: Use when generating reusable signature-style SVG assets or Vue components from font files, including personal signatures, handwritten wordmarks, font-derived SVG paths, or mask-based handwriting animations. Use only when the user wants font-based output, not general logo design.
metadata:
  version: '0.3.0'
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
  --bold-stroke-width 1.4
```

Use `--font <file>` instead of `--font-name <name>` for an explicit local font path.

Generated SVG files and Vue components use the same root `width`, `height`, and `viewBox`.
If `width` and `height` are omitted, display dimensions are derived from the generated `viewBox`.
If only one dimension is provided, the other is derived proportionally from the `viewBox`.
If both dimensions are provided, both SVG and Vue artifacts use those exact display dimensions.

`fontSize` controls the generated font outline path. The legacy `strokeWidth` / `--stroke-width`
input does not change static glyph thickness; handwriting mask strokes should specify their own
`strokeWidth` inside `handwritingStrokes`.

The script also emits bold SVG and Vue artifacts. Bold artifacts use the same font outline path
with an additional same-color outline stroke. `boldStrokeWidth` / `--bold-stroke-width` controls
that outline stroke and defaults to `1.4`.

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
      "boldStrokeWidth": 1.4,
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

Generated output always includes static SVG, fallback-wipe animated SVG, bold SVG, fallback-wipe animated bold SVG, static Vue component, fallback-wipe animated Vue component, bold Vue component, fallback-wipe animated bold Vue component, stroke guide SVG, and stroke guide Vue component.

Best-quality signature replay requires `handwritingStrokes`: centerline paths drawn in human writing order. The script uses those strokes as a mask timeline for the `Handwriting` outputs.

The script always writes a flat stroke guide SVG and matching Vue component beside the generated assets.
The script also writes a flat stroke authoring HTML page beside the generated assets. Open
`<id>.stroke-author.html` in a browser to draw centerline strokes directly over the guide and
export `handwritingStrokes` JSON.
The authoring page uses an independent editing scale, defaulting to 4x, so small production
signatures are easier to trace without changing exported SVG/Vue dimensions or stroke coordinates.
For conversational use, tell users to click `Copy for Agent` after drawing and paste the copied
message back into the chat. They should not need to know where a batch config lives or how to merge
`handwritingStrokes` manually.

The `*.animated.svg`, `*.animated.bold.svg`, `*Animated.vue`, and `*AnimatedBold.vue` files are reserved for the fallback-wipe preview and stay `data-handwriting-mode="fallback-wipe"` even after real strokes are provided.

When `handwritingStrokes` are provided, the script additionally writes `*.handwriting.svg`, `*.handwriting.bold.svg`, `*Handwriting.vue`, and `*HandwritingBold.vue` as the true stroke-timeline animation outputs. Use these `Handwriting` artifacts for the final production signature replay.

`Handwriting` outputs intentionally do not add a final unmasked outline layer. The animation stays on the stroke mask result at the end, so it will not flash from a thinner mask-revealed shape to the complete glyph outline. The fallback-wipe `Animated` outputs keep their final outline layer.

Without `handwritingStrokes`, the script writes only the fallback-wipe animated artifacts and also writes a flat stroke template beside the generated assets.

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
2. Open `signatures/<signature-text-slug>/<id>.stroke-author.html`.
3. Draw centerline strokes over the glyphs in natural writing order. Each pointer down/up gesture becomes one `handwritingStrokes` item.
4. Use the author scale slider only for editing comfort; it does not change exported coordinates.
5. Use the stroke width slider so the mask stroke covers the glyph body without revealing adjacent strokes too early.
6. Click `Copy for Agent` and paste the copied handoff message back into the conversation.
7. The agent merges the included `handwritingStrokes` into the matching signature config, regenerates, and verifies the new `Handwriting` SVG/Vue animation while preserving the fallback-wipe `Animated` files.

Use `stroke-guide.svg` only when authoring in an external vector tool such as Inkscape, Figma, or Illustrator.

## Output Contract

When generation succeeds, the script writes a flat folder under `signatures/` named from the signature text. For example, `Ting Note!` becomes `signatures/ting-note/`.

```text
signatures/
└── ting-note/
    ├── tingnote-caveat.svg
    ├── tingnote-caveat.animated.svg
    ├── tingnote-caveat.handwriting.svg
    ├── tingnote-caveat.bold.svg
    ├── tingnote-caveat.animated.bold.svg
    ├── tingnote-caveat.handwriting.bold.svg
    ├── TingNoteSignatureCaveat.vue
    ├── TingNoteSignatureCaveatAnimated.vue
    ├── TingNoteSignatureCaveatHandwriting.vue
    ├── TingNoteSignatureCaveatBold.vue
    ├── TingNoteSignatureCaveatAnimatedBold.vue
    ├── TingNoteSignatureCaveatHandwritingBold.vue
    ├── TingNoteSignatureCaveatStrokeGuide.vue
    ├── tingnote-caveat.stroke-guide.svg
    ├── tingnote-caveat.stroke-author.html
    └── tingnote-caveat.strokes.template.json
```

Each generated variant must keep together:

- static SVG
- fallback-wipe animated SVG
- handwriting SVG when `handwritingStrokes` are provided
- bold SVG
- fallback-wipe animated bold SVG
- handwriting bold SVG when `handwritingStrokes` are provided
- static Vue component
- fallback-wipe animated Vue component
- handwriting Vue component when `handwritingStrokes` are provided
- bold Vue component
- fallback-wipe animated bold Vue component
- handwriting bold Vue component when `handwritingStrokes` are provided
- stroke guide SVG
- stroke guide Vue component
- stroke authoring HTML
- stroke template when `handwritingStrokes` are not provided

Do not copy font files or license files into the output folder.

## Vue Usage

For comparison, import generated components into a local preview UI and render them via `<component :is="...">`.

For final production use, keep only the selected SVG/component artifacts. Do not create a global font picker unless the user asks for productized settings.

## Validation

Before claiming completion:

1. Confirm the expected static SVG, fallback-wipe animated SVG, bold SVG, fallback-wipe animated bold SVG, static Vue component, fallback-wipe animated Vue component, bold Vue component, fallback-wipe animated bold Vue component, stroke guide SVG, stroke guide Vue component, and stroke authoring HTML exist. When `handwritingStrokes` are provided, also confirm the `Handwriting` SVG/Vue artifacts exist.
2. Confirm generated files are non-empty and contain real SVG path data.
3. Confirm bold artifacts contain same-color outline stroke styling and normal artifacts do not.
4. Confirm the stroke authoring HTML contains the guide path, author scale control, and can export `handwritingStrokes`.
5. Confirm the output folder is flat and contains no copied `fonts/`, `generated/`, `components/`, or `authoring/` subfolders.
6. Report the used font path, source (`explicit`, `project`, `bundled`, or `downloaded`), output folder, commercial-use status, and any skipped fonts. Treat a missing local-font license as unknown status, not generation failure.

## Dependencies

The script uses the bundled `scripts/opentype.js` from `opentype.js@1.3.4`. It does not install dependencies, modify the target project's `package.json`, or assume the target project uses a specific package manager.
