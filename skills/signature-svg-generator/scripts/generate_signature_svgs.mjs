#!/usr/bin/env node
import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { estimateSvgPathLength, formatPathLength } from './lib/svg_path_length.mjs'

const requireFromHere = createRequire(import.meta.url)
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = path.resolve(SCRIPT_DIR, '..')
const DEFAULT_LEGACY_FONT_DIR = 'signatures/fonts'
const DEFAULT_FONT_CANDIDATE_DIR = 'signatures/components'
const DEFAULT_BUNDLED_FONT_DIR = path.join(SKILL_DIR, 'assets/fonts')
const DEFAULT_DOWNLOAD_FONT_DIR = path.join(os.tmpdir(), 'signature-svg-generator-fonts')
const VENDORED_OPENTYPE_PATH = path.join(SCRIPT_DIR, 'opentype.js')
const HANDWRITING_PIXELS_PER_SECOND = 170
const MIN_HANDWRITING_ANIMATION_DURATION_MS = 900
const MAX_HANDWRITING_ANIMATION_DURATION_MS = 4200
const HANDWRITING_OVERLAP_RATIO = 0.18
const HANDWRITING_DASH_LENGTH_PADDING = 1.02
const FONT_SCENARIOS = {
  Ballet:
    'High-contrast elegant calligraphy for art, fashion, luxury, or ceremonial wordmarks. Avoid for compact UI.',
  Caveat:
    'Casual handwritten signature for friendly products, notes, personal tools, and natural handwriting animation.',
  DancingScript:
    'Warm flowing script for creator brands, invitations, lifestyle pages, and expressive medium-size display.',
  Inter:
    'Neutral modern sans for product UI, technical brands, and readability-first wordmarks rather than signatures.',
  LXGWWenKai:
    'Chinese handwriting-style text for note-taking, reading, education, and soft CJK brand expression.',
  NotoSans:
    'Clean multilingual sans for stable UI labels, app branding, and accessible non-signature wordmarks.',
  NotoSansSC:
    'Simplified Chinese sans for Chinese UI, documentation, and readable CJK product names.',
  PatrickHand:
    'Informal hand-print style for playful notes, education, lightweight personal projects, and friendly prototypes.',
  Sacramento:
    'Thin monoline signature for elegant personal names, compact brand signatures, and refined logo marks.'
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
    'handwriting-fallback',
    'animation-duration-ms'
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
    --text <signature-text> --font-name <name>

Required generation intent:
  --text                     Signature text. No default is assumed.
  --font-name / --font       Font name to resolve or explicit .ttf/.otf path.

Useful options:
  --font <file>              Advanced: use an explicit .ttf/.otf path instead of --font-name.
  --bundled-font-dir <dir>   Bundled recommendation directory. Default: ${DEFAULT_BUNDLED_FONT_DIR}
  --font-candidate-dir <dir> Legacy Vue candidate directory for --list-fonts. Default: ${DEFAULT_FONT_CANDIDATE_DIR}
  --handwriting-animation true  Legacy flag. Static and animated artifacts are always emitted.
  --handwriting-fallback wipe  Legacy flag. Missing strokes use fallback-wipe animation.
  --animation-duration-ms <ms>  Optional. Defaults to automatic path-length timing.
  --list-fonts               Print available fonts and exit.
`)
}

function requireOpentype() {
  if (fs.existsSync(VENDORED_OPENTYPE_PATH)) {
    return requireFromHere(VENDORED_OPENTYPE_PATH)
  }

  try {
    return requireFromHere('opentype.js')
  } catch {
    throw new Error(`Missing opentype.js. Expected bundled dependency at ${VENDORED_OPENTYPE_PATH}`)
  }
}

function toPascalCase(value) {
  return value
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('')
}

function toKebabCase(value) {
  return value
    .replace(/\.(ttf|otf)$/i, '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => part.toLowerCase())
    .join('-')
}

function hashString(value) {
  let hash = 5381
  for (const character of String(value)) {
    hash = (hash * 33) ^ character.codePointAt(0)
  }
  return (hash >>> 0).toString(36)
}

function outputFolderName(value) {
  const name = String(value)
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\\/]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return name || `signature-${hashString(value)}`
}

function toBoolean(value) {
  return value === true || value === 'true' || value === '1' || value === 'yes'
}

function optionalNumber(value) {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  const number = Number(value)
  if (!Number.isFinite(number)) {
    throw new Error(`Expected a finite number, received: ${value}`)
  }
  return number
}

function escapeXmlText(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeXmlAttribute(value) {
  return escapeXmlText(value).replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function fontToken(value) {
  return value
    .toLowerCase()
    .replace(/\[[^\]]+\]/g, '')
    .replace(/[^a-z0-9]+/g, '')
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
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function componentFontName(filePath) {
  const name = path.basename(filePath, '.vue').replace(/^.*?Signature/, '')
  if (!name) {
    return null
  }

  return name.replace(/Sc$/, 'SC').replace(/^LxgwWenkai$/, 'LXGWWenKai')
}

function listFonts(fontDir) {
  const resolvedDir = path.resolve(fontDir)
  if (!fs.existsSync(resolvedDir)) {
    return []
  }

  return fs
    .readdirSync(resolvedDir)
    .filter((file) => /\.(ttf|otf)$/i.test(file))
    .map((file) => path.join(resolvedDir, file))
    .sort((first, second) => first.localeCompare(second))
}

function findMatchingFonts(fontDir, fontName) {
  const fonts = listFonts(fontDir)
  const requested = fontToken(fontName)
  const matches = fonts.filter((font) => fontToken(fontDisplayName(font)).includes(requested))
  const exactMatches = matches.filter((font) => fontToken(fontDisplayName(font)) === requested)
  return exactMatches.length > 0 ? exactMatches : matches
}

function listCandidateFonts(candidateDir = DEFAULT_FONT_CANDIDATE_DIR) {
  const resolvedDir = path.resolve(candidateDir)
  if (!fs.existsSync(resolvedDir)) {
    return []
  }

  return fs
    .readdirSync(resolvedDir)
    .filter((file) => file.endsWith('.vue'))
    .map((file) => componentFontName(file))
    .filter(Boolean)
    .sort((first, second) => first.localeCompare(second))
}

function formatFontOption(name) {
  const scenarioKey = name.replace(/\[[^\]]+\]/g, '').replace(/-Regular$/, '')
  return `- ${name}: ${FONT_SCENARIOS[scenarioKey] ?? 'General signature candidate. Preview it at the real output size before choosing.'}`
}

function formatAvailableFonts(
  fontDir = DEFAULT_LEGACY_FONT_DIR,
  candidateDir = DEFAULT_FONT_CANDIDATE_DIR,
  bundledFontDir = DEFAULT_BUNDLED_FONT_DIR
) {
  const candidates = listCandidateFonts(candidateDir)
  const fonts = listFonts(fontDir)
  const bundledFonts = listFonts(bundledFontDir)
  const sections = []

  if (fonts.length > 0) {
    sections.push(
      `Available project fonts in ${fontDir}:\n${fonts.map((font) => formatFontOption(fontDisplayName(font))).join('\n')}`
    )
  }

  if (candidates.length > 0) {
    sections.push(
      `Available signature font candidates from ${candidateDir}:\n${candidates.map(formatFontOption).join('\n')}`
    )
  }

  if (bundledFonts.length > 0) {
    sections.push(
      `Bundled recommended fonts:\n${bundledFonts.map((font) => formatFontOption(fontDisplayName(font))).join('\n')}`
    )
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
    ? fs.readdirSync(dir).filter((file) => /^(ofl|license|licence|copyright)/i.test(file))
    : []
  return (
    licenseFiles.find((file) =>
      token.includes(fontToken(file).replace(/^ofl/, '').replace(/txt$/, ''))
    ) ??
    licenseFiles[0] ??
    null
  )
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

function outputPaths(variant) {
  const rootDir = path.resolve(variant.projectRoot)
  const outputDir = path.resolve(rootDir, 'signatures', outputFolderName(variant.text))
  const staticSvg = path.resolve(outputDir, `${variant.id}.svg`)
  const animatedSvg = path.resolve(outputDir, `${variant.id}.animated.svg`)
  const staticComponent = path.resolve(outputDir, `${variant.component}.vue`)
  const animatedComponent = path.resolve(outputDir, `${variant.component}Animated.vue`)
  const authoringGuideComponent = path.resolve(outputDir, `${variant.component}StrokeGuide.vue`)
  const authoringGuide = path.resolve(outputDir, `${variant.id}.stroke-guide.svg`)
  const authoringTemplate = path.resolve(outputDir, `${variant.id}.strokes.template.json`)

  for (const outputPath of [
    staticSvg,
    animatedSvg,
    staticComponent,
    animatedComponent,
    authoringGuideComponent,
    authoringGuide,
    authoringTemplate
  ]) {
    if (path.dirname(outputPath) !== outputDir) {
      throw new Error(`Variant ${variant.id} resolves outside ${outputDir}`)
    }
  }

  return {
    rootDir,
    outputDir,
    legacyFontDir: path.join(rootDir, 'signatures/fonts'),
    staticSvg,
    animatedSvg,
    staticComponent,
    animatedComponent,
    authoringGuideComponent,
    authoringGuide,
    authoringTemplate
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'signature-svg-generator',
      Accept: 'application/vnd.github+json'
    }
  })
  if (!response.ok) {
    return null
  }
  return response.json()
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'signature-svg-generator' }
  })
  if (!response.ok) {
    throw new Error(`Download failed: ${url}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, buffer)
}

