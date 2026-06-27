#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const requireFromHere = createRequire(import.meta.url)
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = path.resolve(SCRIPT_DIR, '..')
const DEFAULT_FONT_DIR = 'signatures/fonts'
const DEFAULT_FONT_CANDIDATE_DIR = 'signatures/components'
const DEFAULT_BUNDLED_FONT_DIR = path.join(SKILL_DIR, 'assets/fonts')
const DEFAULT_HANDWRITING_ANIMATION_DURATION_MS = 1430
const FONT_SCENARIOS = {
  Ballet: 'High-contrast elegant calligraphy for art, fashion, luxury, or ceremonial wordmarks. Avoid for compact UI.',
  Caveat: 'Casual handwritten signature for friendly products, notes, personal tools, and natural handwriting animation.',
  DancingScript: 'Warm flowing script for creator brands, invitations, lifestyle pages, and expressive medium-size display.',
  Inter: 'Neutral modern sans for product UI, technical brands, and readability-first wordmarks rather than signatures.',
  LXGWWenKai: 'Chinese handwriting-style text for note-taking, reading, education, and soft CJK brand expression.',
  NotoSans: 'Clean multilingual sans for stable UI labels, app branding, and accessible non-signature wordmarks.',
  NotoSansSC: 'Simplified Chinese sans for Chinese UI, documentation, and readable CJK product names.',
  PatrickHand: 'Informal hand-print style for playful notes, education, lightweight personal projects, and friendly prototypes.',
  Sacramento: 'Thin monoline signature for elegant personal names, compact brand signatures, and refined logo marks.',
}

