import type { Point } from './types'

/**
 * 返回计算x的函数
 * 斜率公式: y = kx + b
 * @param {Point} point1
 * @param {Point} point2
 * @param {number} borderWidth
 * @param {boolean} direct 如果是true，则向右平行调整，否则向左平行调整
 * @returns {(y: number) => number}
 */
function getXFromConentLineFunc(point1: Point, point2: Point, borderWidth: number, direct: boolean = false): (y: number) => number {
  return (y: number) => {
    const one = (direct ? +1 : -1)
    if (point1.x === point2.x) {
      return point1.x + one * borderWidth
    }
    const k = (point1.y - point2.y) / (point1.x - point2.x)
    const b = point1.y - k * point1.x
    const contentB = b - (k > 0 ? one : -1 * one) * Math.sqrt((borderWidth * k) ** 2 + borderWidth ** 2)
    return (y - contentB) / k
  }
}

/**
 * 返回计算y的函数
 * 斜率公式: y = kx + b
 * @param {Point} point1
 * @param {Point} point2
 * @param {number} borderWidth
 * @param {boolean} direct 如果是true，则向上平行调整，否则向下平行调整
 * @returns {(y: number) => number}
 */
function getYFromConentLineFunc(point1: Point, point2: Point, borderWidth: number, direct: boolean = false): (y: number) => number {
  return (x: number) => {
    const one = (direct ? +1 : -1)
    if (point1.y === point2.y) {
      return point1.y + one * borderWidth
    }
    const k = (point1.y - point2.y) / (point1.x - point2.x)
    const b = point1.y - k * point1.x
    const contentB = b + one * Math.sqrt((borderWidth * k) ** 2 + borderWidth ** 2)
    return k * x + contentB
  }
}

/**
 * 根据两个点，微调某个点，保持水平或垂直
 * @param {Point} start
 * @param {Point} end
 * @param {{direction:'start' | 'end'}} options
 * @returns {Point}
 */
export function getAdjustedPoint(start: Point, end: Point, options: { direction: 'start' | 'end' }): Point {
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y

  // 垂直线直接返回
  if (deltaX === 0)
    return options.direction === 'end' ? end : start

  const slope = deltaY / deltaX
  const absSlope = Math.abs(slope)

  // 调整终点（保持起点不变）
  if (options.direction === 'end') {
    if (absSlope < 0.1)
      return { x: end.x, y: start.y } // 接近水平
    if (absSlope > 12)
      return { x: start.x, y: end.y } // 接近垂直
    return end
  }
  // 调整起点（保持终点不变）
  else {
    if (absSlope < 0.1)
      return { x: start.x, y: end.y } // 接近水平
    if (absSlope > 12)
      return { x: end.x, y: start.y } // 接近垂直
    return start
  }
}

export function getSvgPoints(path: Point[]) {
  return path.map(p => `${p.x},${p.y}`).join(' ')
}

export function getClipPath(path: Point[]) {
  return `polygon(${path.map(p => `${p.x}px ${p.y}px`).join(',')})`
}

export { getXFromConentLineFunc, getYFromConentLineFunc }
