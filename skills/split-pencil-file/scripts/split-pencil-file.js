#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

function printUsage() {
  console.log(`Usage:
  node split-pencil-file.js --input <source.pen> [--output-dir <dir>] [--page <name-or-index>] [--node-ids <id,id>] [--force] [--try-run]

Splits top-level Pencil frame nodes into:
  <output-dir>/<sanitized-frame-name>/index.pen

Options:
  --input <file>       Source .pen file
  --output-dir <dir>   Output root directory; defaults to source file directory
  --page <value>       Page name or zero-based page index when source has a top-level pages array
  --node-ids <value>   Only split top-level frames whose ids are in the comma-separated list
  --force              Overwrite existing frame output directories
  --try-run            Print split plan without writing files
  --help               Show this help
`)
}

function parseArgs(argv) {
  const args = {
    input: '',
    outputDir: '',
    page: '',
    nodeIds: '',
    force: false,
    tryRun: false,
    help: false
  }

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      args.help = true
    } else if (arg === '--force') {
      args.force = true
    } else if (arg === '--try-run') {
      args.tryRun = true
    } else if (arg === '--input') {
      args.input = argv[++index] || ''
    } else if (arg === '--output-dir') {
      args.outputDir = argv[++index] || ''
    } else if (arg === '--page') {
      args.page = argv[++index] || ''
    } else if (arg === '--node-ids') {
      args.nodeIds = argv[++index] || ''
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return args
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function sanitizeName(name) {
  const base = String(name || 'Untitled')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/[\u0000-\u001f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/-+/g, '-')
    .replace(/^[.\s-]+|[.\s-]+$/g, '')

  return base || 'Untitled'
}

function makeUniqueName(base, used) {
  const count = used.get(base) || 0
  used.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit)
    return
  }

  if (value && typeof value === 'object') {
    visit(value)
    for (const item of Object.values(value)) walk(item, visit)
  }
}

function isLocalAssetUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false
  if (/^(https?:)?\/\//i.test(url)) return false
  if (/^data:/i.test(url)) return false
  if (path.isAbsolute(url)) return false
  return true
}

function collectImageUrls(node) {
  const urls = new Set()

  walk(node, (obj) => {
    if (obj.type === 'image' && isLocalAssetUrl(obj.url)) {
      urls.add(obj.url)
    }
  })

  return [...urls]
}

function parseNodeIds(value) {
  if (!value) return []

  const seen = new Set()
  const ids = []

  for (const item of value.split(',')) {
    const id = item.trim()

    if (!id || seen.has(id)) {
      continue
    }

    seen.add(id)
    ids.push(id)
  }

  return ids
}

function selectContainer(doc, pageArg) {
  if (Array.isArray(doc.pages)) {
    if (!pageArg) {
      const pages = doc.pages
        .map((page, index) => `${index}: ${page.name || '(unnamed)'}`)
        .join('\n')
      throw new Error(`Source contains pages. Pass --page with one of:\n${pages}`)
    }

    const pageIndex = /^\d+$/.test(pageArg) ? Number(pageArg) : -1
    const page =
      pageIndex >= 0 ? doc.pages[pageIndex] : doc.pages.find((item) => item.name === pageArg)

    if (!page) {
      throw new Error(`Page not found: ${pageArg}`)
    }

    return {
      label: page.name || String(pageIndex),
      children: page.children || [],
      root: page
    }
  }

  return {
    label: 'root',
    children: doc.children || [],
    root: doc
  }
}

function nodeSummary(node, index) {
  return {
    index,
    type: node && node.type ? node.type : '',
    id: node && node.id ? node.id : '',
    name: node && node.name ? node.name : ''
  }
}

function selectFramesByNodeIds(topLevelNodes, nodeIds) {
  const byId = new Map()

  topLevelNodes.forEach((node, index) => {
    if (node && node.id) {
      byId.set(node.id, { node, index })
    }
  })

  const missing = []
  const selectedFrames = []
  const selectedSkipped = []

  for (const id of nodeIds) {
    const entry = byId.get(id)

    if (!entry) {
      missing.push(id)
      continue
    }

    if (entry.node.type === 'frame') {
      selectedFrames.push(entry.node)
    } else {
      selectedSkipped.push(nodeSummary(entry.node, entry.index))
    }
  }

  if (missing.length) {
    throw new Error(`Selected node id(s) not found as top-level nodes: ${missing.join(', ')}`)
  }

  if (!selectedFrames.length) {
    throw new Error('No top-level frame nodes matched --node-ids')
  }

  return { selectedFrames, selectedSkipped }
}

