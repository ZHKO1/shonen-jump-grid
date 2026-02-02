import type { CanvasPolyGridConfig, GridStyle, Point, PolyGridPoint, PolyType, Pos } from './types'
import { deepCopy } from '@/lib/utils'
import { BORDER_WIDTH, CANVAS_WIDTH } from '../constant'
import { isGridLeftAligned, isGridRightAligned } from './align'
import { getXFromConentLineFunc, getYFromConentLineFunc } from './geometry'
import { getAutoFlushedGridConfig } from './grid'

/**
 * 获取四边形所在容器的四个点的坐标
 * @param {[Point, Point, Point, Point]} path
 * @param {Pos} pos
 * @returns {Point}
 */
export function getPolyContainerPoint(path: [Point, Point, Point, Point], pos: Pos): Point {
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
export function isPolyCornerRightAngle(path: [Point, Point, Point, Point], corner: 'lt' | 'rt' | 'lb' | 'rb'): boolean {
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
  throw new Error('unknown corner')
}

/**
 * 判断四边形本身是水平还是垂直的
 * @param {[Point, Point, Point, Point]} path
 * @returns {PolyType}
 */
export function getPolyType(path: [Point, Point, Point, Point]): PolyType {
  const lt = getPolyContainerPoint(path, 'lt')
  const rb = getPolyContainerPoint(path, 'rb')
  const isAdjust = (attr: 'x' | 'y') => {
    return (path.filter(point => point[attr] === lt[attr]).length > 1) && (path.filter(point => point[attr] === rb[attr]).length > 1)
  }
  if (isAdjust('y')) {
    return 'horizon'
  }
  if (isAdjust('x')) {
    return 'vertical'
  }
  throw new Error('Invalid poly type')
}

/**
 * 返回从左上角开始顺时针排序的四个点
 * @param {[Point, Point, Point, Point]} path
 * @returns {[Point, Point, Point, Point]}
 */
export function getPolyPointBySort(path: [Point, Point, Point, Point]): [Point, Point, Point, Point] {
  let result = []
  if (getPolyType(path) === 'horizon') {
    const lt_y = getPolyContainerPoint(path, 'lt').y
    const rb_y = getPolyContainerPoint(path, 'rb').y
    const topLine = path.filter(point => point.y === lt_y).sort((a, b) => a.x - b.x)
    const bottomLine = path.filter(point => point.y === rb_y).sort((a, b) => b.x - a.x)
    result = [...topLine, ...bottomLine]
  }
  else {
    const lt_x = getPolyContainerPoint(path, 'lt').x
    const rb_x = getPolyContainerPoint(path, 'rb').x
    const leftLine = path.filter(point => point.x === lt_x).sort((a, b) => a.y - b.y)
    const rightLine = path.filter(point => point.x === rb_x).sort((a, b) => a.y - b.y)
    result = [leftLine[0], ...rightLine, leftLine[1]]
  }
  return result as [Point, Point, Point, Point]
}

/**
 * 返回poly的绘制点
 * @param {PolyGridPoint['path']} path
 * @param {number} borderWidth
 * @returns {{ outside: PolyGridPoint['path'], inside: PolyGridPoint['path'] }}
 */
export function getPolyGridPoint(path: PolyGridPoint['path'], borderWidth: number): { outside: PolyGridPoint['path'], inside: PolyGridPoint['path'] } {
  const adjust = Math.floor(borderWidth / 2)
  const lt_x = getPolyContainerPoint(path, 'lt').x
  const lt_y = getPolyContainerPoint(path, 'lt').y
  const rb_x = getPolyContainerPoint(path, 'rb').x
  const rb_y = getPolyContainerPoint(path, 'rb').y
  let point0, point1, point2, point3
  if (getPolyType(path) === 'horizon') {
    return {
      outside: getPointFromHorizonPoly('out'),
      inside: getPointFromHorizonPoly('in'),
    }
  }
  else {
    return {
      outside: getPointFromVerticalPoly('out'),
      inside: getPointFromVerticalPoly('in'),
    }
  }

  function getPointFromHorizonPoly(type: 'out' | 'in'): PolyGridPoint['path'] {
    const one = type === 'out' ? -1 : 1
    const getConentLeftLineX = getXFromConentLineFunc(path[0], path[3], adjust, type !== 'out')
    const getConentRightLineX = getXFromConentLineFunc(path[1], path[2], adjust, type === 'out')

    point0 = { x: getConentLeftLineX(lt_y + one * adjust), y: lt_y + one * adjust }
    point1 = { x: getConentRightLineX(lt_y + one * adjust), y: lt_y + one * adjust }
    point2 = { x: getConentRightLineX(rb_y - one * adjust), y: rb_y - one * adjust }
    point3 = { x: getConentLeftLineX(rb_y - one * adjust), y: rb_y - one * adjust }

    return [point0, point1, point2, point3]
  }

  function getPointFromVerticalPoly(type: 'out' | 'in'): PolyGridPoint['path'] {
    const one = type === 'out' ? -1 : 1
    const getConentTopLineY = getYFromConentLineFunc(path[0], path[1], adjust, type !== 'out')
    const getConentBottomLineY = getYFromConentLineFunc(path[3], path[2], adjust, type === 'out')

    point0 = { y: getConentTopLineY(lt_x + one * adjust), x: lt_x + one * adjust }
    point1 = { y: getConentTopLineY(rb_x - one * adjust), x: rb_x - one * adjust }
    point2 = { y: getConentBottomLineY(rb_x - one * adjust), x: rb_x - one * adjust }
    point3 = { y: getConentBottomLineY(lt_x + one * adjust), x: lt_x + one * adjust }

    return [point0, point1, point2, point3]
  }
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
  const sortPath = getPolyPointBySort(outside)
  const svgPathWithBorder = sortPath.map(p => ({
    x: p.x - left,
    y: p.y - top,
  })) as [Point, Point, Point, Point]
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
