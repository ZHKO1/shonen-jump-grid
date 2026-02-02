import type { CanvasPageConfig, LogoStyle, Point } from './types'
import { LogoDefaultCenterX, LogoDefaultCenterY, LogoDefaultHeight, LogoDefaultWidth } from '../../comic/core/config'

/**
 * 从logo配置获取对应样式（位置样式，大小样式，边框svg样式）
 * @param {CanvasPageConfig["logo"]} logo
 * @returns {LogoStyle}
 */
export function getLogoStyle(logo: CanvasPageConfig['logo']): LogoStyle {
  const config = {
    centerX: LogoDefaultCenterX,
    centerY: LogoDefaultCenterY,
    width: LogoDefaultWidth,
    height: LogoDefaultHeight,
    ...logo,
  }

  const posStyle = {
    left: config.centerX - config.width / 2,
    top: config.centerY - config.height / 2,
  }

  const sizeStyle = {
    width: config.width,
    height: config.height,
  }

  const left = posStyle.left
  const top = posStyle.top
  const lt = { x: posStyle.left, y: posStyle.top }
  const rb = { x: posStyle.left + sizeStyle.width, y: posStyle.top + sizeStyle.height }

  const svgPath = ([{ x: lt.x, y: lt.y }, { x: rb.x, y: lt.y }, { x: rb.x, y: rb.y }, { x: lt.x, y: rb.y }])
    .map(p => ({ x: p.x - left, y: p.y - top })) as [Point, Point, Point, Point]

  return {
    posStyle,
    sizeStyle,
    svgPath,
  }
}
