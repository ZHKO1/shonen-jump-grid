import type { CanvasComicConfig, CanvasGridConfig, CanvasPolyGridConfig, CanvasRectGridConfig, GridId, GridStyle, Point, SplitOptions } from './types'
import { deepCopy } from '@/lib/utils'
import { fixedEqual } from '@/lib/utils/is'
import { isGridFlushable } from './align'
import { splitPolygonByLine } from './clip'
import { getAutoFlushedPolyGridConfig, getPolyGridStyle, getPolyType } from './poly'

/**
 * 如果grid是正长方形，那么修改type为Rect，否则原样返回
 * @param {CanvasGridConfig} grid
 * @returns {CanvasGridConfig}
 */
export function makePolyToRect(grid: CanvasGridConfig): CanvasGridConfig {
  if ((grid.type === 'poly') && getPolyType(grid.path) === 'rect') {
    const [p0, p1, p2, p3] = grid.path
    if ((p0 && p1 && p2 && p3) && (fixedEqual(p0.y, p1.y)) && (fixedEqual(p1.x, p2.x)) && (fixedEqual(p2.y, p3.y)) && (fixedEqual(p3.x, p0.x))) {
      const newGrid = deepCopy(grid) as Record<string, any>
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
 * 将rect grid转换为poly grid
 * @param {CanvasRectGridConfig} grid
 * @returns {CanvasPolyGridConfig}
 */
export function makeRectToPoly(grid: CanvasRectGridConfig): CanvasPolyGridConfig {
  const newGrid = deepCopy(grid) as Record<string, any>
  delete newGrid.lt_x
  delete newGrid.lt_y
  delete newGrid.rb_x
  delete newGrid.rb_y
  newGrid.path = [
    { x: grid.lt_x, y: grid.lt_y },
    { x: grid.rb_x, y: grid.lt_y },
    { x: grid.rb_x, y: grid.rb_y },
    { x: grid.lt_x, y: grid.rb_y },
  ]
  newGrid.type = 'poly'
  return newGrid as CanvasPolyGridConfig
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
    grid = makeRectToPoly(grid)
  }
  return getGridsBySplitPoly(grid, line, options)
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

  const result = splitPolygonByLine(polygon, line, spaceWidth)
  if (!result || !result.polygons)
    return null

  const [poly1, poly2] = result.polygons
  if (result.intersections) {
    line = result.intersections
  }

  return {
    grids: updateSubGridsBySplit(grid, [
      makePolyToRect({ type: 'poly', path: poly1, id: `${grid.id}_0` }),
      makePolyToRect({ type: 'poly', path: poly2, id: `${grid.id}_1` }),
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
    grid = makeRectToPoly(grid)
  }
  return getPolyGridStyle(grid)
}

/**
 * 根据isFlush来返回处理过的grid
 * @param {CanvasGridConfig} grid
 * @returns {CanvasGridConfig}
 */
export function getAutoFlushedGridConfig(grid: CanvasGridConfig) {
  if (!isGridFlushable(grid))
    return deepCopy(grid)

  let config = deepCopy(grid)

  if (!config.isFlush)
    return config

  if (config.type === 'rect')
    config = makeRectToPoly(config)

  return getAutoFlushedPolyGridConfig(config)

  return config
}