function parseArgs(argv) {
  const args = {}
  const booleanFlags = new Set(['help', 'list-fonts', 'handwriting-animation'])
  const supportedFlags = new Set([
    'help',
    'list-fonts',
    'config',
    'text',
    'font',
    'font-name',
    'out-dir',
    'id',
    'label',
    'component-name',
    'bundled-font-dir',
    'font-candidate-dir',
    'width',
    'height',
    'font-size',
    'stroke-width',
    'handwriting-animation',
    'animation-duration-ms',
  ])
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`)
    }

    const key = token.slice(2)
    if (!supportedFlags.has(key)) {
      throw new Error(`Unsupported argument: --${key}`)
    }

    const next = argv[index + 1]
    if (!next || next.startsWith('--')) {
      if (!booleanFlags.has(key)) {
        throw new Error(`Missing value for --${key}`)
      }
      args[key] = true
      continue
    }

    args[key] = next
    index += 1
  }
  return args
}

function printHelp() {
  console.log(`Usage:
  node path/to/signature-svg-generator/scripts/generate_signature_svgs.mjs --config <file>
  node path/to/signature-svg-generator/scripts/generate_signature_svgs.mjs \\
    --text <signature-text> --font-name <name> --out-dir <directory>

Required generation intent:
  --text                     Signature text. No default is assumed.
  --font-name / --font       Font name to resolve or explicit .ttf/.otf path.
  --out-dir                  Directory where the signatures/ output folder is written.

Useful options:
  --font <file>              Advanced: use an explicit .ttf/.otf path instead of --font-name.
  --bundled-font-dir <dir>   Bundled recommendation directory. Default: ${DEFAULT_BUNDLED_FONT_DIR}
  --font-candidate-dir <dir> Font candidate Vue directory for --list-fonts. Default: ${DEFAULT_FONT_CANDIDATE_DIR}
  --handwriting-animation true
  --animation-duration-ms <ms>  Default: ${DEFAULT_HANDWRITING_ANIMATION_DURATION_MS}
  --list-fonts               Print available fonts and exit.
`)
}

function requireOpentype() {
  try {
    return requireFromHere('opentype.js')
  }
  catch {
    const runtimeDir = path.join(os.tmpdir(), 'signature-svg-generator-node')
    fs.mkdirSync(runtimeDir, { recursive: true })
    if (!fs.existsSync(path.join(runtimeDir, 'package.json'))) {
      execFileSync('npm', ['init', '-y'], { cwd: runtimeDir, stdio: 'ignore' })
    }
    execFileSync('npm', ['install', 'opentype.js@1.3.4'], { cwd: runtimeDir, stdio: 'ignore' })
    return createRequire(path.join(runtimeDir, 'package.json'))('opentype.js')
  }
}

function toPascalCase(value) {
  return value
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('')
}

function toKebabCase(value) {
  return value
    .replace(/\.(ttf|otf)$/i, '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map(part => part.toLowerCase())
    .join('-')
}

function toBoolean(value) {
  return value === true || value === 'true' || value === '1' || value === 'yes'
}

function escapeXmlText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeXmlAttribute(value) {
  return escapeXmlText(value)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function fontToken(value) {
  return value.toLowerCase().replace(/\[[^\]]+\]/g, '').replace(/[^a-z0-9]+/g, '')
}

function fontDisplayName(filePath) {
  return path.basename(filePath).replace(/\.(ttf|otf)$/i, '')
}

function googleFontSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function googleFontFamily(value) {
  return value
    .replace(/\.(ttf|otf)$/i, '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/-Regular$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function componentFontName(filePath) {
  const name = path.basename(filePath, '.vue').replace(/^.*?Signature/, '')
  if (!name) {
    return null
  }

  return name.replace(/Sc$/, 'SC').replace(/^LxgwWenkai$/, 'LXGWWenKai')
}

function listFonts(fontDir = DEFAULT_FONT_DIR) {
  const resolvedDir = path.resolve(fontDir)
  if (!fs.existsSync(resolvedDir)) {
    return []
  }

  return fs.readdirSync(resolvedDir)
    .filter(file => /\.(ttf|otf)$/i.test(file))
    .map(file => path.join(resolvedDir, file))
    .sort((first, second) => first.localeCompare(second))
}

function findMatchingFonts(fontDir, fontName) {
  const fonts = listFonts(fontDir)
  const requested = fontToken(fontName)
  const matches = fonts.filter(font => fontToken(fontDisplayName(font)).includes(requested))
  const exactMatches = matches.filter(font => fontToken(fontDisplayName(font)) === requested)
  return exactMatches.length > 0 ? exactMatches : matches
}

function listCandidateFonts(candidateDir = DEFAULT_FONT_CANDIDATE_DIR) {
  const resolvedDir = path.resolve(candidateDir)
  if (!fs.existsSync(resolvedDir)) {
    return []
  }

  return fs.readdirSync(resolvedDir)
    .filter(file => file.endsWith('.vue'))
    .map(file => componentFontName(file))
    .filter(Boolean)
    .sort((first, second) => first.localeCompare(second))
}

function formatFontOption(name) {
  const scenarioKey = name.replace(/\[[^\]]+\]/g, '').replace(/-Regular$/, '')
  return `- ${name}: ${FONT_SCENARIOS[scenarioKey] ?? 'General signature candidate. Preview it at the real output size before choosing.'}`
}

function formatAvailableFonts(fontDir = DEFAULT_FONT_DIR, candidateDir = DEFAULT_FONT_CANDIDATE_DIR, bundledFontDir = DEFAULT_BUNDLED_FONT_DIR) {
  const candidates = listCandidateFonts(candidateDir)
  const fonts = listFonts(fontDir)
  const bundledFonts = listFonts(bundledFontDir)
  const sections = []

  if (fonts.length > 0) {
    sections.push(`Available project fonts in ${fontDir}:\n${fonts.map(font => formatFontOption(fontDisplayName(font))).join('\n')}`)
  }

  if (candidates.length > 0) {
    sections.push(`Available signature font candidates from ${candidateDir}:\n${candidates.map(formatFontOption).join('\n')}`)
  }

  if (bundledFonts.length > 0) {
    sections.push(`Bundled recommended fonts:\n${bundledFonts.map(font => formatFontOption(fontDisplayName(font))).join('\n')}`)
  }

  if (sections.length === 0) {
    return `No .ttf/.otf fonts found in ${fontDir} or ${bundledFontDir}.`
  }

  return sections.join('\n\n')
}

function licenseFileForFont(fontPath) {
  const dir = path.dirname(fontPath)
  const token = fontToken(fontDisplayName(fontPath)).replace(/regular$/, '')
  const licenseFiles = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(file => /^(ofl|license|licence|copyright)/i.test(file))
    : []
  return licenseFiles.find(file => token.includes(fontToken(file).replace(/^ofl/, '').replace(/txt$/, '')))
    ?? licenseFiles[0]
    ?? null
}

function commercialStatus(fontPath, source) {
  if (source === 'downloaded') {
    return 'yes, Google Fonts/open-source'
  }

  const licenseFile = licenseFileForFont(fontPath)
  if (!licenseFile) {
    return 'unknown'
  }

  if (/^ofl/i.test(licenseFile)) {
    return `yes, OFL (${licenseFile})`
  }

  return `unknown (${licenseFile})`
}

function copyBundledFontToProject(fontPath, fontDir) {
  const outputDir = path.resolve(fontDir)
  const outputPath = path.join(outputDir, path.basename(fontPath))
  fs.mkdirSync(outputDir, { recursive: true })
  fs.copyFileSync(fontPath, outputPath)

  const licenseFile = licenseFileForFont(fontPath)
  if (licenseFile) {
    const sourceLicensePath = path.join(path.dirname(fontPath), licenseFile)
    const outputLicensePath = path.join(outputDir, licenseFile)
    fs.copyFileSync(sourceLicensePath, outputLicensePath)
  }

  return outputPath
}

function outputPaths(variant) {
  const rootDir = path.resolve(variant.outDir)
  const svgDir = path.join(rootDir, 'signatures/generated')
  const componentDir = path.join(rootDir, 'signatures/components')
  const svg = path.resolve(svgDir, `${variant.id}.svg`)
  const component = path.resolve(componentDir, `${variant.component}.vue`)

  if (path.dirname(svg) !== svgDir) {
    throw new Error(`Variant ${variant.id} resolves outside ${svgDir}`)
  }
  if (path.dirname(component) !== componentDir) {
    throw new Error(`Variant ${variant.id} component resolves outside ${componentDir}`)
  }

  return {
    rootDir,
    fontDir: path.join(rootDir, 'signatures/fonts'),
    svg,
    component,
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'signature-svg-generator',
      Accept: 'application/vnd.github+json',
    },
  })
  if (!response.ok) {
    return null
  }
  return response.json()
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'signature-svg-generator' },
  })
  if (!response.ok) {
    throw new Error(`Download failed: ${url}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, buffer)
}

