export type Point = { x: number, y: number };

export interface FocusMoveType {
  type: "move";
  direction: "right-to-left" | "left-to-right";
}

export interface FocusChangeBackgroundType {
  type: "change-background";
  // 对content.url进行彩色处理，保存在该字段
  focusUrl?: string;
}

interface GridShareConfig {
  content?: {
    url: string;
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    focus?: FocusMoveType | FocusChangeBackgroundType
  };
}

export interface RectGridPoint {
  lt_x: number,
  lt_y: number,
  rb_x: number,
  rb_y: number,
}

export interface RectGridConfig extends GridShareConfig, RectGridPoint {
  type: 'rect';
}

export interface PolyGridPoint {
  path: [Point, Point, Point, Point],
}

export interface PolyGridConfig extends GridShareConfig, PolyGridPoint {
  type: 'poly';
}

export type GridConfig = RectGridConfig | PolyGridConfig;

export interface PageConfig {
  height?: number;
  logo?: {
    url: string,
    centerX?: number,
    centerY?: number,
    width?: number,
    height?: number,
  };
  grids: GridConfig[]
}

export type ComicConfig = {
  pages: PageConfig[]
}