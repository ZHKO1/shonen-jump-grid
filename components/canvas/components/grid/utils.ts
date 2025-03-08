import { CanvasComicConfig, CanvasPageConfig, CanvasGridConfig, GridId, PageId, Point, CanvasPolyGridConfig, PolyGridPoint, CanvasRectGridConfig, RectGridPoint } from "./types";
import { BORDER_WIDTH } from "./constant";
import { ComicConfig, GridConfig, PageConfig, PolyGridConfig, RectGridConfig } from "@/components/comic/core/type";

type Pos = "lt" | "rt" | "lb" | "rb";
type PolyType = "horizon" | "vertical";
type SplitOptions = { spaceWidth: number, recursion?: boolean }
/**
 * 获取四边形所在容器的四个点的坐标
 * @param path 
 * @param pos 
 * @returns 
 */
export function getPolyContainerPoint(path: [Point, Point, Point, Point], pos: Pos): Point {
    const point = { x: path[0].x, y: path[1].y }
    path.forEach(p => {
        switch (pos) {
            case "lt":
                point.x = Math.min(point.x, p.x)
                point.y = Math.min(point.y, p.y)
                break;
            case "rt":
                point.x = Math.max(point.x, p.x)
                point.y = Math.min(point.y, p.y)
                break;
            case "lb":
                point.x = Math.min(point.x, p.x)
                point.y = Math.max(point.y, p.y)
                break;
            case "rb":
                point.x = Math.max(point.x, p.x)
                point.y = Math.max(point.y, p.y)
                break;
        }
    })
    return point
}

/**
 * 判断四边形本身是水平还是垂直的
 * @param path 
 * @returns 
 */
export function getPolyType(path: [Point, Point, Point, Point]): PolyType {
    const lt = getPolyContainerPoint(path, 'lt');
    const rb = getPolyContainerPoint(path, 'rb');
    const isAdjust = (attr: "x" | "y") => {
        return (path.filter(point => point[attr] == lt[attr]).length > 1) && (path.filter(point => point[attr] == rb[attr]).length > 1);
    }
    if (isAdjust('y')) {
        return "horizon";
    }
    if (isAdjust('x')) {
        return "vertical";
    }
    throw new Error("Invalid poly type")
}

/**
 * 返回从左上角开始顺时针排序的四个点
 * @param path 
 * @returns 
 */
export function getPolyPointBySort(path: [Point, Point, Point, Point]): [Point, Point, Point, Point] {
    let result = [];
    if (getPolyType(path) === 'horizon') {
        const lt_y = getPolyContainerPoint(path, 'lt').y;
        const rb_y = getPolyContainerPoint(path, 'rb').y;
        const topLine = path.filter(point => point.y == lt_y).sort((a, b) => a.x - b.x);
        const bottomLine = path.filter(point => point.y == rb_y).sort((a, b) => b.x - a.x);
        result = [...topLine, ...bottomLine];
    } else {
        const lt_x = getPolyContainerPoint(path, 'lt').x;
        const rb_x = getPolyContainerPoint(path, 'rb').x;
        const leftLine = path.filter(point => point.x == lt_x).sort((a, b) => a.y - b.y);
        const rightLine = path.filter(point => point.x == rb_x).sort((a, b) => a.y - b.y);
        result = [leftLine[0], ...rightLine, leftLine[1]];
    }
    return result as [Point, Point, Point, Point];
}

/**
 * 返回计算x的函数
 * 斜率公式: y = kx + b
 * @param point1 
 * @param point2 
 * @param borderWidth 
 * @param direct 如果是true，则向右平行调整，否则向左平行调整 
 * @returns 
 */
function getXFromConentLineFunc(point1: Point, point2: Point, borderWidth: number, direct: boolean = false): (y: number) => number {
    return (y: number) => {
        const one = (direct ? +1 : -1);
        if (point1.x === point2.x) {
            return point1.x + one * borderWidth;
        }
        const k = (point1.y - point2.y) / (point1.x - point2.x);
        const b = point1.y - k * point1.x;
        const contentB = b - (k > 0 ? one : -1 * one) * Math.sqrt(Math.pow(borderWidth * k, 2) + Math.pow(borderWidth, 2));
        return (y - contentB) / k;
    }
}

