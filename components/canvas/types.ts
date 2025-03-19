import type { PageConfig, Point, PolyGridConfig, PolyGridPoint, RectGridConfig, RectGridPoint } from '@/components/comic/core/type'

export type { Point, PolyGridPoint, RectGridPoint }

export type GridId = string | number

export interface CanvasOriginImgConfig {
  url: string
  width: number
  height: number
  dragX: number
  dragY: number
  zoom: number
}

interface CanvasGridShareConfig {
  id: GridId
  splitLine?: [Point, Point]
  splitResult?: [CanvasGridConfig, CanvasGridConfig]
  splitSpaceWidth?: number
  content?: {
    originImg?: CanvasOriginImgConfig
  }
}

export interface CanvasPolyGridConfig extends PolyGridConfig, Omit<CanvasGridShareConfig, 'content'> {
  content?: PolyGridConfig['content'] & CanvasGridShareConfig['content']
}

export interface CanvasRectGridConfig extends RectGridConfig, Omit<CanvasGridShareConfig, 'content'> {
  content?: RectGridConfig['content'] & CanvasGridShareConfig['content']
}

export type CanvasGridConfig = (CanvasPolyGridConfig | CanvasRectGridConfig)

export type PageId = string | number
export interface CanvasPageConfig extends PageConfig {
  id: PageId
  height: number
  readonly?: boolean
  grids: CanvasGridConfig[]
  logo?: PageConfig['logo'] & {
    originImg?: CanvasOriginImgConfig
  }
}

export interface CanvasComicConfig {
  pages: CanvasPageConfig[]
}
