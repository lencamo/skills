---
name: brand-asset-generator
description: Use when generating or wiring project-ready brand image assets from a user-provided logo, mark, or icon source image, including transparent source marks, favicon, PWA icons, apple touch icons, desktop app icons, tray icons, ICO, and ICNS outputs.
metadata:
  version: '0.1.2'
---

# Brand Asset Generator

Generate a reusable image asset package from one logo, mark, or icon source image.

## Workflow

1. Confirm the source image path and intended output target.
2. If the user wants integration into an existing app, inspect the project first and identify the expected public/static/icon paths.
3. Generate assets into a temporary or explicit output directory with the bundled script.
4. Copy generated files into app paths only when the user asks for integration or the project clearly already has matching icon paths.
5. Verify generated dimensions, transparency/background behavior, and any copied project references.

## Use When

- The user provides a source image and wants project-ready brand or logo assets.
- The user needs transparent app/web source marks with different padding.
- The user needs favicon, PWA, apple touch, desktop app, tray, `.ico`, or `.icns` outputs.
- The user wants a configurable background color for outputs that should not stay transparent.
- The user wants generated assets placed into an existing web, PWA, Electron, Tauri, or desktop-app project.

## Do Not Use

- Do not use for designing a new logo from scratch.
- Do not assume project-specific output paths before inspecting the target project.
- Do not copy generated files into application folders unless the user asks for integration or matching paths already exist.
- Do not add image-processing dependencies to the target project just to run this local generator.

## Required Inputs

Require:

- `--input <file>`: source image path.
- `--output-dir <dir>`: generated asset root.

Use `--name <name>` when the source marks need a stable prefix. If omitted, derive it from the input filename.

## Script

Run the bundled script:

```bash
python3 <skill-dir>/scripts/generate_brand_assets.py \
  --input path/to/source.png \
  --output-dir path/to/output \
  --name brand \
  --profile all \
  --background "#ffffff"
```

Options:

- `--profile source|web|desktop|all`: choose the output group; default is `all`.
- `--background "#rrggbb"`: default background for non-transparent outputs; default is `#ffffff`.
- `--web-fill <0..1>`: visible subject scale for web source mark; default is `0.86`.
- `--app-fill <0..1>`: visible subject scale for app/desktop source mark; default is `0.68`.
- `--favicon-corner-radius <0..0.5>`: rounded background radius ratio for favicon outputs; default is `0.18`.
- `--web-corner-radius <0..0.5>`: rounded background radius ratio for regular PWA web icons; default is `0.22`.
- `--favicon-container-inset <0..0.4>`: override transparent outer inset for favicon PNG outputs; default is per-size.
- `--web-container-inset <0..0.4>`: transparent outer inset for regular PWA web icons; default is `0.08`.
- `--background-threshold <n>`: RGB edge-background removal tolerance; default is `28`.
- `--force-background`: apply background to all generated PNG and ICO/ICNS outputs.
- `--transparent-background`: keep outputs transparent even when they normally get the default background.

If Pillow is missing, install it in the active Python environment:

```bash
python3 -m pip install --user pillow
```

## Project Placement

When integrating generated assets into a project, prefer existing conventions over new paths:

- Web/static apps: place favicons and PWA icons in the configured public/static root, commonly `public/`, `static/`, or app-specific asset folders.
- Next.js/App Router: check `app/icon.*`, `app/apple-icon.*`, `public/`, and metadata config before adding files.
- Vite/React/Vue/Svelte apps: check `public/`, `index.html`, and any manifest file before replacing favicons.
- PWA projects: update the existing `manifest.json` or `site.webmanifest` only when icon paths need to change.
- Electron/Tauri/desktop projects: check the builder config for icon paths before copying `desktop/icon.*` or tray images.

If there is no existing convention and the user did not request direct integration, report the generated output directory instead of choosing an app path.

## Output Contract

The script writes:

```text
<output-dir>/
  source/
    <name>-mark-app.png
    <name>-mark-web.png
  web/
    favicon-16x16.png
    favicon-32x32.png
    favicon-48x48.png
    favicon.png
    favicon.ico
    icon-192.png
    icon-512.png
    icon-192-maskable.png
    icon-512-maskable.png
    apple-touch-icon.png
  desktop/
    icon.icns
    icon.ico
    icon.png
    icons/
      16x16.png
      24x24.png
      32x32.png
      48x48.png
      64x64.png
      96x96.png
      128x128.png
      256x256.png
      512x512.png
      1024x1024.png
    tray.ico
    tray.png
    trayTemplate.png
    trayTemplate@2x.png
  preview.png
```

## Generation Rules

- Remove only the edge-connected background for RGB sources; keep same-colored interior details.
- Preserve existing alpha when the input already has transparency.
- Write source marks as 512x512 RGBA transparent PNGs.
- Use `mark-web` for favicons, regular PWA icons, and tray icons.
- Use `mark-app` for apple touch, maskable PWA icons, desktop app icons, `.ico`, and `.icns`.
- Add background by default to web favicons, regular PWA icons, maskable PWA icons, `apple-touch-icon.png`, `desktop/icon.png`, `desktop/icons/*.png`, `desktop/icon.ico`, and `desktop/icon.icns`.
- Apply rounded backgrounds by default to web favicon outputs and regular PWA icons because those contexts do not consistently auto-mask icons.
- Add transparent outer inset to larger rounded web PNGs by default: `favicon-48x48.png` uses `0.04`, `favicon.png` uses `0.06`, and regular PWA icons use `0.08`; `favicon-16x16.png`, `favicon-32x32.png`, and `favicon.ico` use no outer inset to preserve small-size clarity.
- Keep `apple-touch-icon.png`, maskable PWA icons, and desktop app icons as full square backgrounds because those contexts may apply platform masking or need full icon resources.
- Keep tray icons and source marks transparent by default.
- Create macOS tray template images as black template PNGs with transparent alpha.

## Validation

After generation, verify:

- source marks are `RGBA`, 512x512, and have transparent corners.
- web PNG dimensions match their filenames.
- web favicon outputs and regular PWA icons have transparent rounded corners and expected outer inset by default.
- maskable PWA icons and `apple-touch-icon.png` have opaque background corners by default.
- `favicon.ico` contains 16x16, 32x32, and 48x48.
- desktop PNG dimensions match their filenames.
- `icon.ico` and `tray.ico` contain 16, 24, 32, 48, 64, 128, and 256 sizes.
- square default-background outputs have the requested background color at the corners.
- `preview.png` exists.

Report the output directory, generated groups, key files, and validation summary.
