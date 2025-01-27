import { ComicConfig, GridConfig, Point, PolyGridPoint, RectGridPoint } from "../grid";

type Pos = "lt" | "rt" | "lb" | "rb";
type PolyType = "horizon" | "vertical";
/**
 * 获取四边形所在容器的四个点的坐标
 * @param path 
 * @param pos 
 * @returns 
 */
export function getPolyContainerPoint(path: [Point, Point, Point, Point], pos: Pos): Point {
    let point = { x: path[0].x, y: path[1].y }
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
    let lt = getPolyContainerPoint(path, 'lt');
    let rb = getPolyContainerPoint(path, 'rb');
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
        let lt_y = getPolyContainerPoint(path, 'lt').y;
        let rb_y = getPolyContainerPoint(path, 'rb').y;
        let topLine = path.filter(point => point.y == lt_y).sort((a, b) => a.x - b.x);
        let bottomLine = path.filter(point => point.y == rb_y).sort((a, b) => b.x - a.x);
        result = [...topLine, ...bottomLine];
    } else {
        let lt_x = getPolyContainerPoint(path, 'lt').x;
        let rb_x = getPolyContainerPoint(path, 'rb').x;
        let leftLine = path.filter(point => point.x == lt_x).sort((a, b) => a.y - b.y);
        let rightLine = path.filter(point => point.x == rb_x).sort((a, b) => a.y - b.y);
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
        let one = (direct ? +1 : -1);
        if (point1.x === point2.x) {
            return point1.x + one * borderWidth;
        }
        let k = (point1.y - point2.y) / (point1.x - point2.x);
        let b = point1.y - k * point1.x;
        let contentB = b - (k > 0 ? one : -1 * one) * Math.sqrt(Math.pow(borderWidth * k, 2) + Math.pow(borderWidth, 2));
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
        let one = (direct ? +1 : -1);
        if (point1.y === point2.y) {
            return point1.y + one * borderWidth;
        }
        let k = (point1.y - point2.y) / (point1.x - point2.x);
        let b = point1.y - k * point1.x;
        let contentB = b + one * Math.sqrt(Math.pow(borderWidth * k, 2) + Math.pow(borderWidth, 2));
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
    return {
        outside: {
            lt_x: lt_x - Math.floor(borderWidth / 2),
            lt_y: lt_y - Math.floor(borderWidth / 2),
            rb_x: rb_x + Math.floor(borderWidth / 2),
            rb_y: rb_y + Math.floor(borderWidth / 2),
        },
        inside: {
            lt_x: lt_x + Math.floor(borderWidth / 2),
            lt_y: lt_y + Math.floor(borderWidth / 2),
            rb_x: rb_x - Math.floor(borderWidth / 2),
            rb_y: rb_y - Math.floor(borderWidth / 2),
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
    let result = [];
    const adjust = Math.floor(borderWidth / 2);
    let lt_x = getPolyContainerPoint(path, 'lt').x;
    let lt_y = getPolyContainerPoint(path, 'lt').y;
    let rb_x = getPolyContainerPoint(path, 'rb').x;
    let rb_y = getPolyContainerPoint(path, 'rb').y;
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
        let getConentLeftLineX = getXFromConentLineFunc(path[0], path[3], adjust, type == "out" ? false : true);
        let getConentRightLineX = getXFromConentLineFunc(path[1], path[2], adjust, type == "out" ? true : false);

        point0 = { x: getConentLeftLineX(lt_y + one * adjust), y: lt_y + one * adjust };
        point1 = { x: getConentRightLineX(lt_y + one * adjust), y: lt_y + one * adjust };
        point2 = { x: getConentRightLineX(rb_y - one * adjust), y: rb_y - one * adjust };
        point3 = { x: getConentLeftLineX(rb_y - one * adjust), y: rb_y - one * adjust };

        return [point0, point1, point2, point3];
    }

    function getPointFromVerticalPoly(type: "out" | "in"): PolyGridPoint["path"] {
        const one = type == "out" ? -1 : 1;
        let getConentTopLineY = getYFromConentLineFunc(path[0], path[1], adjust, type == "out" ? false : true);
        let getConentBottomLineY = getYFromConentLineFunc(path[3], path[2], adjust, type == "out" ? true : false);

        point0 = { y: getConentTopLineY(lt_x + one * adjust), x: lt_x + one * adjust };
        point1 = { y: getConentTopLineY(rb_x - one * adjust), x: rb_x - one * adjust };
        point2 = { y: getConentBottomLineY(rb_x - one * adjust), x: rb_x - one * adjust };
        point3 = { y: getConentBottomLineY(lt_x + one * adjust), x: lt_x + one * adjust };

        return [point0, point1, point2, point3];
    }
}

/**
 * 返回被分割的两个grid
 * @param path 
 * @param borderWidth 
 * @returns 
 */
export function getGridsBySplit(grid: GridConfig, line: [Point, Point], borderWidth: number): [GridConfig, GridConfig] | null {
    if (grid.type === 'rect') {
        let lt_x = grid.lt_x;
        let lt_y = grid.lt_y;
        let rb_x = grid.rb_x;
        let rb_y = grid.rb_y;
        let getLineCrossY = getYFromConentLineFunc(line[0], line[1], 0);
        let leftCrossY = getLineCrossY(lt_x);
        let rightCrossY = getLineCrossY(rb_x);
        let getLineCrossX = getXFromConentLineFunc(line[0], line[1], 0);
        let topCrossX = getLineCrossX(lt_y);
        let bottomCrossX = getLineCrossX(rb_y);
        // 判断是否上下分割
        if ((leftCrossY > lt_y && leftCrossY < rb_y) && (rightCrossY > lt_y && rightCrossY < rb_y)) {
            if (leftCrossY == rightCrossY) {
                return [
                    { type: 'rect', lt_x, lt_y, rb_x, rb_y: leftCrossY - Math.floor(borderWidth / 2), index: 0 },
                    { type: 'rect', lt_x, lt_y: leftCrossY + Math.floor(borderWidth / 2), rb_x, rb_y, index: 1 }
                ]
            } else {
                let getLineCrossY_ceil = getYFromConentLineFunc(line[0], line[1], Math.floor(borderWidth / 2), false);
                let getLineCrossY_floor = getYFromConentLineFunc(line[0], line[1], Math.floor(borderWidth / 2), true);
                let leftCrossY_ceil = getLineCrossY_ceil(lt_x);
                let rightCrossY_ceil = getLineCrossY_ceil(rb_x);
                let leftCrossY_floor = getLineCrossY_floor(lt_x);
                let rightCrossY_floor = getLineCrossY_floor(rb_x);
                return [
                    { type: 'poly', path: [{ x: lt_x, y: lt_y }, { x: rb_x, y: lt_y }, { x: rb_x, y: rightCrossY_ceil }, { x: lt_x, y: leftCrossY_ceil }], index: 0 },
                    { type: 'poly', path: [{ x: lt_x, y: leftCrossY_floor }, { x: rb_x, y: rightCrossY_floor }, { x: rb_x, y: rb_y }, { x: lt_x, y: rb_y }], index: 1 },
                ]
            }
        } else if ((topCrossX > lt_x && topCrossX < rb_x) && (bottomCrossX > lt_x && bottomCrossX < rb_x)) {
            if (topCrossX == bottomCrossX) {
                return [
                    { type: 'rect', lt_x, lt_y, rb_x: topCrossX - Math.floor(borderWidth / 2), rb_y, index: 0 },
                    { type: 'rect', lt_x: topCrossX + Math.floor(borderWidth / 2), lt_y, rb_x, rb_y, index: 1 }
                ]
            } else {
                let getLineCrossX_left = getXFromConentLineFunc(line[0], line[1], Math.floor(borderWidth / 2), false);
                let getLineCrossX_right = getXFromConentLineFunc(line[0], line[1], Math.floor(borderWidth / 2), true);
                let topCrossX_left = getLineCrossX_left(lt_y);
                let bottomCrossX_left = getLineCrossX_left(rb_y);
                let topCrossX_right = getLineCrossX_right(lt_y);
                let bottomCrossX_right = getLineCrossX_right(rb_y);
                return [
                    { type: 'poly', path: [{ x: lt_x, y: lt_y }, { x: topCrossX_left, y: lt_y }, { x: bottomCrossX_left, y: rb_y }, { x: lt_x, y: rb_y }], index: 0 },
                    { type: 'poly', path: [{ x: topCrossX_right, y: lt_y }, { x: rb_x, y: lt_y }, { x: rb_x, y: rb_y }, { x: bottomCrossX_right, y: rb_y }], index: 1 },
                ]
            }
        }
    }
    return null;
}

export function getMaxIndexFromComicConfig(comicConfig: ComicConfig): number {
    return Math.max(Math.max.apply(null, comicConfig.map(grid => grid.index)) || 0);
}