/**
 * 返回计算y的函数
 * 斜率公式: y = kx + b
 * @param point1 
 * @param point2 
 * @param borderWidth 
 * @param direct 如果是true，则向上平行调整，否则向下平行调整 
 * @returns 
 */
function getYFromConentLineFunc(point1: Point, point2: Point, borderWidth: number, direct: boolean = false): (y: number) => number {
    return (x: number) => {
        const one = (direct ? +1 : -1);
        if (point1.y === point2.y) {
            return point1.y + one * borderWidth;
        }
        const k = (point1.y - point2.y) / (point1.x - point2.x);
        const b = point1.y - k * point1.x;
        const contentB = b + one * Math.sqrt(Math.pow(borderWidth * k, 2) + Math.pow(borderWidth, 2));
        return k * x + contentB;
    }
}

/**
 * 返回rect的绘制点
 * @param path 
 * @param borderWidth 
 * @returns 
 */
export function getRectGridPoint({ lt_x, lt_y, rb_x, rb_y }: RectGridPoint, borderWidth: number): { outside: RectGridPoint, inside: RectGridPoint } {
    const adjust = Math.floor(borderWidth / 2);
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
        }
    };
}

/**
 * 返回poly的绘制点
 * @param path 
 * @param borderWidth 
 * @returns 
 */
export function getPolyGridPoint(path: PolyGridPoint["path"], borderWidth: number): { outside: PolyGridPoint["path"], inside: PolyGridPoint["path"] } {
    const adjust = Math.floor(borderWidth / 2);
    const lt_x = getPolyContainerPoint(path, 'lt').x;
    const lt_y = getPolyContainerPoint(path, 'lt').y;
    const rb_x = getPolyContainerPoint(path, 'rb').x;
    const rb_y = getPolyContainerPoint(path, 'rb').y;
    let point0, point1, point2, point3;
    if (getPolyType(path) === 'horizon') {
        return {
            outside: getPointFromHorizonPoly("out"),
            inside: getPointFromHorizonPoly("in"),
        };
    } else {
        return {
            outside: getPointFromVerticalPoly("out"),
            inside: getPointFromVerticalPoly("in"),
        };
    }


    function getPointFromHorizonPoly(type: "out" | "in"): PolyGridPoint["path"] {
        const one = type == "out" ? -1 : 1;
        const getConentLeftLineX = getXFromConentLineFunc(path[0], path[3], adjust, type == "out" ? false : true);
        const getConentRightLineX = getXFromConentLineFunc(path[1], path[2], adjust, type == "out" ? true : false);

        point0 = { x: getConentLeftLineX(lt_y + one * adjust), y: lt_y + one * adjust };
        point1 = { x: getConentRightLineX(lt_y + one * adjust), y: lt_y + one * adjust };
        point2 = { x: getConentRightLineX(rb_y - one * adjust), y: rb_y - one * adjust };
        point3 = { x: getConentLeftLineX(rb_y - one * adjust), y: rb_y - one * adjust };

        return [point0, point1, point2, point3];
    }

    function getPointFromVerticalPoly(type: "out" | "in"): PolyGridPoint["path"] {
        const one = type == "out" ? -1 : 1;
        const getConentTopLineY = getYFromConentLineFunc(path[0], path[1], adjust, type == "out" ? false : true);
        const getConentBottomLineY = getYFromConentLineFunc(path[3], path[2], adjust, type == "out" ? true : false);

        point0 = { y: getConentTopLineY(lt_x + one * adjust), x: lt_x + one * adjust };
        point1 = { y: getConentTopLineY(rb_x - one * adjust), x: rb_x - one * adjust };
        point2 = { y: getConentBottomLineY(rb_x - one * adjust), x: rb_x - one * adjust };
        point3 = { y: getConentBottomLineY(lt_x + one * adjust), x: lt_x + one * adjust };

        return [point0, point1, point2, point3];
    }
}