async function downloadGoogleFont(fontName, fontDir = DEFAULT_DOWNLOAD_FONT_DIR) {
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
      .filter((entry) => /\.(ttf|otf)$/i.test(entry.name))
      .sort((first, second) => {
        const firstRegular = /regular/i.test(first.name) ? 0 : 1
        const secondRegular = /regular/i.test(second.name) ? 0 : 1
        const firstItalic = /italic/i.test(first.name) ? 1 : 0
        const secondItalic = /italic/i.test(second.name) ? 1 : 0
        return (
          firstRegular - secondRegular ||
          firstItalic - secondItalic ||
          first.name.localeCompare(second.name)
        )
      })[0]

    if (!fontEntry?.download_url) {
      continue
    }

    const outputDir = path.resolve(fontDir)
    const outputPath = path.join(outputDir, fontEntry.name)
    await downloadFile(fontEntry.download_url, outputPath)

    for (const entry of entries.filter((item) =>
      /^(ofl|license|apache|ufl|copyright)/i.test(item.name)
    )) {
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
    return {
      path: resolvedPath,
      source: 'explicit',
      commercialUse: commercialStatus(resolvedPath, 'explicit')
    }
  }

  const fontName = variant.fontName
  if (!fontName) {
    return null
  }

  const projectCandidates = findMatchingFonts(paths.legacyFontDir, fontName)
  if (projectCandidates.length === 1) {
    return {
      path: projectCandidates[0],
      source: 'project',
      commercialUse: commercialStatus(projectCandidates[0], 'project')
    }
  }

  if (projectCandidates.length > 1) {
    throw new Error(
      `Font "${fontName}" is ambiguous in ${paths.legacyFontDir}. Choose one of:\n${projectCandidates.map((font) => `- ${fontDisplayName(font)}`).join('\n')}`
    )
  }

  const bundledCandidates = findMatchingFonts(variant.bundledFontDir, fontName)
  if (bundledCandidates.length === 1) {
    return {
      path: bundledCandidates[0],
      source: 'bundled',
      commercialUse: commercialStatus(bundledCandidates[0], 'bundled')
    }
  }

  if (bundledCandidates.length > 1) {
    throw new Error(
      `Font "${fontName}" is ambiguous in bundled fonts. Choose one of:\n${bundledCandidates.map((font) => `- ${fontDisplayName(font)}`).join('\n')}`
    )
  }

  const downloadedPath = await downloadGoogleFont(fontName)
  if (downloadedPath) {
    return {
      path: downloadedPath,
      source: 'downloaded',
      commercialUse: commercialStatus(downloadedPath, 'downloaded')
    }
  }

  throw new Error(
    `Font "${fontName}" was not found locally or on Google Fonts.\n${formatAvailableFonts(paths.legacyFontDir, variant.fontCandidateDir, variant.bundledFontDir)}`
  )
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
    viewBox: `0 0 ${viewWidth} ${viewHeight}`
  }
}