function createSplitDoc(sourceDoc, node) {
  const splitDoc = {}

  for (const [key, value] of Object.entries(sourceDoc)) {
    if (key === 'children' || key === 'pages') continue
    splitDoc[key] = value
  }

  splitDoc.children = [node]
  return splitDoc
}

function ensureInside(parentDir, targetPath) {
  const relative = path.relative(parentDir, targetPath)
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}

function main() {
  const args = parseArgs(process.argv)

  if (args.help) {
    printUsage()
    return
  }

  if (!args.input) {
    throw new Error('Missing required --input <source.pen>')
  }

  const inputPath = path.resolve(args.input)
  const sourceDir = path.dirname(inputPath)
  const outputDir = path.resolve(args.outputDir || sourceDir)
  const sourceDoc = readJson(inputPath)
  const container = selectContainer(sourceDoc, args.page)
  const selectedNodeIds = parseNodeIds(args.nodeIds)
  const topLevelNodes = container.children
  const candidateFrames = topLevelNodes.filter((node) => node && node.type === 'frame')
  const selection = selectedNodeIds.length
    ? selectFramesByNodeIds(topLevelNodes, selectedNodeIds)
    : { selectedFrames: candidateFrames, selectedSkipped: [] }
  const frames = selection.selectedFrames
  const selectedFrameSet = new Set(frames)
  const filteredOut = selectedNodeIds.length
    ? candidateFrames
        .filter((node) => !selectedFrameSet.has(node))
        .map((node, index) => nodeSummary(node, index))
    : []
  const skipped = topLevelNodes
    .filter((node) => !node || node.type !== 'frame')
    .map((node, index) => nodeSummary(node, index))

  const usedNames = new Map()
  const manifest = []

  for (const node of frames) {
    const originalName = node.name || node.id || 'Untitled'
    const dirName = makeUniqueName(sanitizeName(originalName), usedNames)
    const frameDir = path.join(outputDir, dirName)
    const indexPath = path.join(frameDir, 'index.pen')
    const images = collectImageUrls(node)

    manifest.push({
      id: node.id || '',
      originalName,
      dirName,
      indexPath: path.relative(process.cwd(), indexPath),
      images,
      node
    })
  }

  const summary = {
    source: inputPath,
    page: container.label,
    outputDir,
    selectedNodeIds,
    frameCount: frames.length,
    filteredOutCount: filteredOut.length,
    filteredOut,
    selectedSkipped: selection.selectedSkipped,
    skippedCount: skipped.length,
    skipped,
    items: manifest.map(({ node, ...item }) => item)
  }

  if (args.tryRun) {
    console.log(JSON.stringify(summary, null, 2))
    return
  }

  fs.mkdirSync(outputDir, { recursive: true })

  for (const item of manifest) {
    const frameDir = path.join(outputDir, item.dirName)

    if (fs.existsSync(frameDir)) {
      if (!args.force) {
        throw new Error(
          `Output directory already exists: ${frameDir}. Re-run with --force to overwrite.`
        )
      }
      fs.rmSync(frameDir, { recursive: true, force: true })
    }

    fs.mkdirSync(frameDir, { recursive: true })
    fs.writeFileSync(
      path.join(frameDir, 'index.pen'),
      `${JSON.stringify(createSplitDoc(sourceDoc, item.node), null, 2)}\n`,
      'utf8'
    )

    for (const url of item.images) {
      const sourceAsset = path.resolve(sourceDir, url)
      const targetAsset = path.resolve(frameDir, url)

      if (!ensureInside(frameDir, targetAsset)) {
        throw new Error(`Unsafe image path for ${item.originalName}: ${url}`)
      }

      if (!fs.existsSync(sourceAsset)) {
        throw new Error(`Missing image asset for ${item.originalName}: ${url}`)
      }

      fs.mkdirSync(path.dirname(targetAsset), { recursive: true })
      fs.copyFileSync(sourceAsset, targetAsset)
    }
  }

  const manifestPath = path.join(outputDir, 'frame-split-manifest.json')
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        source: inputPath,
        page: container.label,
        selectedNodeIds,
        frameCount: frames.length,
        filteredOutCount: filteredOut.length,
        filteredOut,
        selectedSkipped: selection.selectedSkipped,
        skipped,
        items: summary.items
      },
      null,
      2
    )}\n`,
    'utf8'
  )

  console.log(
    JSON.stringify(
      {
        outputDir,
        frameCount: frames.length,
        skippedCount: skipped.length,
        manifestPath
      },
      null,
      2
    )
  )
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
