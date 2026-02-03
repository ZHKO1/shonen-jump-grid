import type { CanvasPolyGridConfig, GridStyle, Point, PolyGridPoint, PolyType, Pos } from './types'
import offsetPolygon from 'offset-polygon'
import { deepCopy } from '@/lib/utils'
import { BORDER_WIDTH, CANVAS_WIDTH } from '../constant'
import { isGridLeftAligned, isGridRightAligned } from './align'
import { reorderPolygonClockwise } from './clip'
import { getAutoFlushedGridConfig } from './grid'

/**
 * 获取多边形所在容器的四个点的坐标
 * @param {Point[]} path
 * @param {Pos} pos
 * @returns {Point}
 */
export function getPolyContainerPoint(path: Point[], pos: Pos): Point {
  const point = { x: path[0].x, y: path[0].y }
  path.forEach((p) => {
    switch (pos) {
      case 'lt':
        point.x = Math.min(point.x, p.x)
        point.y = Math.min(point.y, p.y)
        break
      case 'rt':
        point.x = Math.max(point.x, p.x)
        point.y = Math.min(point.y, p.y)
        break
      case 'lb':
        point.x = Math.min(point.x, p.x)
        point.y = Math.max(point.y, p.y)
        break
      case 'rb':
        point.x = Math.max(point.x, p.x)
        point.y = Math.max(point.y, p.y)
        break
    }
  })
  return point
}

/**
 * 判断四边形四个角是否直角
 * @param {[Point, Point, Point, Point]} path
 * @param {'lt' | 'rt' | 'lb' | 'rb'} corner
 * @returns {boolean}
 */
export function isPolyCornerRightAngle(path: Point[], corner: 'lt' | 'rt' | 'lb' | 'rb'): boolean {
  if (getPolyType(path) !== 'other') {
    const [p0, p1, p2, p3] = path
    switch (corner) {
      case 'lt':
        return (p0.x === p3.x) && (p0.y === p1.y)
      case 'rt':
        return (p1.x === p2.x) && (p0.y === p1.y)
      case 'lb':
        return (p0.x === p3.x) && (p2.y === p3.y)
      case 'rb':
        return (p2.y === p3.y) && (p1.x === p2.x)
    }
  }
  else {
    return false
  }
}

/**
 * 判断四边形本身是水平还是垂直的
 * @param {[Point, Point, Point, Point]} path
 * @returns {PolyType}
 */
export function getPolyType(path: Point[]): PolyType {
  if (path.length === 4) {
    const lt = getPolyContainerPoint(path, 'lt')
    const rb = getPolyContainerPoint(path, 'rb')
    const isAdjust = (attr: 'x' | 'y') => {
      return (path.filter(point => point[attr] === lt[attr]).length > 1) && (path.filter(point => point[attr] === rb[attr]).length > 1)
    }
    if (isAdjust('x') && isAdjust('y')) {
      return 'rect'
    }
    if (isAdjust('y')) {
      return 'horizon'
    }
    if (isAdjust('x')) {
      return 'vertical'
    }
  }
  return 'other'
}

/**
 * 精度处理，保留指定小数位
 */
function roundPoint(p: Point, decimals: number = 5): Point {
  const factor = 10 ** decimals
  return {
    x: Math.round(p.x * factor) / factor,
    y: Math.round(p.y * factor) / factor,
  }
}

/**
 * 返回poly的绘制点
 * @param {PolyGridPoint['path']} path
 * @param {number} borderWidth
 * @returns {{ outside: PolyGridPoint['path'], inside: PolyGridPoint['path'] }}
 */
export function getPolyGridPoint(path: PolyGridPoint['path'], borderWidth: number): { outside: PolyGridPoint['path'], inside: PolyGridPoint['path'] } {
  const offset = borderWidth / 2
  const outside = offsetPolygon(path as Point[], offset).map(p => roundPoint(p, 5))
  const inside = offsetPolygon(path as Point[], -offset).map(p => roundPoint(p, 5))
  return { outside, inside }
}

/**
 * 根据isFlush来返回处理过的PolyGrid
 * @param {CanvasPolyGridConfig} grid
 * @returns {CanvasPolyGridConfig}
 */
export function getAutoFlushedPolyGridConfig(grid: CanvasPolyGridConfig) {
  const config = deepCopy(grid)
  const [p0, p1, p2, p3] = config.path
  if (isGridLeftAligned(grid)) {
    config.path = [
      { ...p0, x: -BORDER_WIDTH },
      p1,
      p2,
      { ...p3, x: -BORDER_WIDTH },
    ]
  }
  if (isGridRightAligned(grid)) {
    config.path = [
      p0,
      { ...p1, x: CANVAS_WIDTH + BORDER_WIDTH },
      { ...p2, x: CANVAS_WIDTH + BORDER_WIDTH },
      p3,
    ]
  }
  return config
}
/**
 * 获取 poly grid 样式
 * @param {CanvasPolyGridConfig} grid
 * @returns {GridStyle}
 */
export function getPolyGridStyle(grid: CanvasPolyGridConfig): GridStyle {
  const config = grid?.isFlush ? getAutoFlushedGridConfig(grid) as CanvasPolyGridConfig : deepCopy(grid)
  const path = config.path
  const lt = getPolyContainerPoint(path, 'lt')
  const rb = getPolyContainerPoint(path, 'rb')
  const { outside } = getPolyGridPoint(path, BORDER_WIDTH)
  const lt_outside = getPolyContainerPoint(outside, 'lt')
  const rb_outside = getPolyContainerPoint(outside, 'rb')
  const left = lt_outside.x
  const top = lt_outside.y
  const width = rb_outside.x - lt_outside.x
  const height = rb_outside.y - lt_outside.y
  const sortPath = reorderPolygonClockwise(outside)
  const svgPathWithBorder = sortPath.map(p => ({
    x: p.x - left,
    y: p.y - top,
  }))

  const posStyle = {
    left: lt.x,
    top: lt.y,
  }
  const sizeStyle = {
    width: rb.x - lt.x,
    height: rb.y - lt.y,
  }
  const posStyleWithBorder = {
    left,
    top,
  }
  const sizeStyleWithBorder = {
    width,
    height,
  }

  const svgPath = path
    .map(p => ({ x: p.x - left, y: p.y - top })) as [Point, Point, Point, Point]

  let focusIconPosStyle

  if (isPolyCornerRightAngle(path, 'lt')) {
    focusIconPosStyle = {
      left: 10,
      top: 10,
    }
  }
  else if (isPolyCornerRightAngle(path, 'rt')) {
    focusIconPosStyle = {
      right: 10,
      top: 10,
    }
  }
  else if (isPolyCornerRightAngle(path, 'rb')) {
    focusIconPosStyle = {
      right: 10,
      bottom: 10,
    }
  }
  else if (isPolyCornerRightAngle(path, 'lb')) {
    focusIconPosStyle = {
      left: 10,
      bottom: 10,
    }
  }
  else {
    focusIconPosStyle = undefined
  }

  return {
    posStyle,
    sizeStyle,
    posStyleWithBorder,
    sizeStyleWithBorder,
    svgPath,
    svgPathWithBorder,
    imgStyle: {
      left: posStyle.left - posStyleWithBorder.left,
      top: posStyle.top - posStyleWithBorder.top,
      ...sizeStyle,
    },
    focusIconPosStyle,
  }
}