function parseViewBox(viewBox) {
  const [, , width, height] = viewBox.split(/\s+/).map(Number)
  return { width, height }
}

function normalizeHandwritingStroke(input, fallbackStrokeWidth) {
  if (typeof input === 'string') {
    return { d: input, strokeWidth: fallbackStrokeWidth }
  }

  return {
    d: input.d,
    strokeWidth: Number(input.strokeWidth ?? fallbackStrokeWidth),
    durationMs: optionalNumber(input.durationMs ?? input.duration ?? input['duration-ms']),
    delayMs: optionalNumber(input.delayMs ?? input.delay ?? input['delay-ms'])
  }
}

function hasHandwritingStrokes(variant) {
  return Array.isArray(variant.handwritingStrokes) && variant.handwritingStrokes.length > 0
}

function animatedRenderMode(variant) {
  return hasHandwritingStrokes(variant) ? 'stroke-timeline' : 'fallback-wipe'
}

function getHandwritingStrokes(svg, variant) {
  const { height } = parseViewBox(svg.viewBox)
  const fallbackStrokeWidth = Math.max(8, Math.round(height * 0.42))
  const strokes = variant.handwritingStrokes.map((strokeInput) =>
    normalizeHandwritingStroke(strokeInput, fallbackStrokeWidth)
  )

  for (const [index, stroke] of strokes.entries()) {
    if (!stroke.d) {
      throw new Error(`Variant ${variant.id} handwritingStrokes[${index}] is missing d`)
    }
  }

  return strokes
}

