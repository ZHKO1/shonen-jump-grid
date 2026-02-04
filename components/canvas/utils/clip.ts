import type { Point } from '@/components/comic/core/type'

/**
 * 计算点相对于有向直线的位置（使用叉积）
 * @param lineStart 直线起点
 * @param lineEnd 直线终点
 * @param point 待判断的点
 * @returns 叉积结果：> 0 表示点在直线左侧，< 0 表示在右侧，= 0 表示在直线上
 */
export function crossProduct(lineStart: Point, lineEnd: Point, point: Point): number {
  return (lineEnd.x - lineStart.x) * (point.y - lineStart.y)
    - (lineEnd.y - lineStart.y) * (point.x - lineStart.x)
}

/**
 * 判断点是否在直线的"内侧"（左侧或直线上）
 * @param point 待判断的点
 * @param lineStart 直线起点
 * @param lineEnd 直线终点
 * @returns true 表示点在左侧或直线上
 */
export function isInside(point: Point, lineStart: Point, lineEnd: Point): boolean {
  return crossProduct(lineStart, lineEnd, point) >= 0
}

/**
 * 计算两条线段的交点
 * @param p1 线段1起点
 * @param p2 线段1终点
 * @param lineStart 裁剪线起点
 * @param lineEnd 裁剪线终点
 * @returns 交点坐标
 */
export function computeIntersection(
  p1: Point,
  p2: Point,
  lineStart: Point,
  lineEnd: Point,
): Point {
  const { x: x1, y: y1 } = p1
  const { x: x2, y: y2 } = p2
  const { x: x3, y: y3 } = lineStart
  const { x: x4, y: y4 } = lineEnd

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

  // 如果分母为0，说明线段平行（理论上不会发生，因为我们只在有交点时调用）
  if (Math.abs(denom) < 1e-10) {
    return p1
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom

  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1),
  }
}

/**
 * 重新排序多边形点，从左上角开始，顺时针排列
 */
export function reorderPolygonClockwise(points: Point[]): Point[] {
  if (points.length <= 3)
    return points

  const topLeftIndex = points.reduce((minIdx, p, i, arr) => {
    if (p.y < arr[minIdx].y - 1e-10)
      return i
    if (Math.abs(p.y - arr[minIdx].y) < 1e-10 && p.x < arr[minIdx].x)
      return i
    return minIdx
  }, 0)

  if (topLeftIndex === 0)
    return points

  return points.slice(topLeftIndex).concat(points.slice(0, topLeftIndex))
}

/**
 * Sutherland-Hodgman 多边形裁剪算法
 * 用一条无限延长的直线裁剪多边形，返回直线左侧（或线上）的多边形部分
 * @param polygon 输入多边形的顶点数组
 * @param lineStart 裁剪线起点
 * @param lineEnd 裁剪线终点
 * @returns 裁剪后的多边形顶点数组
 */
export function sutherlandHodgmanClip(
  polygon: Point[],
  lineStart: Point,
  lineEnd: Point,
): Point[] {
  if (polygon.length === 0)
    return []

  const outputList: Point[] = []
  let prev = polygon[polygon.length - 1]
  let prevInside = isInside(prev, lineStart, lineEnd)

  for (const current of polygon) {
    const currentInside = isInside(current, lineStart, lineEnd)

    if (currentInside) {
      if (!prevInside) {
        outputList.push(computeIntersection(prev, current, lineStart, lineEnd))
      }
      outputList.push(current)
    }
    else if (prevInside) {
      outputList.push(computeIntersection(prev, current, lineStart, lineEnd))
    }

    prev = current
    prevInside = currentInside
  }

  return reorderPolygonClockwise(outputList)
}

/**
 * 计算线段与多边形的两个交点
 * @param polygon 多边形顶点数组
 * @param line 分割线 [起点, 终点]
 * @returns [交点1, 交点2] 或 null（如果不相交）
 */
export function getLinePolygonIntersections(
  polygon: Point[],
  line: [Point, Point],
): [Point, Point] | null {
  const intersections: Point[] = []

  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i]
    const p2 = polygon[(i + 1) % polygon.length]

    const d1 = crossProduct(line[0], line[1], p1)
    const d2 = crossProduct(line[0], line[1], p2)

    if (d1 * d2 < 0) {
      const intersection = computeIntersection(p1, p2, line[0], line[1])
      intersections.push(intersection)
    }
    else if (Math.abs(d1) < 1e-10) {
      intersections.push(p1)
    }
  }

  if (intersections.length >= 2) {
    return [intersections[0], intersections[1]]
  }
  return null
}

/**
 * 用一条直线将多边形分割成两个多边形
 * @param polygon 输入多边形的顶点数组
 * @param line 分割线 [起点, 终点]
 * @param spaceWidth 分割空间宽度（可选）
 * @returns { intersections: [Point, Point] | null, polygons: [Point[], Point[]] | null }
 */
export function splitPolygonByLine(
  polygon: Point[],
  line: [Point, Point],
  spaceWidth?: number,
): { intersections: [Point, Point] | null, polygons: [Point[], Point[]] | null } {
  const [lineStart, lineEnd] = line

  let leftPolygon: Point[]
  let rightPolygon: Point[]

  if (spaceWidth && spaceWidth > 0) {
    const dx = lineEnd.x - lineStart.x
    const dy = lineEnd.y - lineStart.y
    const length = Math.sqrt(dx * dx + dy * dy)
    if (length === 0)
      return { intersections: null, polygons: null }

    const unitX = -dy / length
    const unitY = dx / length
    const offset = Math.floor(spaceWidth / 2)

    const line1: [Point, Point] = [
      { x: lineStart.x + unitX * offset, y: lineStart.y + unitY * offset },
      { x: lineEnd.x + unitX * offset, y: lineEnd.y + unitY * offset },
    ]
    const line2: [Point, Point] = [
      { x: lineStart.x - unitX * offset, y: lineStart.y - unitY * offset },
      { x: lineEnd.x - unitX * offset, y: lineEnd.y - unitY * offset },
    ]

    leftPolygon = sutherlandHodgmanClip(polygon, line2[1], line2[0])
    rightPolygon = sutherlandHodgmanClip(polygon, line1[0], line1[1])
  }
  else {
    leftPolygon = sutherlandHodgmanClip(polygon, lineStart, lineEnd)
    rightPolygon = sutherlandHodgmanClip(polygon, lineEnd, lineStart)
  }

  if (leftPolygon.length < 3 || rightPolygon.length < 3) {
    return { intersections: null, polygons: null }
  }

  const intersections = getLinePolygonIntersections(polygon, line)
  return { intersections, polygons: [leftPolygon, rightPolygon] }
}
