import type { CanvasComicConfig, CanvasGridConfig, CanvasPageConfig, CanvasPolyGridConfig, CanvasRectGridConfig, GridId, PageId, Point, PolyGridPoint, RectGridPoint } from '../types'
import type { ComicConfig, GridConfig, PageConfig, PolyGridConfig, RectGridConfig } from '@/components/comic/core/type'

export type Pos = 'lt' | 'rt' | 'lb' | 'rb'
export type PolyType = 'rect' | 'horizon' | 'vertical' | 'other'
export interface SplitOptions {
  spaceWidth: number
  recursion?: boolean
}

export interface GridStyle {
  imgStyle: {
    left: number
    top: number
    width: number
    height: number
  }
  posStyle: { left: number, top: number }
  sizeStyle: { width: number, height: number }
  posStyleWithBorder: { left: number, top: number }
  sizeStyleWithBorder: { width: number, height: number }
  svgPath: Point[]
  svgPathWithBorder?: Point[]
  focusIconPosStyle?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }
}

export interface LogoStyle {
  posStyle: { left: number, top: number }
  sizeStyle: { width: number, height: number }
  svgPath: Point[]
}

export type { CanvasComicConfig, CanvasGridConfig, CanvasPageConfig, CanvasPolyGridConfig, CanvasRectGridConfig, ComicConfig, GridConfig, GridId, PageConfig, PageId, Point, PolyGridConfig, PolyGridPoint, RectGridConfig, RectGridPoint }