function secondsValue(milliseconds) {
  return `${(milliseconds / 1000).toFixed(3)}s`
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function textComplexityWeight(text) {
  return Array.from(String(text)).reduce((total, character) => {
    if (/\p{Script=Han}/u.test(character)) {
      return total + 1.8
    }
    if (/[a-z]/i.test(character)) {
      return total + 1
    }
    if (/\d/.test(character)) {
      return total + 0.8
    }
    if (/\s|[.,;:'"!?()[\]{}_-]/.test(character)) {
      return total + 0.35
    }
    return total + 1.2
  }, 0)
}

function fallbackHandwritingDurationMs(svg, variant, pathCount) {
  const { width } = parseViewBox(svg.viewBox)
  const duration = 700 + textComplexityWeight(variant.text) * 90 + width * 1.1 + pathCount * 35
  return Math.round(
    clamp(duration, MIN_HANDWRITING_ANIMATION_DURATION_MS, MAX_HANDWRITING_ANIMATION_DURATION_MS)
  )
}

function resolveHandwritingDurationMs(svg, variant, totalPathLength, pathCount) {
  if (variant.animationDurationMs !== undefined) {
    return Math.max(1, Math.round(Number(variant.animationDurationMs)))
  }

  if (totalPathLength > 0) {
    return Math.round(
      clamp(
        (totalPathLength / HANDWRITING_PIXELS_PER_SECOND) * 1000,
        MIN_HANDWRITING_ANIMATION_DURATION_MS,
        MAX_HANDWRITING_ANIMATION_DURATION_MS
      )
    )
  }

  return fallbackHandwritingDurationMs(svg, variant, pathCount)
}

function animationSegmentsByLength(pathLengths, totalDurationMs) {
  const duration = Math.max(1, Number(totalDurationMs))
  const fallbackLength = 1
  const lengths = pathLengths.map((length) => (length && length > 0 ? length : fallbackLength))
  const timingLength = lengths.reduce((sum, length, index) => {
    return sum + length * (index === lengths.length - 1 ? 1 : 1 - HANDWRITING_OVERLAP_RATIO)
  }, 0)
  const durationPerLength = duration / timingLength
  let delay = 0

  return lengths.map((length) => {
    const segmentDuration = Math.max(1, Math.round(durationPerLength * length))
    const segment = {
      delay: Math.round(delay),
      duration: segmentDuration
    }
    delay += segmentDuration * (1 - HANDWRITING_OVERLAP_RATIO)
    return segment
  })
}

function resolveHandwritingTiming(svg, variant, paths) {
  const pathLengths = paths.map((pathInput) => estimateSvgPathLength(pathInput.d))
  const knownPathLengths = pathLengths.filter((length) => length !== null)
  const totalPathLength = knownPathLengths.reduce((sum, length) => sum + length, 0)
  const duration = resolveHandwritingDurationMs(svg, variant, totalPathLength, paths.length)
  const automaticSegments = animationSegmentsByLength(pathLengths, duration)

  return automaticSegments.map((segment, index) => ({
    delay: paths[index].delayMs ?? segment.delay,
    duration: paths[index].durationMs ?? segment.duration,
    pathLength: pathLengths[index] && pathLengths[index] > 0 ? pathLengths[index] : 1
  }))
}

function pathMaskMarkup(className, svg, variant) {
  const strokes = getHandwritingStrokes(svg, variant)
  const segments = resolveHandwritingTiming(svg, variant, strokes)
  const totalDuration = Math.max(...segments.map((segment) => segment.delay + segment.duration))
  const id = `${className}-mask`

  const pathMarkup = strokes
    .map((stroke, index) => {
      const pathLength = formatPathLength(
        segments[index].pathLength * HANDWRITING_DASH_LENGTH_PADDING
      )
      return `        <path
          class="${className}__draw ${className}__draw--${index + 1}"
          d="${escapeXmlAttribute(stroke.d)}"
          fill="none"
          stroke="white"
          stroke-width="${stroke.strokeWidth}"
          stroke-linejoin="round"
          stroke-linecap="butt"
          stroke-dasharray="${pathLength} ${pathLength}"
          stroke-dashoffset="${pathLength}"
          style="stroke-dasharray: ${pathLength} ${pathLength}; stroke-dashoffset: ${pathLength}; --duration: ${segments[index].duration}ms; --delay: ${segments[index].delay}ms; --stroke-width: ${stroke.strokeWidth}; --path-length: ${pathLength};"
        />`
    })
    .join('\n')

  return {
    id,
    mode: 'path',
    totalDuration,
    markup: `    <defs>
      <mask id="${id}" maskUnits="userSpaceOnUse">
${pathMarkup}
      </mask>
    </defs>`
  }
}

function wipeMaskMarkup(className, svg, variant) {
  const { width } = parseViewBox(svg.viewBox)
  const totalDuration = resolveHandwritingDurationMs(svg, variant, width, 1)
  const id = `${className}-mask`

  return {
    id,
    mode: 'wipe',
    totalDuration,
    markup: `    <defs>
      <mask id="${id}" maskUnits="userSpaceOnUse">
        <rect
          class="${className}__wipe"
          x="0"
          y="0"
          width="0"
          height="100%"
          fill="white"
        >
          <animate
            attributeName="width"
            from="0"
            to="${width}"
            dur="${secondsValue(totalDuration)}"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.65 0 0.35 1"
          />
        </rect>
      </mask>
    </defs>`
  }
}

function maskMarkup(className, svg, variant) {
  if (hasHandwritingStrokes(variant)) {
    return pathMaskMarkup(className, svg, variant)
  }

  return wipeMaskMarkup(className, svg, variant)
}

function pathMaskStyles(className) {
  return `    .${className}__draw {
      fill: none;
      stroke: white;
      stroke-width: var(--stroke-width);
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-dasharray: var(--path-length) var(--path-length);
      stroke-dashoffset: var(--path-length);
      animation: ${className}-draw var(--duration) cubic-bezier(0.65, 0, 0.35, 1) both;
      animation-delay: var(--delay);
    }
    @keyframes ${className}-draw {
      from { stroke-dashoffset: var(--path-length); }
      to { stroke-dashoffset: 0; }
    }`
}

function pathMaskReducedMotionStyles(className) {
  return `      .${className}__draw {
        animation: none;
        stroke-dasharray: var(--path-length) var(--path-length);
        stroke-dashoffset: 0;
      }`
}

function staticSourceSvg(svg, variant) {
  const title = escapeXmlText(`${variant.text} ${variant.label} signature`)
  const pathData = escapeXmlAttribute(svg.d)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}">
  <title>${title}</title>
  <path d="${pathData}" fill="currentColor" />
</svg>
`
}

function animatedSourceSvg(svg, variant) {
  const title = escapeXmlText(`${variant.text} ${variant.label} signature`)
  const pathData = escapeXmlAttribute(svg.d)
  const renderMode = animatedRenderMode(variant)
  const className = `signature-svg-${variant.id}`
  const mask = maskMarkup(className, svg, variant)
  const finalRevealBegin = secondsValue(mask.totalDuration)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}" data-handwriting-mode="${renderMode}">
  <title>${title}</title>
${mask.markup}
  <path class="${className}__shape ${className}__shape--reveal" d="${pathData}" fill="currentColor" mask="url(#${mask.id})" />
  <path class="${className}__shape ${className}__shape--final" d="${pathData}" fill="currentColor" opacity="0">
    <set attributeName="opacity" to="1" begin="${finalRevealBegin}" fill="freeze" />
  </path>
  <style>
    .${className}__shape {
      fill: currentColor;
    }
${mask.mode === 'path' ? pathMaskStyles(className) : ''}
    @media (prefers-reduced-motion: reduce) {
${mask.mode === 'path' ? pathMaskReducedMotionStyles(className) : ''}
      .${className}__shape--reveal {
        display: none;
      }
      .${className}__shape--final {
        opacity: 1;
      }
    }
  </style>
</svg>
`
}

function staticVueComponent(svg, variant) {
  const className = `signature-svg-${variant.id}`
  const pathData = escapeXmlAttribute(svg.d)
  return `<template>
  <svg class="${className}" viewBox="${svg.viewBox}" aria-hidden="true">
    <path class="${className}__shape" d="${pathData}" fill="currentColor" />
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
</style>
`
}

function animatedVueComponent(svg, variant) {
  const className = `signature-svg-${variant.id}`
  const pathData = escapeXmlAttribute(svg.d)
  const renderMode = animatedRenderMode(variant)
  const mask = maskMarkup(className, svg, variant)
  const finalRevealBegin = secondsValue(mask.totalDuration)

  return `<template>
  <svg class="${className}" viewBox="${svg.viewBox}" data-handwriting-mode="${renderMode}" aria-hidden="true">
${mask.markup}
    <path class="${className}__shape ${className}__shape--reveal" d="${pathData}" fill="currentColor" mask="url(#${mask.id})" />
    <path class="${className}__shape ${className}__shape--final" d="${pathData}" fill="currentColor" opacity="0">
      <set attributeName="opacity" to="1" begin="${finalRevealBegin}" fill="freeze" />
    </path>
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

${mask.mode === 'path' ? pathMaskStyles(className) : ''}

@media (prefers-reduced-motion: reduce) {
${mask.mode === 'path' ? pathMaskReducedMotionStyles(className) : ''}

  .${className}__shape--reveal {
    display: none;
  }

  .${className}__shape--final {
    opacity: 1;
  }
}
</style>
`
}

function authoringGuideSvg(svg, variant) {
  const title = escapeXmlText(`${variant.text} handwriting stroke guide`)
  const pathData = escapeXmlAttribute(svg.d)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}">
  <title>${title}</title>
  <path class="signature-authoring__fill" d="${pathData}" />
  <path class="signature-authoring__outline" d="${pathData}" />
  <style>
    .signature-authoring__fill {
      fill: currentColor;
      opacity: 0.12;
    }
    .signature-authoring__outline {
      fill: none;
      stroke: currentColor;
      stroke-width: 0.8;
      stroke-linejoin: round;
      stroke-linecap: round;
      opacity: 0.7;
    }
  </style>
</svg>
`
}

function authoringGuideVueComponent(svg, variant) {
  const className = `signature-guide-${variant.id}`
  const pathData = escapeXmlAttribute(svg.d)

  return `<template>
  <svg class="${className}" viewBox="${svg.viewBox}" aria-hidden="true">
    <path class="signature-authoring__fill" d="${pathData}" />
    <path class="signature-authoring__outline" d="${pathData}" />
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

.signature-authoring__fill {
  fill: currentColor;
  opacity: 0.12;
}

.signature-authoring__outline {
  fill: none;
  stroke: currentColor;
  stroke-width: 0.8;
  stroke-linejoin: round;
  stroke-linecap: round;
  opacity: 0.7;
}
</style>
`
}

function authoringTemplateJson(variant) {
  return `${JSON.stringify(
    {
      id: variant.id,
      component: variant.component,
      text: variant.text,
      fontName: variant.fontName,
      font: variant.font,
      handwritingAnimation: true,
      handwritingStrokes: [
        {
          d: 'M0 0 C10 0 20 10 30 10',
          strokeWidth: 10,
          durationMs: 180,
          delayMs: 0
        }
      ]
    },
    null,
    2
  )}\n`
}

function normalizeVariant(input, defaults = {}) {
  const id =
    input.id ??
    toKebabCase(
      input.fontName ??
        input['font-name'] ??
        input.font ??
        input.component ??
        input.text ??
        'signature'
    )

  return {
    text: input.text ?? defaults.text,
    id,
    label: input.label ?? id,
    component: input.component ?? `Signature${toPascalCase(id)}`,
    font: input.font,
    fontName: input.fontName ?? input['font-name'],
    projectRoot: process.cwd(),
    bundledFontDir: input.bundledFontDir ?? defaults.bundledFontDir ?? DEFAULT_BUNDLED_FONT_DIR,
    fontCandidateDir:
      input.fontCandidateDir ?? defaults.fontCandidateDir ?? DEFAULT_FONT_CANDIDATE_DIR,
    width: Number(input.width ?? 100),
    height: Number(input.height ?? 24),
    fontSize: Number(input.fontSize ?? 48),
    strokeWidth: Number(input.strokeWidth ?? 1.4),
    handwritingAnimation: toBoolean(input.handwritingAnimation ?? input['handwriting-animation']),
    handwritingStrokes: input.handwritingStrokes ?? input.handwritingPaths,
    handwritingFallback: String(
      input.handwritingFallback ??
        input['handwriting-fallback'] ??
        defaults.handwritingFallback ??
        'wipe'
    ).toLowerCase(),
    animationDurationMs: optionalNumber(input.animationDurationMs ?? input['animation-duration-ms'])
  }
}

function loadJobs(args) {
  if (args.config) {
    const configPath = path.resolve(args.config)
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

    return config.variants.map((variantInput) =>
      normalizeVariant(variantInput, {
        text: config.text,
        bundledFontDir: config.bundledFontDir,
        fontCandidateDir: config.fontCandidateDir,
        handwritingFallback: config.handwritingFallback
      })
    )
  }

  const variant = normalizeVariant({
    text: args.text,
    id: args.id,
    label: args.label,
    component: args['component-name'],
    font: args.font,
    fontName: args['font-name'],
    bundledFontDir: args['bundled-font-dir'],
    fontCandidateDir: args['font-candidate-dir'],
    width: args.width,
    height: args.height,
    fontSize: args['font-size'],
    strokeWidth: args['stroke-width'],
    handwritingAnimation: args['handwriting-animation'],
    handwritingFallback: args['handwriting-fallback'],
    animationDurationMs: args['animation-duration-ms']
  })

  return [variant]
}

function validateVariant(variant) {
  const missing = []
  if (!variant.text) {
    missing.push('signature text (--text or config.text / variant.text)')
  }
  if (!variant.font && !variant.fontName) {
    missing.push(
      `font name (--font-name or variant.fontName). ${formatAvailableFonts(outputPaths(variant).legacyFontDir, variant.fontCandidateDir, variant.bundledFontDir)}`
    )
  }

  if (missing.length > 0) {
    throw new Error(
      `Variant ${variant.id || '<unknown>'} is missing required input:\n- ${missing.join('\n- ')}`
    )
  }

  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(variant.id)) {
    throw new Error(
      `Variant id "${variant.id}" must contain only letters, numbers, hyphens, or underscores, and must not contain path separators.`
    )
  }
  if (!/^[A-Z][A-Za-z0-9]*$/.test(variant.component)) {
    throw new Error(
      `Variant ${variant.id} component "${variant.component}" must be a PascalCase Vue component filename.`
    )
  }
  if (!['none', 'wipe'].includes(variant.handwritingFallback)) {
    throw new Error(`Variant ${variant.id} handwritingFallback must be "none" or "wipe".`)
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    printHelp()
    process.exit(0)
  }

  if (args['list-fonts']) {
    const fontDir = path.join(process.cwd(), 'signatures/fonts')
    console.log(
      formatAvailableFonts(
        fontDir,
        args['font-candidate-dir'] ?? DEFAULT_FONT_CANDIDATE_DIR,
        args['bundled-font-dir'] ?? DEFAULT_BUNDLED_FONT_DIR
      )
    )
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

    fs.mkdirSync(paths.outputDir, { recursive: true })
    fs.writeFileSync(paths.staticSvg, staticSourceSvg(svg, variant))
    fs.writeFileSync(paths.animatedSvg, animatedSourceSvg(svg, variant))
    fs.writeFileSync(paths.staticComponent, staticVueComponent(svg, variant))
    fs.writeFileSync(paths.animatedComponent, animatedVueComponent(svg, variant))
    fs.writeFileSync(paths.authoringGuide, authoringGuideSvg(svg, variant))
    fs.writeFileSync(paths.authoringGuideComponent, authoringGuideVueComponent(svg, variant))

    const messages = [
      `${variant.component}: ${svg.viewBox} (${fontDisplayName(fontResult.path)}; source: ${fontResult.source}; commercial use: ${fontResult.commercialUse}; path: ${fontResult.path}; output: ${paths.outputDir}; svg: ${paths.staticSvg}; animated svg: ${paths.animatedSvg}; component: ${paths.staticComponent}; animated component: ${paths.animatedComponent}; stroke guide: ${paths.authoringGuide}; stroke guide component: ${paths.authoringGuideComponent})`
    ]

    const renderMode = animatedRenderMode(variant)

    if (!hasHandwritingStrokes(variant)) {
      fs.writeFileSync(paths.authoringTemplate, authoringTemplateJson(variant))
      messages.push(
        `  handwriting: fallback-wipe preview; add handwritingStrokes for signature replay; guide: ${paths.authoringGuide}; template: ${paths.authoringTemplate}`
      )
    } else {
      messages.push(`  handwriting: stroke-timeline (${variant.handwritingStrokes.length} strokes)`)
    }

    console.log(messages.join('\n'))
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
