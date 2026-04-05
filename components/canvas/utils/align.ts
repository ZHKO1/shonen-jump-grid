import type { CanvasGridConfig } from './types'
import { BLANK_GRID_MARGIN, CANVAS_WIDTH } from '../constant'
import { isGridSplited } from './grid'
import { getPolyType } from './poly'

/**
 * 判断该grid是否靠左边
 * @param {CanvasGridConfig} grid
 * @returns {boolean}
 */
export function isGridLeftAligned(grid: CanvasGridConfig) {
  if (grid.type === 'rect') {
    const lt_x = grid.lt_x
    const leftAlign = lt_x === BLANK_GRID_MARGIN
    return leftAlign
  }
  if (grid.type === 'poly') {
    const polyType = getPolyType(grid.path)
    if (polyType === 'vertical' || polyType === 'other') {
      return false
    }
    else {
      const [p0, _, __, p3] = grid.path
      const leftAlign = (p0.x === BLANK_GRID_MARGIN) && (p3.x === BLANK_GRID_MARGIN)
      return leftAlign
    }
  }
  return false
}

/**
 * 判断该grid是否靠右边
 * @param {CanvasGridConfig} grid
 * @returns {boolean}
 */
export function isGridRightAligned(grid: CanvasGridConfig) {
  if (grid.type === 'rect') {
    const rb_x = grid.rb_x
    const rightAlign = rb_x === (CANVAS_WIDTH - BLANK_GRID_MARGIN)
    return rightAlign
  }
  if (grid.type === 'poly') {
    const polyType = getPolyType(grid.path)
    if (polyType === 'vertical' || polyType === 'other') {
      return false
    }
    else {
      const [_, p1, p2, __] = grid.path
      const rightAlign = (p1.x === (CANVAS_WIDTH - BLANK_GRID_MARGIN)) && (p2.x === (CANVAS_WIDTH - BLANK_GRID_MARGIN))
      return rightAlign
    }
  }
  return false
}

/**
 * 判断该grid是否可靠边
 * @param {CanvasGridConfig} grid
 * @returns {boolean}
 */
export function isGridFlushable(grid: CanvasGridConfig) {
  if (isGridSplited(grid)) {
    return false
  }
  const leftAlign = isGridLeftAligned(grid)
  const rightAlign = isGridRightAligned(grid)
  if (leftAlign || rightAlign) {
    return true
  }
  return false
}
