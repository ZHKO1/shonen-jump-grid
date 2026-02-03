import type { CanvasRectGridConfig, GridStyle, RectGridPoint } from './types'
import { deepCopy } from '@/lib/utils'
import { BORDER_WIDTH, CANVAS_WIDTH } from '../constant'
import { isGridLeftAligned, isGridRightAligned } from './align'
import { getAutoFlushedGridConfig } from './grid'

/**
 * 返回rect的绘制点
 * @param {RectGridPoint} rectGridPoint
 * @param {number} borderWidth
 * @returns {{ outside: RectGridPoint, inside: RectGridPoint }}
 */
export function getRectGridPoint({ lt_x, lt_y, rb_x, rb_y }: RectGridPoint, borderWidth: number): { outside: RectGridPoint, inside: RectGridPoint } {
  const adjust = Math.floor(borderWidth / 2)
  return {
    outside: {
      lt_x: lt_x - adjust,
      lt_y: lt_y - adjust,
      rb_x: rb_x + adjust,
      rb_y: rb_y + adjust,
    },
    inside: {
      lt_x: lt_x + adjust,
      lt_y: lt_y + adjust,
      rb_x: rb_x - adjust,
      rb_y: rb_y - adjust,
    },
  }
}

/**
 * 根据isFlush来返回处理过的RectGrid
 * @param {CanvasRectGridConfig} grid
 * @returns {CanvasRectGridConfig}
 */
export function getAutoFlushedRectGridConfig(grid: CanvasRectGridConfig) {
  const config = deepCopy(grid)
  if (isGridLeftAligned(grid)) {
    config.lt_x = -BORDER_WIDTH
  }
  if (isGridRightAligned(grid)) {
    config.rb_x = CANVAS_WIDTH + BORDER_WIDTH
  }
  return config
}

/**
 * 获取 rect grid 样式
 * @param {CanvasRectGridConfig} grid
 * @returns {GridStyle}
 */
export function getRectGridStyle(grid: CanvasRectGridConfig): GridStyle {
  const config = grid?.isFlush ? getAutoFlushedGridConfig(grid) as CanvasRectGridConfig : deepCopy(grid)
  const { lt_x, lt_y, rb_x, rb_y } = config
  const { outside } = getRectGridPoint({
    ...config,
  }, BORDER_WIDTH)
  const left = outside.lt_x
  const top = outside.lt_y
  const width = outside.rb_x - outside.lt_x
  const height = outside.rb_y - outside.lt_y
  const posStyle = {
    left: lt_x,
    top: lt_y,
  }
  const sizeStyle = {
    width: rb_x - lt_x,
    height: rb_y - lt_y,
  }
  const posStyleWithBorder = {
    left,
    top,
  }
  const sizeStyleWithBorder = {
    width,
    height,
  }
  const svgPath = ([{ x: lt_x, y: lt_y }, { x: rb_x, y: lt_y }, { x: rb_x, y: rb_y }, { x: lt_x, y: rb_y }])
    .map(p => ({ x: p.x - left, y: p.y - top }))

  const focusIconPosStyle = {
    left: 10,
    top: 10,
  }

  return {
    posStyle,
    sizeStyle,
    posStyleWithBorder,
    sizeStyleWithBorder,
    svgPath,
    imgStyle: {
      left: posStyle.left - posStyleWithBorder.left,
      top: posStyle.top - posStyleWithBorder.top,
      ...sizeStyle,
    },
    focusIconPosStyle,
  }
}