async function downloadGoogleFont(fontName, fontDir = DEFAULT_FONT_DIR) {
  const family = googleFontFamily(fontName)
  const slug = googleFontSlug(family)
  const licenseDirs = ['ofl', 'apache', 'ufl']

  for (const licenseDir of licenseDirs) {
    const apiUrl = `https://api.github.com/repos/google/fonts/contents/${licenseDir}/${slug}`
    const entries = await fetchJson(apiUrl)
    if (!Array.isArray(entries)) {
      continue
    }

    const fontEntry = entries
      .filter(entry => /\.(ttf|otf)$/i.test(entry.name))
      .sort((first, second) => {
        const firstRegular = /regular/i.test(first.name) ? 0 : 1
        const secondRegular = /regular/i.test(second.name) ? 0 : 1
        const firstItalic = /italic/i.test(first.name) ? 1 : 0
        const secondItalic = /italic/i.test(second.name) ? 1 : 0
        return firstRegular - secondRegular || firstItalic - secondItalic || first.name.localeCompare(second.name)
      })[0]

    if (!fontEntry?.download_url) {
      continue
    }

    const outputDir = path.resolve(fontDir)
    const outputPath = path.join(outputDir, fontEntry.name)
    await downloadFile(fontEntry.download_url, outputPath)

    for (const entry of entries.filter(item => /^(ofl|license|apache|ufl|copyright)/i.test(item.name))) {
      if (entry.download_url) {
        await downloadFile(entry.download_url, path.join(outputDir, entry.name))
      }
    }

    return outputPath
  }

  return null
}