/**
 * 如果grid是正长方形，那么修改type为Rect，否则原样返回
 * @param grid 
 * @returns CanvasGridConfig
 */
export function makePolyToRect(grid: CanvasGridConfig): CanvasGridConfig {
    if (grid.type == "poly") {
        const [p0, p1, p2, p3] = grid.path;
        if ((p0.y == p1.y) && (p1.x == p2.x) && (p2.y == p3.y) && (p3.x == p0.x)) {
            const newGrid = {
                ...grid
            } as Record<string, any>;
            delete newGrid.path;
            newGrid.type = "rect";
            newGrid.lt_x = p0.x;
            newGrid.lt_y = p0.y;
            newGrid.rb_x = p2.x;
            newGrid.rb_y = p2.y;
            return newGrid as CanvasRectGridConfig;
        }
    }
    return grid;
}

/**
 * 更新了子Grid后，根据recursion配置选择是否递归处理旧子Grid的分割线
 * @param grid 
 * @param newSubGrids
 * @param recursion
 * @returns [CanvasGridConfig, CanvasGridConfig]
 */
export function updateSubGridsBySplit(grid: CanvasGridConfig, newSubGrids: [CanvasGridConfig, CanvasGridConfig], recursion: boolean): [CanvasGridConfig, CanvasGridConfig] {
    newSubGrids = [makePolyToRect(newSubGrids[0]), makePolyToRect(newSubGrids[1])]
    if (!recursion) {
        return newSubGrids;
    }
    if (isGridSplited(grid)) {
        return newSubGrids.map((subGrid, index) => {
            const oldSubGrid = grid.splitResult![index];
            if (isGridSplited(oldSubGrid)) {
                const newSubGrid = {
                    ...oldSubGrid,
                    ...subGrid,
                }
                const { grids, line } = getGridsBySplit(newSubGrid, oldSubGrid.splitLine!, {
                    spaceWidth: oldSubGrid.splitSpaceWidth!,
                    recursion: recursion,
                }) || {};
                if (grids && line) {
                    return {
                        ...newSubGrid,
                        splitLine: line,
                        splitResult: grids,
                    }
                }
            }
            return {
                ...subGrid
            }
        }) as [CanvasGridConfig, CanvasGridConfig];
    } else {
        return newSubGrids;
    }
}

/**
 * 从RectGrid返回被分割的两个grid，以及分割线
 * @param path 
 * @param line 
 * @param options
 * @param options.spaceWidth
 * @param options.recursion
 * @returns { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null
 */
