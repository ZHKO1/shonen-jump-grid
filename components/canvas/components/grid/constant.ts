import { GridConfig } from "./types";

export const BORDER_WIDTH = 6;

export const LOGO_PAGE_HEIGHT = 1080;

export const LOGO_PAGE_GRIDS_CONFIG: GridConfig[] = [
    {
        "type": "rect",
        "lt_x": 18,
        "lt_y": 878,
        "rb_x": 526,
        "rb_y": 1062,
        "id": 0,
    },
    {
        "type": "rect",
        "lt_x": 539,
        "lt_y": 555,
        "rb_x": 703,
        "rb_y": 1062,
        "id": 1,
    },
    {
        "type": "poly",
        "path": [
            { x: 18, y: 555 },
            { x: 186, y: 555 },
            { x: 314, y: 858 },
            { x: 18, y: 858 },
        ],
        "id": 2
    },
    {
        "type": "poly",
        "path": [
            { x: 200, y: 555 },
            { x: 526, y: 555 },
            { x: 526, y: 858 },
            { x: 328, y: 858 }
        ],
        "id": 3
    },
    {
        "type": "rect",
        "lt_x": 18,
        "lt_y": 397,
        "rb_x": 195,
        "rb_y": 523,
        "id": 4
    },
    {
        "type": "poly",
        "path": [
            { x: 205, y: 397 },
            { x: 445, y: 397 },
            { x: 486, y: 523 },
            { x: 205, y: 523 }
        ],
        "id": 5
    },
    {
        "type": "poly",
        "path": [
            { x: 456, y: 397 },
            { x: 703, y: 397 },
            { x: 703, y: 523 },
            { x: 497, y: 523 }
        ],
        "id": 6
    },
    {
        "type": "rect",
        "lt_x": 18,
        "lt_y": 158,
        "rb_x": 703,
        "rb_y": 380,
        "id": 7
    },
    {
        "type": "rect",
        "lt_x": 18,
        "lt_y": 18,
        "rb_x": 255,
        "rb_y": 141,
        "id": 8
    },
    {
        "type": "rect",
        "lt_x": 264,
        "lt_y": 18,
        "rb_x": 544,
        "rb_y": 141,
        "id": 9
    },
    {
        "type": "rect",
        "lt_x": 556,
        "lt_y": 18,
        "rb_x": 703,
        "rb_y": 141,
        "id": 10
    }
]

export const BLANK_GRID_MARGIN: number = 18;

export const NEW_PAGE_GRID_CONFIG: GridConfig = {
    "type": "rect",
    "lt_x": BLANK_GRID_MARGIN,
    "lt_y": BLANK_GRID_MARGIN,
    "rb_x": 720 - BLANK_GRID_MARGIN,
    "rb_y": 1063,
    "id": 0,
}