async function resolveFontPath(variant) {
  const paths = outputPaths(variant)
  if (variant.font) {
    const resolvedPath = path.resolve(variant.font)
    const copiedPath = copyBundledFontToProject(resolvedPath, paths.fontDir)
    return {
      path: copiedPath,
      source: 'explicit',
      commercialUse: commercialStatus(copiedPath, 'explicit'),
    }
  }

  const fontName = variant.fontName
  if (!fontName) {
    return null
  }

  const projectCandidates = findMatchingFonts(paths.fontDir, fontName)
  if (projectCandidates.length === 1) {
    return {
      path: projectCandidates[0],
      source: 'project',
      commercialUse: commercialStatus(projectCandidates[0], 'project'),
    }
  }

  if (projectCandidates.length > 1) {
    throw new Error(`Font "${fontName}" is ambiguous in ${paths.fontDir}. Choose one of:\n${projectCandidates.map(font => `- ${fontDisplayName(font)}`).join('\n')}`)
  }

  const bundledCandidates = findMatchingFonts(variant.bundledFontDir, fontName)
  if (bundledCandidates.length === 1) {
    const copiedPath = copyBundledFontToProject(bundledCandidates[0], paths.fontDir)
    return {
      path: copiedPath,
      source: 'bundled',
      commercialUse: commercialStatus(copiedPath, 'bundled'),
    }
  }

  if (bundledCandidates.length > 1) {
    throw new Error(`Font "${fontName}" is ambiguous in bundled fonts. Choose one of:\n${bundledCandidates.map(font => `- ${fontDisplayName(font)}`).join('\n')}`)
  }

  const downloadedPath = await downloadGoogleFont(fontName, paths.fontDir)
  if (downloadedPath) {
    return {
      path: downloadedPath,
      source: 'downloaded',
      commercialUse: commercialStatus(downloadedPath, 'downloaded'),
    }
  }

  throw new Error(`Font "${fontName}" was not found locally or on Google Fonts.\n${formatAvailableFonts(paths.fontDir, variant.fontCandidateDir, variant.bundledFontDir)}`)
}

function normalizePath(font, text, fontSize) {
  const raw = font.getPath(text, 0, 0, fontSize)
  const box = raw.getBoundingBox()
  const padding = 8
  const viewWidth = Math.ceil(box.x2 - box.x1 + padding * 2)
  const viewHeight = Math.ceil(box.y2 - box.y1 + padding * 2)
  const shifted = font.getPath(text, padding - box.x1, padding - box.y1, fontSize)

  return {
    d: shifted.toPathData(2),
    viewBox: `0 0 ${viewWidth} ${viewHeight}`,
  }
}

function parseViewBox(viewBox) {
  const [, , width, height] = viewBox.split(/\s+/).map(Number)
  return { width, height }
}

function normalizeHandwritingPath(input, fallbackStrokeWidth) {
  if (typeof input === 'string') {
    return { d: input, strokeWidth: fallbackStrokeWidth }
  }

  return {
    d: input.d,
    strokeWidth: Number(input.strokeWidth ?? fallbackStrokeWidth),
  }
}

function defaultHandwritingPaths(viewBox) {
  const { width, height } = parseViewBox(viewBox)
  const top = height * 0.28
  const mid = height * 0.52
  const bottom = height * 0.74
  const strokeWidth = Math.max(8, Math.round(height * 0.42))
  const segmentCount = 6
  const segmentWidth = width / segmentCount

  return Array.from({ length: segmentCount }, (_, index) => {
    const startX = Math.max(4, index * segmentWidth + 4)
    const endX = Math.min(width - 4, (index + 1) * segmentWidth + 4)
    const lift = index % 2 === 0 ? top : bottom
    return {
      d: `M${startX.toFixed(1)} ${mid.toFixed(1)} C${(startX + segmentWidth * 0.25).toFixed(1)} ${lift.toFixed(1)} ${(startX + segmentWidth * 0.72).toFixed(1)} ${mid.toFixed(1)} ${endX.toFixed(1)} ${mid.toFixed(1)}`,
      strokeWidth,
    }
  })
}

function getHandwritingPaths(svg, variant) {
  const { height } = parseViewBox(svg.viewBox)
  const fallbackStrokeWidth = Math.max(8, Math.round(height * 0.42))
  const paths = variant.handwritingPaths?.length
    ? variant.handwritingPaths.map(pathInput => normalizeHandwritingPath(pathInput, fallbackStrokeWidth))
    : defaultHandwritingPaths(svg.viewBox)

  for (const [index, pathInput] of paths.entries()) {
    if (!pathInput.d) {
      throw new Error(`Variant ${variant.id} handwritingPaths[${index}] is missing d`)
    }
  }

  return paths
}

function animationSegments(count, totalDurationMs) {
  const duration = Math.max(1, Number(totalDurationMs))
  const overlapRatio = 0.22
  const baseStep = duration / (count - overlapRatio)
  const segmentDuration = Math.round(baseStep)

  return Array.from({ length: count }, (_, index) => {
    const delay = index === count - 1
      ? duration - segmentDuration
      : Math.round(index * baseStep * (1 - overlapRatio))

    return {
      delay: Math.max(0, delay),
      duration: index === count - 1 ? duration - Math.max(0, delay) : segmentDuration,
    }
  })
}

