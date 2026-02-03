import type { CanvasComicConfig, CanvasGridConfig, CanvasPolyGridConfig, CanvasRectGridConfig, GridId, GridStyle, Point, SplitOptions } from './types'
import { deepCopy } from '@/lib/utils'
import { isGridFlushable } from './align'
import { splitPolygonByLine, sutherlandHodgmanClip } from './clip'
import { getXFromConentLineFunc, getYFromConentLineFunc } from './geometry'
import { getAutoFlushedPolyGridConfig, getPolyContainerPoint, getPolyGridStyle, getPolyType } from './poly'
import { getAutoFlushedRectGridConfig, getRectGridStyle } from './rect'

/**
 * 如果grid是正长方形，那么修改type为Rect，否则原样返回
 * @param {CanvasGridConfig} grid
 * @returns {CanvasGridConfig}
 */
export function makePolyToRect(grid: CanvasGridConfig): CanvasGridConfig {
  if (grid.type === 'poly') {
    const [p0, p1, p2, p3] = grid.path
    if ((p0.y === p1.y) && (p1.x === p2.x) && (p2.y === p3.y) && (p3.x === p0.x)) {
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
    return getGridsBySplitPoly_(grid, line, options)
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
  const lt_x = grid.lt_x
  const lt_y = grid.lt_y
  const rb_x = grid.rb_x
  const rb_y = grid.rb_y
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
export function getGridsBySplitPoly(grid: CanvasPolyGridConfig, line: [Point, Point], { spaceWidth, recursion = true }: SplitOptions): { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null {
  const path = grid.path
  const lt = getPolyContainerPoint(path, 'lt')
  const rb = getPolyContainerPoint(path, 'rb')
  const lt_x = lt.x
  const lt_y = lt.y
  const rb_x = rb.x
  const rb_y = rb.y
  const point0 = path[0]
  const point1 = path[1]
  const point2 = path[2]
  const point3 = path[3]
  const getLineCrossY = getYFromConentLineFunc(line[0], line[1], 0)
  const getLineCrossX = getXFromConentLineFunc(line[0], line[1], 0)
  const adjust = Math.floor(spaceWidth / 2)
  if (getPolyType(grid.path) === 'horizon') {
    if ((line[0].y === line[1].y) && (line[0].y > lt_y) && (line[0].y < rb_y)) {
      const getLeftLineCrossX = getXFromConentLineFunc(point0, point3, 0)
      const getRightLineCrossX = getXFromConentLineFunc(point1, point2, 0)
      return {
        grids: updateSubGridsBySplit(grid, [
          { type: 'poly', path: [point0, point1, { x: getRightLineCrossX(line[0].y - adjust), y: line[0].y - adjust }, { x: getLeftLineCrossX(line[0].y - adjust), y: line[0].y - adjust }], id: `${grid.id}_0` },
          { type: 'poly', path: [{ x: getLeftLineCrossX(line[0].y + adjust), y: line[0].y + adjust }, { x: getRightLineCrossX(line[0].y + adjust), y: line[0].y + adjust }, point2, point3], id: `${grid.id}_1` },
        ], recursion),
        line: [
          { x: getLeftLineCrossX(line[0].y), y: line[0].y },
          { x: getRightLineCrossX(line[0].y), y: line[0].y },
        ],
      }
    }
    const topCrossX = getLineCrossX(lt_y)
    const bottomCrossX = getLineCrossX(rb_y)
    if ((topCrossX > point0.x && topCrossX < point1.x) && (bottomCrossX > point3.x && bottomCrossX < point2.x)) {
      if (topCrossX === bottomCrossX) {
        return {
          grids: updateSubGridsBySplit(grid, [
            { type: 'poly', path: [point0, { x: topCrossX - adjust, y: lt_y }, { x: topCrossX - adjust, y: rb_y }, point3], id: `${grid.id}_0` },
            { type: 'poly', path: [{ x: topCrossX + adjust, y: lt_y }, point1, point2, { x: topCrossX + adjust, y: rb_y }], id: `${grid.id}_1` },
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
            { type: 'poly', path: [point0, { x: topCrossX_left, y: lt_y }, { x: bottomCrossX_left, y: rb_y }, point3], id: `${grid.id}_0` },
            { type: 'poly', path: [{ x: topCrossX_right, y: lt_y }, point1, point2, { x: bottomCrossX_right, y: rb_y }], id: `${grid.id}_1` },
          ], recursion),
          line: [
            { x: topCrossX, y: lt_y },
            { x: bottomCrossX, y: rb_y },
          ],
        }
      }
    }
  }
  else if (getPolyType(grid.path) === 'vertical') {
    if ((line[0].x === line[1].x) && (line[0].x > lt_x) && (line[0].x < rb_x)) {
      const getTopLineCrossY = getYFromConentLineFunc(point0, point1, 0)
      const getBottomLineCrossY = getYFromConentLineFunc(point2, point3, 0)
      return {
        grids: updateSubGridsBySplit(grid, [
          { type: 'poly', path: [point0, { x: line[0].x - adjust, y: getTopLineCrossY(line[0].x - adjust) }, { x: line[0].x - adjust, y: getBottomLineCrossY(line[0].x - adjust) }, point3], id: `${grid.id}_0` },
          { type: 'poly', path: [{ x: line[0].x + adjust, y: getTopLineCrossY(line[0].x + adjust) }, point1, point2, { x: line[0].x + adjust, y: getBottomLineCrossY(line[0].x + adjust) }], id: `${grid.id}_1` },
        ], recursion),
        line: [
          { x: line[0].x, y: getTopLineCrossY(line[0].x) },
          { x: line[1].x, y: getBottomLineCrossY(line[0].x) },
        ],
      }
    }
    const leftCrossY = getLineCrossY(lt_x)
    const rightCrossY = getLineCrossY(rb_x)
    if ((leftCrossY > point0.y && leftCrossY < point3.y) && (rightCrossY > point1.y && rightCrossY < point2.y)) {
      if (leftCrossY === rightCrossY) {
        return {
          grids: updateSubGridsBySplit(grid, [
            { type: 'poly', path: [point0, point1, { x: rb_x, y: leftCrossY - adjust }, { x: lt_x, y: leftCrossY - adjust }], id: `${grid.id}_0` },
            { type: 'poly', path: [{ x: lt_x, y: leftCrossY + adjust }, { x: rb_x, y: leftCrossY + adjust }, point2, point3], id: `${grid.id}_1` },
          ], recursion),
          line: [
            { x: lt_x, y: leftCrossY },
            { x: rb_x, y: rightCrossY },
          ],
        }
      }
      else {
        const getLineCrossY_floor = getYFromConentLineFunc(line[0], line[1], adjust, true)
        const getLineCrossY_ceil = getYFromConentLineFunc(line[0], line[1], adjust, false)
        const leftCrossY_ceil = getLineCrossY_ceil(lt_x)
        const rightCrossY_ceil = getLineCrossY_ceil(rb_x)
        const leftCrossY_floor = getLineCrossY_floor(lt_x)
        const rightCrossY_floor = getLineCrossY_floor(rb_x)
        return {
          grids: updateSubGridsBySplit(grid, [
            { type: 'poly', path: [point0, point1, { x: rb_x, y: rightCrossY_ceil }, { x: lt_x, y: leftCrossY_ceil }], id: `${grid.id}_0` },
            { type: 'poly', path: [{ x: lt_x, y: leftCrossY_floor }, { x: rb_x, y: rightCrossY_floor }, point2, point3], id: `${grid.id}_1` },
          ], recursion),
          line: [
            { x: lt_x, y: leftCrossY },
            { x: rb_x, y: rightCrossY },
          ],
        }
      }
    }
  }

  return null
}

export function getGridsBySplitPoly_(
  grid: CanvasPolyGridConfig,
  line: [Point, Point],
  options: SplitOptions,
): { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null {
  const polyType = getPolyType(grid.path)
  const isHorizon = polyType === 'horizon'
  const isVertical = polyType === 'vertical'

  const lineIsHorizontal = line[0].y === line[1].y
  const lineIsVertical = line[0].x === line[1].x

  const lt = getPolyContainerPoint(grid.path, 'lt')
  const rb = getPolyContainerPoint(grid.path, 'rb')

  if (isHorizon && lineIsHorizontal && line[0].y > lt.y && line[0].y < rb.y) {
    return getGridsBySplitPoly(grid, line, options)
  }

  if (isVertical && lineIsVertical && line[0].x > lt.x && line[0].x < rb.x) {
    return getGridsBySplitPoly(grid, line, options)
  }

  if (isHorizon && lineIsVertical) {
    return getGridsBySplitPoly(grid, line, options)
  }

  if (isVertical && lineIsHorizontal) {
    return getGridsBySplitPoly(grid, line, options)
  }

  const polygon = grid.path
  const splitResult = splitPolygonByLine(polygon, line)

  if (!splitResult)
    return null

  const [poly1, poly2] = splitResult
  if (poly1.length < 3 || poly2.length < 3)
    return null

  const { spaceWidth } = options
  const recursion = options.recursion ?? true
  const adjust = Math.floor(spaceWidth / 2)

  const dx = line[1].x - line[0].x
  const dy = line[1].y - line[0].y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0)
    return null

  const nx = -dy / len
  const ny = dx / len

  const lineLeft: [Point, Point] = [
    { x: line[0].x + nx * adjust, y: line[0].y + ny * adjust },
    { x: line[1].x + nx * adjust, y: line[1].y + ny * adjust },
  ]
  const lineRight: [Point, Point] = [
    { x: line[0].x - nx * adjust, y: line[0].y - ny * adjust },
    { x: line[1].x - nx * adjust, y: line[1].y - ny * adjust },
  ]

  const grid1 = sutherlandHodgmanClip(poly1, lineRight[1], lineRight[0])
  const grid2 = sutherlandHodgmanClip(poly2, lineLeft[0], lineLeft[1])

  if (!grid1 || !grid2 || grid1.length < 3 || grid2.length < 3)
    return null

  return {
    grids: updateSubGridsBySplit(grid, [
      { type: 'poly', path: grid1 as [Point, Point, Point, Point], id: `${grid.id}_0` },
      { type: 'poly', path: grid2 as [Point, Point, Point, Point], id: `${grid.id}_1` },
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
  for (let i = 0; i < comicConfig.pages.length; i++) {
    const page = comicConfig.pages[i]
    for (let j = 0; j < page.grids.length; j++) {
      const grid = page.grids[j]
      const result_ = deepfind(grid)
      if (result_)
        return result_
    }
  }
  return null

  function deepfind(grid: CanvasGridConfig): CanvasGridConfig | null {
    if (grid.id === targetId) {
      return grid
    }
    if (isGridSplited(grid)) {
      for (let i = 0; i < grid.splitResult!.length; i++) {
        const grid_ = grid.splitResult![i]
        const result_ = deepfind(grid_)
        if (result_)
          return result_
      }
    }
    return null
  }
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
  const config = deepCopy(grid)
  if (!isGridFlushable(grid)) {
    return config
  }
  if (config.isFlush) {
    if (config.type === 'rect') {
      return getAutoFlushedRectGridConfig(config)
    }
    if (config.type === 'poly') {
      return getAutoFlushedPolyGridConfig(config)
    }
  }
  return config
}
