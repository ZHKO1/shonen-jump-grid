import type { CanvasComicConfig, CanvasGridConfig, CanvasPolyGridConfig, CanvasRectGridConfig, GridId, GridStyle, Point, SplitOptions } from './types'
import { deepCopy } from '@/lib/utils'
import { isGridFlushable } from './align'
import { splitPolygonByLine, sutherlandHodgmanClip } from './clip'
import { getXFromConentLineFunc, getYFromConentLineFunc } from './geometry'
import { getAutoFlushedPolyGridConfig, getPolyGridStyle } from './poly'
import { getAutoFlushedRectGridConfig, getRectGridStyle } from './rect'

/**
 * 如果grid是正长方形，那么修改type为Rect，否则原样返回
 * @param {CanvasGridConfig} grid
 * @returns {CanvasGridConfig}
 */
export function makePolyToRect(grid: CanvasGridConfig): CanvasGridConfig {
  if (grid.type === 'poly') {
    const [p0, p1, p2, p3] = grid.path
    if ((p0 && p1 && p2 && p3) && (p0.y === p1.y) && (p1.x === p2.x) && (p2.y === p3.y) && (p3.x === p0.x)) {
      const newGrid = {
        ...grid,
      } as Record<string, any>
      delete newGrid.path
      newGrid.type = 'rect'
      newGrid.lt_x = p0.x
      newGrid.lt_y = p0.y
      newGrid.rb_x = p2.x
      newGrid.rb_y = p2.y
      return newGrid as CanvasRectGridConfig
    }
  }
  return grid
}

/**
 * 更新了子Grid后，根据recursion配置选择是否递归处理旧子Grid的分割线
 * @param {CanvasGridConfig} grid
 * @param {[CanvasGridConfig, CanvasGridConfig]} newSubGrids
 * @param {boolean} recursion
 * @returns {[CanvasGridConfig, CanvasGridConfig]}
 */
export function updateSubGridsBySplit(grid: CanvasGridConfig, newSubGrids: [CanvasGridConfig, CanvasGridConfig], recursion: boolean): [CanvasGridConfig, CanvasGridConfig] {
  newSubGrids = [makePolyToRect(newSubGrids[0]), makePolyToRect(newSubGrids[1])]
  if (!recursion) {
    return newSubGrids
  }
  if (isGridSplited(grid)) {
    return newSubGrids.map((subGrid, index) => {
      const oldSubGrid = grid.splitResult![index]
      if (isGridSplited(oldSubGrid)) {
        const newSubGrid = {
          ...oldSubGrid,
          ...subGrid,
        }
        const { grids, line } = getGridsBySplit(newSubGrid, oldSubGrid.splitLine!, {
          spaceWidth: oldSubGrid.splitSpaceWidth!,
          recursion,
        }) || {}
        if (grids && line) {
          return {
            ...newSubGrid,
            splitLine: line,
            splitResult: grids,
          }
        }
      }
      return {
        ...subGrid,
      }
    }) as [CanvasGridConfig, CanvasGridConfig]
  }
  else {
    return newSubGrids
  }
}

/**
 * 从grid返回被分割的两个grid，以及分割线
 * @param {CanvasGridConfig} grid
 * @param {[Point, Point]} line
 * @param {SplitOptions} options
 * @returns {{ grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null}
 */