function maskMarkup(className, svg, variant) {
  const paths = getHandwritingPaths(svg, variant)
  const segments = animationSegments(paths.length, variant.animationDurationMs)
  const id = `${className}-mask`

  const pathMarkup = paths.map((pathInput, index) => `        <path
          class="${className}__draw ${className}__draw--${index + 1}"
          d="${escapeXmlAttribute(pathInput.d)}"
          pathLength="1"
          style="--duration: ${segments[index].duration}ms; --delay: ${segments[index].delay}ms; --stroke-width: ${pathInput.strokeWidth};"
        />`).join('\n')

  return {
    id,
    markup: `    <defs>
      <mask id="${id}" maskUnits="userSpaceOnUse">
${pathMarkup}
      </mask>
    </defs>`,
  }
}

function sourceSvg(svg, variant) {
  const title = escapeXmlText(`${variant.text} ${variant.label} signature`)
  const pathData = escapeXmlAttribute(svg.d)

  if (variant.handwritingAnimation) {
    const className = `signature-svg-${variant.id}`
    const mask = maskMarkup(className, svg, variant)
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}">
  <title>${title}</title>
${mask.markup}
  <path d="${pathData}" fill="currentColor" mask="url(#${mask.id})" />
  <style>
    .${className}__draw {
      fill: none;
      stroke: white;
      stroke-width: var(--stroke-width);
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: ${className}-draw var(--duration) cubic-bezier(0.65, 0, 0.35, 1) forwards;
      animation-delay: var(--delay);
    }
    @keyframes ${className}-draw {
      to { stroke-dashoffset: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .${className}__draw {
        animation: none;
        stroke-dashoffset: 0;
      }
    }
  </style>
</svg>
`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}">
  <title>${title}</title>
  <path d="${pathData}" fill="currentColor" />
</svg>
`
}

function vueComponent(svg, variant) {
  const className = `signature-svg-${variant.id}`
  const pathData = escapeXmlAttribute(svg.d)

  if (variant.handwritingAnimation) {
    const mask = maskMarkup(className, svg, variant)
    return `<template>
  <svg class="${className}" viewBox="${svg.viewBox}" aria-hidden="true">
${mask.markup}
    <path class="${className}__shape" d="${pathData}" mask="url(#${mask.id})" />
  </svg>
</template>

<style scoped>
.${className} {
  display: block;
  width: ${variant.width}px;
  height: ${variant.height}px;
  color: currentColor;
  overflow: visible;
}

.${className}__shape {
  fill: currentColor;
}

.${className}__draw {
  fill: none;
  stroke: white;
  stroke-width: var(--stroke-width);
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ${className}-draw var(--duration) cubic-bezier(0.65, 0, 0.35, 1) forwards;
  animation-delay: var(--delay);
}

@keyframes ${className}-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .${className}__draw {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
`
  }

  return `<template>
  <svg class="${className}" viewBox="${svg.viewBox}" aria-hidden="true">
    <path class="${className}__path" d="${pathData}" pathLength="1" />
  </svg>
</template>

<style scoped>
.${className} {
  display: block;
  width: ${variant.width}px;
  height: ${variant.height}px;
  color: currentColor;
  overflow: visible;
}

.${className}__path {
  fill: transparent;
  stroke: currentColor;
  stroke-width: ${variant.strokeWidth};
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  paint-order: stroke fill;
  animation:
    ${className}-draw 820ms cubic-bezier(0.65, 0, 0.35, 1) forwards,
    ${className}-fill 220ms ease 700ms forwards;
}

@keyframes ${className}-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes ${className}-fill {
  to {
    fill: currentColor;
  }
}

@media (prefers-reduced-motion: reduce) {
  .${className}__path {
    fill: currentColor;
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
`
}

function normalizeVariant(input, defaults = {}) {
  const id = input.id ?? toKebabCase(input.fontName ?? input['font-name'] ?? input.font ?? input.component ?? input.text ?? 'signature')

  return {
    text: input.text ?? defaults.text,
    id,
    label: input.label ?? id,
    component: input.component ?? `Signature${toPascalCase(id)}`,
    font: input.font,
    fontName: input.fontName ?? input['font-name'],
    outDir: input.outDir ?? input['out-dir'] ?? defaults.outDir,
    bundledFontDir: input.bundledFontDir ?? defaults.bundledFontDir ?? DEFAULT_BUNDLED_FONT_DIR,
    fontCandidateDir: input.fontCandidateDir ?? defaults.fontCandidateDir ?? DEFAULT_FONT_CANDIDATE_DIR,
    width: Number(input.width ?? 100),
    height: Number(input.height ?? 24),
    fontSize: Number(input.fontSize ?? 48),
    strokeWidth: Number(input.strokeWidth ?? 1.4),
    handwritingAnimation: toBoolean(input.handwritingAnimation ?? input['handwriting-animation']),
    handwritingPaths: input.handwritingPaths,
    animationDurationMs: Number(input.animationDurationMs ?? input['animation-duration-ms'] ?? DEFAULT_HANDWRITING_ANIMATION_DURATION_MS),
  }
}

function loadJobs(args) {
  if (args.config) {
    const configPath = path.resolve(args.config)
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

    return config.variants.map(variantInput => normalizeVariant(variantInput, {
        text: config.text,
        outDir: config.outDir,
        bundledFontDir: config.bundledFontDir,
        fontCandidateDir: config.fontCandidateDir,
      }))
  }

  const variant = normalizeVariant({
    text: args.text,
    id: args.id,
    label: args.label,
    component: args['component-name'],
    font: args.font,
    fontName: args['font-name'],
    outDir: args['out-dir'],
    bundledFontDir: args['bundled-font-dir'],
    fontCandidateDir: args['font-candidate-dir'],
    width: args.width,
    height: args.height,
    fontSize: args['font-size'],
    strokeWidth: args['stroke-width'],
    handwritingAnimation: args['handwriting-animation'],
    animationDurationMs: args['animation-duration-ms'],
  })

  return [variant]
}

function validateVariant(variant) {
  const missing = []
  if (!variant.text) {
    missing.push('signature text (--text or config.text / variant.text)')
  }
  if (!variant.font && !variant.fontName) {
    const fontDir = variant.outDir ? outputPaths(variant).fontDir : 'signatures/fonts under --out-dir'
    missing.push(`font name (--font-name or variant.fontName). ${formatAvailableFonts(fontDir, variant.fontCandidateDir, variant.bundledFontDir)}`)
  }
  if (!variant.outDir) {
    missing.push('output directory (--out-dir or config.outDir)')
  }

  if (missing.length > 0) {
    throw new Error(`Variant ${variant.id || '<unknown>'} is missing required input:\n- ${missing.join('\n- ')}`)
  }

  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(variant.id)) {
    throw new Error(`Variant id "${variant.id}" must contain only letters, numbers, hyphens, or underscores, and must not contain path separators.`)
  }
  if (!/^[A-Z][A-Za-z0-9]*$/.test(variant.component)) {
    throw new Error(`Variant ${variant.id} component "${variant.component}" must be a PascalCase Vue component filename.`)
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    printHelp()
    process.exit(0)
  }

  if (args['list-fonts']) {
    const fontDir = args['out-dir'] ? path.join(path.resolve(args['out-dir']), 'signatures/fonts') : 'signatures/fonts'
    console.log(formatAvailableFonts(fontDir, args['font-candidate-dir'] ?? DEFAULT_FONT_CANDIDATE_DIR, args['bundled-font-dir'] ?? DEFAULT_BUNDLED_FONT_DIR))
    process.exit(0)
  }

  const jobs = loadJobs(args)
  let opentype = null

  for (const variant of jobs) {
    validateVariant(variant)
    const fontResult = await resolveFontPath(variant)
    opentype ??= requireOpentype()
    const font = opentype.loadSync(fontResult.path)
    const svg = normalizePath(font, variant.text, variant.fontSize)
    const paths = outputPaths(variant)

    fs.mkdirSync(path.dirname(paths.svg), { recursive: true })
    fs.writeFileSync(paths.svg, sourceSvg(svg, variant))

    fs.mkdirSync(path.dirname(paths.component), { recursive: true })
    fs.writeFileSync(paths.component, vueComponent(svg, variant))

    console.log(`${variant.component}: ${svg.viewBox} (${fontDisplayName(fontResult.path)}; source: ${fontResult.source}; commercial use: ${fontResult.commercialUse}; path: ${fontResult.path}; svg: ${paths.svg}; component: ${paths.component})`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