export function getGridsBySplitRect(grid: CanvasRectGridConfig, line: [Point, Point], { spaceWidth, recursion = true }: SplitOptions): { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null {
    const lt_x = grid.lt_x;
    const lt_y = grid.lt_y;
    const rb_x = grid.rb_x;
    const rb_y = grid.rb_y;
    const getLineCrossY = getYFromConentLineFunc(line[0], line[1], 0);
    const leftCrossY = getLineCrossY(lt_x);
    const rightCrossY = getLineCrossY(rb_x);
    const getLineCrossX = getXFromConentLineFunc(line[0], line[1], 0);
    const topCrossX = getLineCrossX(lt_y);
    const bottomCrossX = getLineCrossX(rb_y);
    const adjust = Math.floor(spaceWidth / 2)
    // 判断是否上下分割
    if ((leftCrossY > lt_y && leftCrossY < rb_y) && (rightCrossY > lt_y && rightCrossY < rb_y)) {
        if (leftCrossY == rightCrossY) {
            return {
                grids: updateSubGridsBySplit(grid, [
                    { type: 'rect', lt_x, lt_y, rb_x, rb_y: leftCrossY - adjust, id: grid.id + "_0" },
                    { type: 'rect', lt_x, lt_y: leftCrossY + adjust, rb_x, rb_y, id: grid.id + "_1" }
                ], recursion),
                line: [
                    { x: lt_x, y: leftCrossY },
                    { x: rb_x, y: rightCrossY },
                ]
            }
        } else {
            const getLineCrossY_ceil = getYFromConentLineFunc(line[0], line[1], adjust, false);
            const getLineCrossY_floor = getYFromConentLineFunc(line[0], line[1], adjust, true);
            const leftCrossY_ceil = getLineCrossY_ceil(lt_x);
            const rightCrossY_ceil = getLineCrossY_ceil(rb_x);
            const leftCrossY_floor = getLineCrossY_floor(lt_x);
            const rightCrossY_floor = getLineCrossY_floor(rb_x);
            return {
                grids: updateSubGridsBySplit(grid, [
                    { type: 'poly', path: [{ x: lt_x, y: lt_y }, { x: rb_x, y: lt_y }, { x: rb_x, y: rightCrossY_ceil }, { x: lt_x, y: leftCrossY_ceil }], id: grid.id + "_0" },
                    { type: 'poly', path: [{ x: lt_x, y: leftCrossY_floor }, { x: rb_x, y: rightCrossY_floor }, { x: rb_x, y: rb_y }, { x: lt_x, y: rb_y }], id: grid.id + "_1" },
                ], recursion),
                line: [
                    { x: lt_x, y: leftCrossY },
                    { x: rb_x, y: rightCrossY },
                ]
            }
        }
    } else if ((topCrossX > lt_x && topCrossX < rb_x) && (bottomCrossX > lt_x && bottomCrossX < rb_x)) {
        if (topCrossX == bottomCrossX) {
            return {
                grids: updateSubGridsBySplit(grid, [
                    { type: 'rect', lt_x, lt_y, rb_x: topCrossX - adjust, rb_y, id: grid.id + "_0" },
                    { type: 'rect', lt_x: topCrossX + adjust, lt_y, rb_x, rb_y, id: grid.id + "_1" }
                ], recursion),
                line: [
                    { x: topCrossX, y: lt_y },
                    { x: bottomCrossX, y: rb_y },
                ]
            }
        } else {
            const getLineCrossX_left = getXFromConentLineFunc(line[0], line[1], adjust, false);
            const getLineCrossX_right = getXFromConentLineFunc(line[0], line[1], adjust, true);
            const topCrossX_left = getLineCrossX_left(lt_y);
            const bottomCrossX_left = getLineCrossX_left(rb_y);
            const topCrossX_right = getLineCrossX_right(lt_y);
            const bottomCrossX_right = getLineCrossX_right(rb_y);
            return {
                grids: updateSubGridsBySplit(grid, [
                    { type: 'poly', path: [{ x: lt_x, y: lt_y }, { x: topCrossX_left, y: lt_y }, { x: bottomCrossX_left, y: rb_y }, { x: lt_x, y: rb_y }], id: grid.id + "_0" },
                    { type: 'poly', path: [{ x: topCrossX_right, y: lt_y }, { x: rb_x, y: lt_y }, { x: rb_x, y: rb_y }, { x: bottomCrossX_right, y: rb_y }], id: grid.id + "_1" },
                ], recursion),
                line: [
                    { x: topCrossX, y: lt_y },
                    { x: bottomCrossX, y: rb_y },
                ]
            }

        }
    }
    return null;
}

/**
 * 从PolyGrid返回被分割的两个grid，以及分割线
 * @param path 
 * @param line 
 * @param options
 * @param options.spaceWidth
 * @param options.recursion
 * @returns { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null
 */
export function getGridsBySplitPoly(grid: CanvasPolyGridConfig, line: [Point, Point], { spaceWidth, recursion = true }: SplitOptions): { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null {
    const path = grid.path;
    const lt = getPolyContainerPoint(path, "lt");
    const rb = getPolyContainerPoint(path, "rb");
    const lt_x = lt.x;
    const lt_y = lt.y;
    const rb_x = rb.x;
    const rb_y = rb.y;
    const point0 = path[0];
    const point1 = path[1];
    const point2 = path[2];
    const point3 = path[3];
    const getLineCrossY = getYFromConentLineFunc(line[0], line[1], 0);
    const getLineCrossX = getXFromConentLineFunc(line[0], line[1], 0);
    const adjust = Math.floor(spaceWidth / 2)
    if (getPolyType(grid.path) === 'horizon') {
        if ((line[0].y == line[1].y) && (line[0].y > lt_y) && (line[0].y < rb_y)) {
            const getLeftLineCrossX = getXFromConentLineFunc(point0, point3, 0);
            const getRightLineCrossX = getXFromConentLineFunc(point1, point2, 0);
            return {
                grids: updateSubGridsBySplit(grid, [
                    { type: 'poly', path: [point0, point1, { x: getRightLineCrossX(line[0].y - adjust), y: line[0].y - adjust }, { x: getLeftLineCrossX(line[0].y - adjust), y: line[0].y - adjust }], id: grid.id + "_0" },
                    { type: 'poly', path: [{ x: getLeftLineCrossX(line[0].y + adjust), y: line[0].y + adjust }, { x: getRightLineCrossX(line[0].y + adjust), y: line[0].y + adjust }, point2, point3], id: grid.id + "_1" },
                ], recursion),
                line: [
                    { x: getLeftLineCrossX(line[0].y), y: line[0].y },
                    { x: getRightLineCrossX(line[0].y), y: line[0].y },
                ]
            }
        }
        const topCrossX = getLineCrossX(lt_y);
        const bottomCrossX = getLineCrossX(rb_y);
        if ((topCrossX > point0.x && topCrossX < point1.x) && (bottomCrossX > point3.x && bottomCrossX < point2.x)) {
            if (topCrossX == bottomCrossX) {
                return {
                    grids: updateSubGridsBySplit(grid, [
                        { type: 'poly', path: [point0, { x: topCrossX - adjust, y: lt_y }, { x: topCrossX - adjust, y: rb_y }, point3], id: grid.id + "_0" },
                        { type: 'poly', path: [{ x: topCrossX + adjust, y: lt_y }, point1, point2, { x: topCrossX + adjust, y: rb_y }], id: grid.id + "_1" },
                    ], recursion),
                    line: [
                        { x: topCrossX, y: lt_y },
                        { x: bottomCrossX, y: rb_y },
                    ]
                }
            } else {
                const getLineCrossX_left = getXFromConentLineFunc(line[0], line[1], adjust, false);
                const getLineCrossX_right = getXFromConentLineFunc(line[0], line[1], adjust, true);
                const topCrossX_left = getLineCrossX_left(lt_y);
                const bottomCrossX_left = getLineCrossX_left(rb_y);
                const topCrossX_right = getLineCrossX_right(lt_y);
                const bottomCrossX_right = getLineCrossX_right(rb_y);
                return {
                    grids: updateSubGridsBySplit(grid, [
                        { type: 'poly', path: [point0, { x: topCrossX_left, y: lt_y }, { x: bottomCrossX_left, y: rb_y }, point3], id: grid.id + "_0" },
                        { type: 'poly', path: [{ x: topCrossX_right, y: lt_y }, point1, point2, { x: bottomCrossX_right, y: rb_y }], id: grid.id + "_1" },
                    ], recursion),
                    line: [
                        { x: topCrossX, y: lt_y },
                        { x: bottomCrossX, y: rb_y },
                    ]
                }
            }
        }
    } else if (getPolyType(grid.path) === 'vertical') {
        if ((line[0].x == line[1].x) && (line[0].x > lt_x) && (line[0].x < rb_x)) {
            const getTopLineCrossY = getYFromConentLineFunc(point0, point1, 0);
            const getBottomLineCrossY = getYFromConentLineFunc(point2, point3, 0);
            return {
                grids: updateSubGridsBySplit(grid, [
                    { type: 'poly', path: [point0, { x: line[0].x - adjust, y: getTopLineCrossY(line[0].x - adjust) }, { x: line[0].x - adjust, y: getBottomLineCrossY(line[0].x - adjust) }, point3], id: grid.id + "_0" },
                    { type: 'poly', path: [{ x: line[0].x + adjust, y: getTopLineCrossY(line[0].x + adjust) }, point1, point2, { x: line[0].x + adjust, y: getBottomLineCrossY(line[0].x + adjust) }], id: grid.id + "_1" },
                ], recursion),
                line: [
                    { x: line[0].x, y: getTopLineCrossY(line[0].x) },
                    { x: line[1].x, y: getBottomLineCrossY(line[0].x) },
                ]
            }
        }
        const leftCrossY = getLineCrossY(lt_x);
        const rightCrossY = getLineCrossY(rb_x);
        if ((leftCrossY > point0.y && leftCrossY < point3.y) && (rightCrossY > point1.y && rightCrossY < point2.y)) {
            if (leftCrossY == rightCrossY) {
                return {
                    grids: updateSubGridsBySplit(grid, [
                        { type: 'poly', path: [point0, point1, { x: rb_x, y: leftCrossY - adjust }, { x: lt_x, y: leftCrossY - adjust }], id: grid.id + "_0" },
                        { type: 'poly', path: [{ x: lt_x, y: leftCrossY + adjust }, { x: rb_x, y: leftCrossY + adjust }, point2, point3], id: grid.id + "_1" },
                    ], recursion),
                    line: [
                        { x: lt_x, y: leftCrossY },
                        { x: rb_x, y: rightCrossY },
                    ]
                }
            } else {
                const getLineCrossY_floor = getYFromConentLineFunc(line[0], line[1], adjust, true);
                const getLineCrossY_ceil = getYFromConentLineFunc(line[0], line[1], adjust, false);
                const leftCrossY_ceil = getLineCrossY_ceil(lt_x);
                const rightCrossY_ceil = getLineCrossY_ceil(rb_x);
                const leftCrossY_floor = getLineCrossY_floor(lt_x);
                const rightCrossY_floor = getLineCrossY_floor(rb_x);
                return {
                    grids: updateSubGridsBySplit(grid, [
                        { type: 'poly', path: [point0, point1, { x: rb_x, y: rightCrossY_ceil }, { x: lt_x, y: leftCrossY_ceil }], id: grid.id + "_0" },
                        { type: 'poly', path: [{ x: lt_x, y: leftCrossY_floor }, { x: rb_x, y: rightCrossY_floor }, point2, point3], id: grid.id + "_1" },
                    ], recursion),
                    line: [
                        { x: lt_x, y: leftCrossY },
                        { x: rb_x, y: rightCrossY },
                    ]
                }
            }
        }
    }

    return null;
}

/**
 * 从grid返回被分割的两个grid，以及分割线
 * @param path 
 * @param line 
 * @param options
 * @param options.spaceWidth
 * @param options.recursion
 * @returns { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null
 */
export function getGridsBySplit(grid: CanvasGridConfig, line: [Point, Point], options: SplitOptions): { grids: [CanvasGridConfig, CanvasGridConfig], line: [Point, Point] } | null {
    if (grid.type === 'rect') {
        return getGridsBySplitRect(grid, line, options);
    } else if (grid.type === 'poly') {
        return getGridsBySplitPoly(grid, line, options);
    }
    return null;
}


/**
 * 从配置里获取指定的page
 * @param comicConfig 
 * @param targetId
 * @returns CanvasPageConfig | null
 */
export function getPageFromComicConfig(comicConfig: CanvasComicConfig, targetId: PageId): CanvasPageConfig | null {
    if (!comicConfig || !comicConfig.pages) {
        return null;
    }
    for (let i = 0; i < comicConfig.pages.length; i++) {
        const page = comicConfig.pages[i];
        if (page.id === targetId) {
            return page;
        }
    }
    return null;
}

/**
 * 从配置里获取指定的grid
 * @param comicConfig 
 * @param targetId
 * @returns CanvasGridConfig | null
 */
export function getGridFromComicConfig(comicConfig: CanvasComicConfig, targetId: GridId): CanvasGridConfig | null {
    for (let i = 0; i < comicConfig.pages.length; i++) {
        const page = comicConfig.pages[i];
        for (let j = 0; j < page.grids.length; j++) {
            const grid = page.grids[j];
            const result_ = deepfind(grid);
            if (result_) return result_;
        }
    }
    return null;

    function deepfind(grid: CanvasGridConfig): CanvasGridConfig | null {
        if (grid.id === targetId) {
            return grid;
        }
        if (isGridSplited(grid)) {
            for (let i = 0; i < grid.splitResult!.length; i++) {
                const grid_ = grid.splitResult![i];
                const result_ = deepfind(grid_);
                if (result_) return result_;
            }
        }
        return null;
    }
}

/**
 * 判断该grid是否被分割
 * @param path 
 * @returns boolean
 */
export function isGridSplited(grid: CanvasGridConfig) {
    if (grid.splitLine && grid.splitResult && grid.splitResult.length > 0 && grid.splitSpaceWidth) {
        return true;
    }
    return false;
}

/**
 * 根据两个点，微调某个点，保持水平或垂直
 * @param start 
 * @param end 
 * @param options.direction 'start' | 'end'
 * @returns Point
 */
export const getAdjustedPoint = (
    start: Point,
    end: Point,
    options: { direction: 'start' | 'end' }
): Point => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    // 垂直线直接返回
    if (deltaX === 0) return options.direction === 'end' ? end : start;

    const slope = deltaY / deltaX;
    const absSlope = Math.abs(slope);

    // 调整终点（保持起点不变）
    if (options.direction === 'end') {
        if (absSlope < 0.1) return { x: end.x, y: start.y };  // 接近水平
        if (absSlope > 12) return { x: start.x, y: end.y };   // 接近垂直
        return end;
    }
    // 调整起点（保持终点不变）
    else {
        if (absSlope < 0.1) return { x: start.x, y: end.y };  // 接近水平
        if (absSlope > 12) return { x: end.x, y: start.y };   // 接近垂直
        return start;
    }
};

interface GridStyle {
    // 相对容器（包括边框），内部图片的大小和位置
    imgStyle: {
        left: number, top: number,
        width: number, height: number
    },
    // 左上位置（不考虑边框宽度）
    posStyle: { left: number, top: number },
    // 大小（不考虑边框宽度）
    sizeStyle: { width: number, height: number },
    // 边框最外一圈的左上位置（考虑边框宽度）
    posStyleWithBorder: { left: number, top: number },
    // 边框最外一圈的大小（考虑边框宽度）
    sizeStyleWithBorder: { width: number, height: number },
    // 边框svg路径（不考虑边框宽度）
    svgPath: [Point, Point, Point, Point],
    // 边框最外一圈的路径（考虑边框宽度）
    svgPathWithBorder?: [Point, Point, Point, Point],
}

export function getSvgPoints(path: [Point, Point, Point, Point]) {
    return path.map(p => `${p.x},${p.y}`).join(' ')
}

export function getClipPath(path: [Point, Point, Point, Point]) {
    return `polygon(${path.map(p => `${p.x}px ${p.y}px`).join(',')})`;
}

const getRectGridStyle = (grid: CanvasRectGridConfig): GridStyle => {
    const { outside } = getRectGridPoint({
        ...grid
    }, BORDER_WIDTH);
    const left = outside.lt_x;
    const top = outside.lt_y;
    const width = outside.rb_x - outside.lt_x;
    const height = outside.rb_y - outside.lt_y;
    const posStyle = {
        left: grid.lt_x,
        top: grid.lt_y,
    }
    const sizeStyle = {
        width: grid.rb_x - grid.lt_x,
        height: grid.rb_y - grid.lt_y,
    }
    const posStyleWithBorder = {
        left,
        top,
    }
    const sizeStyleWithBorder = {
        width,
        height,
    }
    const svgPath = ([{ x: grid.lt_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.rb_y }, { x: grid.lt_x, y: grid.rb_y }])
        .map(p => ({ x: p.x - left, y: p.y - top })) as [Point, Point, Point, Point]
    return {
        posStyle,
        sizeStyle,
        posStyleWithBorder,
        sizeStyleWithBorder,
        svgPath,
        imgStyle: {
            left: posStyle.left - posStyleWithBorder.left,
            top: posStyle.top - posStyleWithBorder.top,
            ...sizeStyle
        }
    }
}

const getPolyGridStyle = (grid: CanvasPolyGridConfig): GridStyle => {
    const lt = getPolyContainerPoint(grid.path, 'lt');
    const rb = getPolyContainerPoint(grid.path, 'rb');
    const { outside } = getPolyGridPoint(grid.path, BORDER_WIDTH);
    const lt_outside = getPolyContainerPoint(outside, 'lt');
    const rb_outside = getPolyContainerPoint(outside, 'rb');
    const left = lt_outside.x;
    const top = lt_outside.y;
    const width = rb_outside.x - lt_outside.x;
    const height = rb_outside.y - lt_outside.y;
    const sortPath = getPolyPointBySort(outside);
    const svgPathWithBorder = sortPath.map(p => ({
        x: p.x - left,
        y: p.y - top,
    })) as [Point, Point, Point, Point];
    const posStyle = {
        left: lt.x,
        top: lt.y,
    }
    const sizeStyle = {
        width: rb.x - lt.x,
        height: rb.y - lt.y,
    }
    const posStyleWithBorder = {
        left,
        top,
    }
    const sizeStyleWithBorder = {
        width,
        height,
    }

    const svgPath = grid.path
        .map(p => ({ x: p.x - left, y: p.y - top })) as [Point, Point, Point, Point]

    return {
        posStyle,
        sizeStyle,
        posStyleWithBorder,
        sizeStyleWithBorder,
        svgPath,
        svgPathWithBorder,
        imgStyle: {
            left: posStyle.left - posStyleWithBorder.left,
            top: posStyle.top - posStyleWithBorder.top,
            ...sizeStyle
        }
    }
}

/**
 * 从grid配置获取对应样式（容器位置样式，容器形状样式，容器大小样式，边框svg样式）
 * @param CanvasGridConfig
 * @returns GridStyle
 */
export function getGridStyle(grid: CanvasGridConfig): GridStyle {
    if (grid.type === 'rect') {
        return getRectGridStyle(grid);
    } else if (grid.type === 'poly') {
        return getPolyGridStyle(grid);
    }
    throw new Error("getGridStyle Unknown Type");
}

/**
 * 将canvas的配置转化为comic的配置
 * @param CanvasComicConfig
 * @returns ComicConfig
 */
export function getComicConfigFromCanvas(canvasComicConfig: CanvasComicConfig): ComicConfig | null {
    if (!canvasComicConfig) {
        return null;
    }
    const result = {
        pages: []
    } as ComicConfig
    for (let i = 0; i < canvasComicConfig.pages.length; i++) {
        const canvasPageConfig = canvasComicConfig.pages[i];
        const pageConfig = {
            height: 0,
            grids: []
        } as PageConfig;
        if (i == 0) {
            pageConfig.logo = "/logo.jpg";
        }
        for (let j = 0; j < canvasPageConfig.grids.length; j++) {
            const canvasGrid = canvasPageConfig.grids[j];
            getAllGridConfig(canvasGrid, pageConfig.grids);
        }
        result.pages.push(pageConfig);
    }
    return result;

    function getAllGridConfig(canvasGrid: CanvasGridConfig, allGrids: GridConfig[]) {
        if (isGridSplited(canvasGrid)) {
            for (let i = 0; i < canvasGrid.splitResult!.length; i++) {
                const grid_ = canvasGrid.splitResult![i];
                getAllGridConfig(grid_, allGrids)
            }
        } else {
            let grid = {} as GridConfig;
            if (canvasGrid.type === "rect") {
                grid = {
                    type: "rect",
                    lt_x: canvasGrid.lt_x,
                    lt_y: canvasGrid.lt_y,
                    rb_x: canvasGrid.rb_x,
                    rb_y: canvasGrid.rb_y,
                } as RectGridConfig;
            } else {
                grid = {
                    type: "poly",
                    path: canvasGrid.path,
                } as PolyGridConfig;
            }
            if (canvasGrid.content) {
                grid.content = {
                    url: canvasGrid.content.url
                }
            }
            allGrids.push(grid);
        }
    }
}
