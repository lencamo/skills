const CURVE_SAMPLE_COUNT = 16

function distance(first, second) {
  return Math.hypot(second.x - first.x, second.y - first.y)
}

function cubicPoint(start, firstControl, secondControl, end, time) {
  const inverse = 1 - time
  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * time * firstControl.x +
      3 * inverse * time ** 2 * secondControl.x +
      time ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * time * firstControl.y +
      3 * inverse * time ** 2 * secondControl.y +
      time ** 3 * end.y
  }
}

function quadraticPoint(start, control, end, time) {
  const inverse = 1 - time
  return {
    x: inverse ** 2 * start.x + 2 * inverse * time * control.x + time ** 2 * end.x,
    y: inverse ** 2 * start.y + 2 * inverse * time * control.y + time ** 2 * end.y
  }
}

function sampledCurveLength(start, end, pointAt) {
  let length = 0
  let previous = start

  for (let index = 1; index <= CURVE_SAMPLE_COUNT; index += 1) {
    const next = pointAt(index / CURVE_SAMPLE_COUNT)
    length += distance(previous, next)
    previous = next
  }

  return length + distance(previous, end)
}

function svgPathTokens(pathData) {
  return pathData.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) ?? []
}

function isPathCommand(token) {
  return /^[a-zA-Z]$/.test(token)
}

export function estimateSvgPathLength(pathData) {
  const tokens = svgPathTokens(pathData)
  let index = 0
  let command = null
  let current = { x: 0, y: 0 }
  let subpathStart = { x: 0, y: 0 }
  let length = 0

  const hasNumber = () => index < tokens.length && !isPathCommand(tokens[index])
  const readNumber = () => {
    if (!hasNumber()) {
      return null
    }
    const value = Number(tokens[index])
    index += 1
    return Number.isFinite(value) ? value : null
  }
  const readPoint = (relative = false) => {
    const x = readNumber()
    const y = readNumber()
    if (x === null || y === null) {
      return null
    }
    return relative ? { x: current.x + x, y: current.y + y } : { x, y }
  }

  while (index < tokens.length) {
    if (isPathCommand(tokens[index])) {
      command = tokens[index]
      index += 1
    }

    if (!command) {
      return null
    }

    const lowerCommand = command.toLowerCase()
    const relative = command === lowerCommand

    if (lowerCommand === 'z') {
      length += distance(current, subpathStart)
      current = { ...subpathStart }
      command = null
      continue
    }

    if (lowerCommand === 'm') {
      const point = readPoint(relative)
      if (!point) {
        return null
      }
      current = point
      subpathStart = { ...point }
      command = relative ? 'l' : 'L'
      continue
    }

    if (lowerCommand === 'l') {
      while (hasNumber()) {
        const point = readPoint(relative)
        if (!point) {
          return null
        }
        length += distance(current, point)
        current = point
      }
      continue
    }

    if (lowerCommand === 'h') {
      while (hasNumber()) {
        const x = readNumber()
        if (x === null) {
          return null
        }
        const point = { x: relative ? current.x + x : x, y: current.y }
        length += distance(current, point)
        current = point
      }
      continue
    }

    if (lowerCommand === 'v') {
      while (hasNumber()) {
        const y = readNumber()
        if (y === null) {
          return null
        }
        const point = { x: current.x, y: relative ? current.y + y : y }
        length += distance(current, point)
        current = point
      }
      continue
    }

    if (lowerCommand === 'c') {
      while (hasNumber()) {
        const firstControl = readPoint(relative)
        const secondControl = readPoint(relative)
        const end = readPoint(relative)
        if (!firstControl || !secondControl || !end) {
          return null
        }
        length += sampledCurveLength(current, end, (time) =>
          cubicPoint(current, firstControl, secondControl, end, time)
        )
        current = end
      }
      continue
    }

    if (lowerCommand === 'q') {
      while (hasNumber()) {
        const control = readPoint(relative)
        const end = readPoint(relative)
        if (!control || !end) {
          return null
        }
        length += sampledCurveLength(current, end, (time) =>
          quadraticPoint(current, control, end, time)
        )
        current = end
      }
      continue
    }

    return null
  }

  return length > 0 ? length : null
}

export function formatPathLength(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '1'
  }

  return value
    .toFixed(2)
    .replace(/\.?0+$/, '')
}
