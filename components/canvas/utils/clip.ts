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
  const x1 = p1.x
  const y1 = p1.y
  const x2 = p2.x
  const y2 = p2.y
  const x3 = lineStart.x
  const y3 = lineStart.y
  const x4 = lineEnd.x
  const y4 = lineEnd.y

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

  // 遍历多边形的每条边
  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i]
    const next = polygon[(i + 1) % polygon.length]

    const currentInside = isInside(current, lineStart, lineEnd)
    const nextInside = isInside(next, lineStart, lineEnd)

    if (currentInside) {
      if (nextInside) {
        // Case 1: 两点都在内侧 → 输出 next
        outputList.push(next)
      }
      else {
        // Case 2: current 在内侧，next 在外侧 → 输出交点
        const intersection = computeIntersection(current, next, lineStart, lineEnd)
        outputList.push(intersection)
      }
    }
    else {
      if (nextInside) {
        // Case 3: current 在外侧，next 在内侧 → 输出交点和 next
        const intersection = computeIntersection(current, next, lineStart, lineEnd)
        outputList.push(intersection)
        outputList.push(next)
      }
      // Case 4: 两点都在外侧 → 不输出任何点
    }
  }

  return outputList
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
