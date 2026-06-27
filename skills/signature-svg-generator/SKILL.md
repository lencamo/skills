---
name: signature-svg-generator
description: Use when generating reusable signature-style SVG assets or Vue components from font files, including personal signatures, handwritten wordmarks, logo text, font-based SVG paths, or mask-based handwriting animations.
---

# Signature SVG Generator

## Purpose

Generate reusable signature-style SVG assets from real font files. Use the bundled script as the source of truth for conversion, font copying, license copying, SVG output, and Vue component output.

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
3. Output root directory. The script always writes a `signatures/` tree under this directory.

Do not invent missing required inputs. If more than one required input is missing, ask for all missing inputs in one response.

## Missing Input Handling

Respond in the user's language.

If the user gives only signature text, explain that font input and output root are still required. Show the supported font input methods and the bundled font list.

If the user gives text and font but no output root, ask only for the output root.

If the user gives text and output root but no font, show the supported font input methods and bundled font list.

If all required inputs are available, generate immediately.

For Chinese users, use this concise response shape when font and output root are missing:

```text
已识别签名文本：`<text>`

还需要提供字体和输出目录。

字体可以用以下任一方式提供：
- 回复内置字体名，例如 `Caveat`
- 提供本地 `.ttf` / `.otf` 字体路径
- 指定 Google Fonts 字体名，让脚本尝试下载

内置推荐：
| 字体 | 字体文件 | 适合场景 |
| --- | --- | --- |
| `Caveat` | `Caveat[wght].ttf` | 自然手写、个人签名、轻松随性的文本标识 |
| `Sacramento` | `Sacramento-Regular.ttf` | 细线优雅签名、个人品牌、精致 logo 文本 |
| `DancingScript` | `DancingScript[wght].ttf` | 温暖流畅、创作者品牌、邀请函风格 |
| `Ballet` | `Ballet[opsz].ttf` | 高级感书法、艺术、时尚、奢侈品风格；不适合很小尺寸 |
| `PatrickHand` | `PatrickHand-Regular.ttf` | 轻松手写体、教育、笔记、原型项目 |
| `LXGWWenKai` | `LXGWWenKai-Regular.ttf` | 中文手写感、阅读、笔记、教育场景 |
| `Inter` | `Inter[opsz,wght].ttf` | 清晰产品字标，非签名优先 |
| `NotoSans` | `NotoSans[wdth,wght].ttf` | 多语言清晰字标 |
| `NotoSansSC` | `NotoSansSC[wght].ttf` | 简体中文清晰字标 |

请回复字体和输出目录，例如：
`Caveat，输出到 /path/to/project`
```

For English users, translate the same structure instead of returning a fixed English-only table.

## Bundled Fonts

Bundled font files live in `assets/fonts/`. Font aliases are matched by filename, so `Caveat` resolves to `Caveat[wght].ttf`.

Use the script to list project fonts, existing generated candidates, and bundled fonts:

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs --list-fonts --out-dir <output-root>
```

Use the actual skill directory for `<skill-dir>`, for example `skills/signature-svg-generator`.

## Font Resolution

Resolve fonts in this order:

1. `--font <file>`: copy the explicit local font and matching license file into `<out-dir>/signatures/fonts`.
2. `--font-name <name>`: search `<out-dir>/signatures/fonts`.
3. Search bundled fonts in `<skill-dir>/assets/fonts`.
4. If still missing, download the requested family from Google Fonts into `<out-dir>/signatures/fonts`.

Do not block generation only because commercial status is unknown. Always report the status after generation.

## Generate One Signature

Run from the target project root or pass absolute paths:

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs \
  --text "Avery Stone" \
  --font-name Sacramento \
  --id avery-stone-sacramento \
  --out-dir . \
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
  "outDir": ".",
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
      "handwritingAnimation": false
    }
  ]
}
```

Run:

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs --config signatures/signatures.json
```

## Handwriting Animation

Enable handwriting mode when the user asks for real handwriting, signature replay, mask-based writing, or a "from beginning to end" signing effect:

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs \
  --text "Mira Chen" \
  --font-name Caveat \
  --id mira-chen-caveat \
  --out-dir . \
  --component-name MiraChenSignatureCaveat \
  --handwriting-animation true \
  --animation-duration-ms 1430
```

Handwriting mode keeps the font outline as the final shape and reveals it through animated centerline mask paths. Without custom `handwritingPaths`, the script generates a simple left-to-right approximation.

For higher fidelity, provide `handwritingPaths` in config:

```json
{
  "d": "M17 15 C15.5 21 13.5 31 10.2 46",
  "strokeWidth": 8
}
```

## Output Contract

When generation succeeds, the script always writes this tree under `<out-dir>`:

```text
signatures/
├── fonts/
│   ├── FontName.ttf
│   └── OFL-font-name.txt
├── generated/
│   └── person-name-font-name.svg
└── components/
    └── PersonNameSignatureFontName.vue
```

Each generated variant must keep together:

- the source font file under `signatures/fonts/`
- the license file when available
- the source SVG under `signatures/generated/`
- the Vue component under `signatures/components/`

The `signatures/` directory is the complete output artifact.

## Vue Usage

For comparison, import generated components into a local preview UI and render them via `<component :is="...">`.

For final production use, keep only the selected component, source SVG, font file, and license file. Do not create a global font picker unless the user asks for productized settings.

## Validation

Before claiming completion:

1. Confirm the expected SVG, Vue component, font, and license files exist.
2. Confirm generated files are non-empty and contain real SVG path data.
3. If wiring into an app, run the relevant app build, for example `pnpm build`.
4. Confirm generated SVG/component count matches the intended variants.
5. Report the used font path, source (`explicit`, `project`, `bundled`, or `downloaded`), and commercial-use status.
6. Report skipped fonts and why, especially missing files, invalid files, download failures, or oversized CJK fonts.

## Dependencies

The script uses `opentype.js`. If it is unavailable, the script installs `opentype.js@1.3.4` into a temporary OS directory. It does not modify the target project's `package.json` or workspace dependencies.
