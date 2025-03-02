export type Point = { x: number, y: number };

export type GridShareConfig = {
    id: string | number,
    splitLine?: [Point, Point],
    splitResult?: [GridConfig, GridConfig],
    splitSpaceWidth?: number,
    content?: {
        url: string,
        originImg: {
            url: string,
            width: number,
            height: number,
            dragX: number,
            dragY: number,
            zoom: number,
        }
    }
}

export type PolyGridPoint = {
    path: [Point, Point, Point, Point],
}

export type PolyGridConfig = {
    type: 'poly',
} & GridShareConfig & PolyGridPoint

export type RectGridPoint = {
    lt_x: number,
    lt_y: number,
    rb_x: number,
    rb_y: number,
}

export type RectGridConfig = {
    type: 'rect',
} & GridShareConfig & RectGridPoint

export type GridConfig = (PolyGridConfig | RectGridConfig);

export interface ComicPageConfig {
    id: string | number,
    grids: GridConfig[],
}

export type ComicConfig = GridConfig[];