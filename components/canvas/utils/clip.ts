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
 * 用一条直线将多边形分割成两个多边形
 * @param polygon 输入多边形的顶点数组
 * @param line 分割线 [起点, 终点]
 * @returns [左侧多边形, 右侧多边形] 或 null（如果直线不穿过多边形）
 */
export function splitPolygonByLine(
  polygon: Point[],
  line: [Point, Point],
): [Point[], Point[]] | null {
  const [lineStart, lineEnd] = line

  // 裁剪得到左侧多边形
  const leftPolygon = sutherlandHodgmanClip(polygon, lineStart, lineEnd)

  // 反转裁剪线方向，裁剪得到右侧多边形
  const rightPolygon = sutherlandHodgmanClip(polygon, lineEnd, lineStart)

  // 如果任一侧为空，说明直线没有真正分割多边形
  if (leftPolygon.length < 3 || rightPolygon.length < 3) {
    return null
  }

  return [leftPolygon, rightPolygon]
}