export function getGridsBySplit(grid: CanvasGridConfig, line: [Point, Point], options: SplitOptions): { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null {
  if (grid.type === 'rect') {
    return getGridsBySplitRect(grid, line, options)
  }
  else if (grid.type === 'poly') {
    return getGridsBySplitPoly(grid, line, options)
  }
  return null
}

/**
 * 从RectGrid返回被分割的两个grid，以及分割线
 * @param {CanvasRectGridConfig} grid
 * @param {[Point, Point]} line
 * @param {SplitOptions} options
 * @returns {{ grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null}
 */
export function getGridsBySplitRect(grid: CanvasRectGridConfig, line: [Point, Point], { spaceWidth, recursion = true }: SplitOptions): { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null {
  const { lt_x, lt_y, rb_x, rb_y } = grid
  const getLineCrossY = getYFromConentLineFunc(line[0], line[1], 0)
  const leftCrossY = getLineCrossY(lt_x)
  const rightCrossY = getLineCrossY(rb_x)
  const getLineCrossX = getXFromConentLineFunc(line[0], line[1], 0)
  const topCrossX = getLineCrossX(lt_y)
  const bottomCrossX = getLineCrossX(rb_y)
  const adjust = Math.floor(spaceWidth / 2)
  // 判断是否上下分割
  if ((leftCrossY > lt_y && leftCrossY < rb_y) && (rightCrossY > lt_y && rightCrossY < rb_y)) {
    if (leftCrossY === rightCrossY) {
      return {
        grids: updateSubGridsBySplit(grid, [
          { type: 'rect', lt_x, lt_y, rb_x, rb_y: leftCrossY - adjust, id: `${grid.id}_0` },
          { type: 'rect', lt_x, lt_y: leftCrossY + adjust, rb_x, rb_y, id: `${grid.id}_1` },
        ], recursion),
        line: [
          { x: lt_x, y: leftCrossY },
          { x: rb_x, y: rightCrossY },
        ],
      }
    }
    else {
      const getLineCrossY_ceil = getYFromConentLineFunc(line[0], line[1], adjust, false)
      const getLineCrossY_floor = getYFromConentLineFunc(line[0], line[1], adjust, true)
      const leftCrossY_ceil = getLineCrossY_ceil(lt_x)
      const rightCrossY_ceil = getLineCrossY_ceil(rb_x)
      const leftCrossY_floor = getLineCrossY_floor(lt_x)
      const rightCrossY_floor = getLineCrossY_floor(rb_x)
      return {
        grids: updateSubGridsBySplit(grid, [
          { type: 'poly', path: [{ x: lt_x, y: lt_y }, { x: rb_x, y: lt_y }, { x: rb_x, y: rightCrossY_ceil }, { x: lt_x, y: leftCrossY_ceil }], id: `${grid.id}_0` },
          { type: 'poly', path: [{ x: lt_x, y: leftCrossY_floor }, { x: rb_x, y: rightCrossY_floor }, { x: rb_x, y: rb_y }, { x: lt_x, y: rb_y }], id: `${grid.id}_1` },
        ], recursion),
        line: [
          { x: lt_x, y: leftCrossY },
          { x: rb_x, y: rightCrossY },
        ],
      }
    }
  }
  else if ((topCrossX > lt_x && topCrossX < rb_x) && (bottomCrossX > lt_x && bottomCrossX < rb_x)) {
    if (topCrossX === bottomCrossX) {
      return {
        grids: updateSubGridsBySplit(grid, [
          { type: 'rect', lt_x, lt_y, rb_x: topCrossX - adjust, rb_y, id: `${grid.id}_0` },
          { type: 'rect', lt_x: topCrossX + adjust, lt_y, rb_x, rb_y, id: `${grid.id}_1` },
        ], recursion),
        line: [
          { x: topCrossX, y: lt_y },
          { x: bottomCrossX, y: rb_y },
        ],
      }
    }
    else {
      const getLineCrossX_left = getXFromConentLineFunc(line[0], line[1], adjust, false)
      const getLineCrossX_right = getXFromConentLineFunc(line[0], line[1], adjust, true)
      const topCrossX_left = getLineCrossX_left(lt_y)
      const bottomCrossX_left = getLineCrossX_left(rb_y)
      const topCrossX_right = getLineCrossX_right(lt_y)
      const bottomCrossX_right = getLineCrossX_right(rb_y)
      return {
        grids: updateSubGridsBySplit(grid, [
          { type: 'poly', path: [{ x: lt_x, y: lt_y }, { x: topCrossX_left, y: lt_y }, { x: bottomCrossX_left, y: rb_y }, { x: lt_x, y: rb_y }], id: `${grid.id}_0` },
          { type: 'poly', path: [{ x: topCrossX_right, y: lt_y }, { x: rb_x, y: lt_y }, { x: rb_x, y: rb_y }, { x: bottomCrossX_right, y: rb_y }], id: `${grid.id}_1` },
        ], recursion),
        line: [
          { x: topCrossX, y: lt_y },
          { x: bottomCrossX, y: rb_y },
        ],
      }
    }
  }
  return null
}

/**
 * 从PolyGrid返回被分割的两个grid，以及分割线
 * @param {CanvasPolyGridConfig} grid
 * @param {[Point, Point]} line
 * @param {SplitOptions} options
 * @returns { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null
 */
export function getGridsBySplitPoly(
  grid: CanvasPolyGridConfig,
  line: [Point, Point],
  { spaceWidth, recursion = true }: SplitOptions,
): { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null {
  const polygon = grid.path
  let splitResult: [Point[], Point[]] | null

  if (spaceWidth && spaceWidth > 0) {
    const dx = line[1].x - line[0].x
    const dy = line[1].y - line[0].y
    const length = Math.sqrt(dx * dx + dy * dy)
    if (length === 0)
      return null

    const unitX = -dy / length
    const unitY = dx / length
    const offset = Math.floor(spaceWidth / 2)

    const line1: [Point, Point] = [
      { x: line[0].x + unitX * offset, y: line[0].y + unitY * offset },
      { x: line[1].x + unitX * offset, y: line[1].y + unitY * offset },
    ]
    const line2: [Point, Point] = [
      { x: line[0].x - unitX * offset, y: line[0].y - unitY * offset },
      { x: line[1].x - unitX * offset, y: line[1].y - unitY * offset },
    ]

    const poly1 = sutherlandHodgmanClip(polygon, line2[1], line2[0])
    const poly2 = sutherlandHodgmanClip(polygon, line1[0], line1[1])
    if (poly1.length < 3 || poly2.length < 3)
      return null

    splitResult = [poly1, poly2]
  }
  else {
    splitResult = splitPolygonByLine(polygon, line)
    if (!splitResult)
      return null

    const [poly1, poly2] = splitResult
    if (poly1.length < 3 || poly2.length < 3)
      return null
  }

  const [poly1, poly2] = splitResult
  return {
    grids: updateSubGridsBySplit(grid, [
      { type: 'poly', path: poly1, id: `${grid.id}_0` },
      { type: 'poly', path: poly2, id: `${grid.id}_1` },
    ], recursion),
    line,
  }
}

/**
 * 判断该grid是否被分割
 * @param {CanvasGridConfig} grid
 * @returns {boolean}
 */
export function isGridSplited(grid: CanvasGridConfig) {
  if (grid.splitLine && grid.splitResult && grid.splitResult.length > 0 && grid.splitSpaceWidth) {
    return true
  }
  return false
}

/**
 * 从配置里获取指定的grid
 * @param {CanvasComicConfig} comicConfig
 * @param {GridId} targetId
 * @returns {CanvasGridConfig | null}
 */
export function getGridFromComicConfig(comicConfig: CanvasComicConfig, targetId: GridId): CanvasGridConfig | null {
  function deepfind(grid: CanvasGridConfig): CanvasGridConfig | null {
    if (grid.id === targetId)
      return grid
    if (!isGridSplited(grid))
      return null
    for (const grid_ of grid.splitResult!) {
      const result_ = deepfind(grid_)
      if (result_)
        return result_
    }
    return null
  }

  for (const page of comicConfig.pages) {
    for (const grid of page.grids) {
      const result = deepfind(grid)
      if (result)
        return result
    }
  }
  return null
}

/**
 * 从grid配置获取对应样式（容器位置样式，容器形状样式，容器大小样式，边框svg样式）
 * @param {CanvasGridConfig} grid
 * @returns {GridStyle}
 */
export function getGridStyle(grid: CanvasGridConfig): GridStyle {
  if (grid.type === 'rect') {
    return getRectGridStyle(grid)
  }
  else if (grid.type === 'poly') {
    return getPolyGridStyle(grid)
  }
  throw new Error('getGridStyle Unknown Type')
}

/**
 * 根据isFlush来返回处理过的grid
 * @param {CanvasGridConfig} grid
 * @returns {CanvasGridConfig}
 */
export function getAutoFlushedGridConfig(grid: CanvasGridConfig) {
  if (!isGridFlushable(grid))
    return deepCopy(grid)

  const config = deepCopy(grid)
  if (!config.isFlush)
    return config

  if (config.type === 'rect')
    return getAutoFlushedRectGridConfig(config)
  if (config.type === 'poly')
    return getAutoFlushedPolyGridConfig(config)

  return config
}
