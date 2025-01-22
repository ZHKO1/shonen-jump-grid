

type Pos = "lt" | "rt" | "lb" | "rb";
export function getPoint(path: { x: number, y: number }[], pos: Pos): { x: number, y: number } | null {
    if (!path.length) {
        return null;
    }
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

type PolyType = "horizon" | "vertical";
export function getPolyType(path: { x: number, y: number }[]): PolyType | null {
    if (!path.length) {
        return null;
    }
    let lt = getPoint(path, 'lt');
    let rb = getPoint(path, 'rb');
    if (!lt || !rb) {
        return null;
    }
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