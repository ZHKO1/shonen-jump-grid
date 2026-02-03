import type { Point } from '../utils/types'
import { describe, expect, it } from 'vitest'
import { getPolyGridPoint, getPolyPointBySort, getPolyType } from '../utils/poly'

const BORDER_WIDTH = 4

function comparePoints(actual: Point, expected: Point, digits: number = 5): void {
  expect(actual.x.toFixed(digits)).toBe(expected.x.toFixed(digits))
  expect(actual.y.toFixed(digits)).toBe(expected.y.toFixed(digits))
}

function comparePaths(actual: Point[], expected: Point[], digits: number = 5): void {
  expect(actual).toHaveLength(4)
  expect(expected).toHaveLength(4)
  actual.forEach((point, i) => {
    comparePoints(point, expected[i], digits)
  })
}

describe('getPolyGridPoint', () => {
  describe('基础形状测试', () => {
    describe('horizon type (上下边水平)', () => {
      it('正方形', () => {
        const path: [Point, Point, Point, Point] = [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 100 },
        ]

        expect(getPolyType(path)).toBe('horizon')

        const result = getPolyGridPoint(path, BORDER_WIDTH)

        comparePaths(result.outside, [
          { x: -2, y: -2 },
          { x: 102, y: -2 },
          { x: 102, y: 102 },
          { x: -2, y: 102 },
        ])

        comparePaths(result.inside, [
          { x: 2, y: 2 },
          { x: 98, y: 2 },
          { x: 98, y: 98 },
          { x: 2, y: 98 },
        ])
      })

      it('矩形', () => {
        const path: [Point, Point, Point, Point] = [
          { x: 10, y: 20 },
          { x: 200, y: 20 },
          { x: 200, y: 80 },
          { x: 10, y: 80 },
        ]

        expect(getPolyType(path)).toBe('horizon')

        const result = getPolyGridPoint(path, BORDER_WIDTH)

        comparePaths(result.outside, [
          { x: 8, y: 18 },
          { x: 202, y: 18 },
          { x: 202, y: 82 },
          { x: 8, y: 82 },
        ])

        comparePaths(result.inside, [
          { x: 12, y: 22 },
          { x: 198, y: 22 },
          { x: 198, y: 78 },
          { x: 12, y: 78 },
        ])
      })

      it('水平平行四边形 (左右倾斜)', () => {
        const path: [Point, Point, Point, Point] = [
          { x: 10, y: 0 },
          { x: 190, y: 0 },
          { x: 200, y: 100 },
          { x: 0, y: 100 },
        ]

        expect(getPolyType(path)).toBe('horizon')

        const result = getPolyGridPoint(path, BORDER_WIDTH)

        comparePaths(result.outside, [
          { x: 8.19002, y: -2 },
          { x: 191.80998, y: -2 },
          { x: 202.20998, y: 102 },
          { x: -2.20998, y: 102 },
        ])

        comparePaths(result.inside, [
          { x: 11.80998, y: 2 },
          { x: 188.19002, y: 2 },
          { x: 197.79002, y: 98 },
          { x: 2.20998, y: 98 },
        ])
      })

      it('陡峭水平平行四边形', () => {
        const path: [Point, Point, Point, Point] = [
          { x: 20, y: 0 },
          { x: 180, y: 0 },
          { x: 200, y: 100 },
          { x: 0, y: 100 },
        ]

        expect(getPolyType(path)).toBe('horizon')

        const result = getPolyGridPoint(path, BORDER_WIDTH)

        comparePaths(result.outside, [
          { x: 18.36039, y: -2 },
          { x: 181.63961, y: -2 },
          { x: 202.43961, y: 102 },
          { x: -2.43961, y: 102 },
        ])

        comparePaths(result.inside, [
          { x: 21.63961, y: 2 },
          { x: 178.36039, y: 2 },
          { x: 197.56039, y: 98 },
          { x: 2.43961, y: 98 },
        ])
      })
    })

    describe('vertical type (左右边垂直)', () => {
      it('垂直平行四边形 (上下倾斜)', () => {
        const path: [Point, Point, Point, Point] = [
          { x: 0, y: 10 },
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 110 },
        ]

        expect(getPolyType(path)).toBe('vertical')

        const result = getPolyGridPoint(path, BORDER_WIDTH)

        comparePaths(result.outside, [
          { x: -2, y: 8.19002 },
          { x: 102, y: -2.20998 },
          { x: 102, y: 101.80998 },
          { x: -2, y: 112.20998 },
        ])

        comparePaths(result.inside, [
          { x: 2, y: 11.80998 },
          { x: 98, y: 2.20998 },
          { x: 98, y: 98.19002 },
          { x: 2, y: 107.79002 },
        ])
      })

      it('平缓垂直平行四边形', () => {
        const path: [Point, Point, Point, Point] = [
          { x: 0, y: 0 },
          { x: 100, y: 20 },
          { x: 100, y: 80 },
          { x: 0, y: 100 },
        ]

        expect(getPolyType(path)).toBe('vertical')

        const result = getPolyGridPoint(path, BORDER_WIDTH)

        comparePaths(result.outside, [
          { x: -2, y: -2.43961 },
          { x: 102, y: 18.36039 },
          { x: 102, y: 81.63961 },
          { x: -2, y: 102.43961 },
        ])

        comparePaths(result.inside, [
          { x: 2, y: 2.43961 },
          { x: 98, y: 21.63961 },
          { x: 98, y: 78.36039 },
          { x: 2, y: 97.56039 },
        ])
      })
    })
  })

  describe('grid.json 真实数据测试', () => {
    interface TestCase {
      name: string
      path: [Point, Point, Point, Point]
      polyType: 'horizon' | 'vertical'
      outside: Point[]
      inside: Point[]
    }

    const testCases: TestCase[] = [
      {
        name: 'poly-from-json-0_1_1_0_1_0',
        path: getPolyPointBySort([
          { x: 205.3390178819046, y: 396.17723296931587 },
          { x: 440.94851675653524, y: 396.17723296931587 },
          { x: 485.0844857615282, y: 525.9687019476362 },
          { x: 205.3390178819046, y: 525.9687019476362 },
        ]),
        polyType: 'horizon',
        outside: [
          { x: 203.33902, y: 394.17723 },
          { x: 442.38088, y: 394.17723 },
          { x: 487.87707, y: 527.9687 },
          { x: 203.33902, y: 527.9687 },
        ],
        inside: [
          { x: 207.33902, y: 398.17723 },
          { x: 439.51615, y: 398.17723 },
          { x: 482.29191, y: 523.9687 },
          { x: 207.33902, y: 523.9687 },
        ],
      },
      {
        name: 'poly-from-json-0_1_1_0_1_1',
        path: getPolyPointBySort([
          { x: 453.62335731076104, y: 396.17723296931587 },
          { x: 702, y: 396.17723296931587 },
          { x: 702, y: 525.9687019476362 },
          { x: 497.7593263157539, y: 525.9687019476362 },
        ]),
        polyType: 'horizon',
        outside: [
          { x: 450.83078, y: 394.17723 },
          { x: 704, y: 394.17723 },
          { x: 704, y: 527.9687 },
          { x: 496.32696, y: 527.9687 },
        ],
        inside: [
          { x: 456.41594, y: 398.17723 },
          { x: 700, y: 398.17723 },
          { x: 700, y: 523.9687 },
          { x: 499.19169, y: 523.9687 },
        ],
      },
      {
        name: 'poly-from-json-0_1_1_1_0_0_0',
        path: getPolyPointBySort([
          { x: 18, y: 551.9687019476362 },
          { x: 185.50143652912436, y: 551.9687019476362 },
          { x: 310.6623945339697, y: 858.5097247450025 },
          { x: 18, y: 858.5097247450025 },
        ]),
        polyType: 'horizon',
        outside: [
          { x: 16, y: 549.9687 },
          { x: 186.84512, y: 549.9687 },
          { x: 313.63928, y: 860.50972 },
          { x: 16, y: 860.50972 },
        ],
        inside: [
          { x: 20, y: 553.9687 },
          { x: 184.15775, y: 553.9687 },
          { x: 307.68551, y: 856.50972 },
          { x: 20, y: 856.50972 },
        ],
      },
      {
        name: 'poly-from-json-page4_0_0_0_0',
        path: getPolyPointBySort([
          { x: 18, y: 18 },
          { x: 274.6606193898255, y: 18 },
          { x: 274.6606193898255, y: 273.9108911610666 },
          { x: 18, y: 248.0791073250125 },
        ]),
        polyType: 'vertical',
        outside: [
          { x: 16, y: 16 },
          { x: 276.66062, y: 16 },
          { x: 276.66062, y: 276.12229 },
          { x: 16, y: 249.88792 },
        ],
        inside: [
          { x: 20, y: 20 },
          { x: 272.66062, y: 20 },
          { x: 272.66062, y: 271.6995 },
          { x: 20, y: 246.27029 },
        ],
      },
      {
        name: 'poly-from-json-page5_0_0_0',
        path: getPolyPointBySort([
          { x: 18, y: 18 },
          { x: 543.1959787189121, y: 18 },
          { x: 485.14564740430086, y: 519.4666389109557 },
          { x: 18, y: 519.4666389109557 },
        ]),
        polyType: 'horizon',
        outside: [
          { x: 16, y: 16 },
          { x: 545.44086, y: 16 },
          { x: 486.92748, y: 521.46664 },
          { x: 16, y: 521.46664 },
        ],
        inside: [
          { x: 20, y: 20 },
          { x: 540.9511, y: 20 },
          { x: 483.36381, y: 517.46664 },
          { x: 20, y: 517.46664 },
        ],
      },
      {
        name: 'poly-from-json-page7_0_0_1_1_0',
        path: getPolyPointBySort([
          { x: 605.9826355710933, y: 18 },
          { x: 702, y: 18 },
          { x: 702, y: 246.19682667786594 },
          { x: 562.2188605917765, y: 246.19682667786594 },
        ]),
        polyType: 'horizon',
        outside: [
          { x: 604.32975, y: 16 },
          { x: 704, y: 16 },
          { x: 704, y: 248.19683 },
          { x: 559.79885, y: 248.19683 },
        ],
        inside: [
          { x: 607.63552, y: 20 },
          { x: 700, y: 20 },
          { x: 700, y: 244.19683 },
          { x: 564.63887, y: 244.19683 },
        ],
      },
    ]

    testCases.forEach((testCase) => {
      it(testCase.name, () => {
        expect(getPolyType(testCase.path)).toBe(testCase.polyType)

        const result = getPolyGridPoint(testCase.path, BORDER_WIDTH)

        comparePaths(result.outside, testCase.outside)
        comparePaths(result.inside, testCase.inside)
      })
    })
  })

  describe('边界值测试', () => {
    it('borderWidth 为 0 时，inside 和 outside 应该相同', () => {
      const path: [Point, Point, Point, Point] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ]

      const result = getPolyGridPoint(path, 0)

      comparePaths(result.outside, path)
      comparePaths(result.inside, path)
    })

    it('最小尺寸的矩形', () => {
      const path: [Point, Point, Point, Point] = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ]

      const result = getPolyGridPoint(path, BORDER_WIDTH)

      expect(result.outside[0].x).toBeLessThan(path[0].x)
      expect(result.outside[0].y).toBeLessThan(path[0].y)
      expect(result.inside[0].x).toBeGreaterThan(path[0].x)
      expect(result.inside[0].y).toBeGreaterThan(path[0].y)
    })
  })

  describe('inside/outside 关系验证', () => {
    it('outside 点应该比 inside 点更靠外', () => {
      const path: [Point, Point, Point, Point] = [
        { x: 10, y: 0 },
        { x: 190, y: 0 },
        { x: 200, y: 100 },
        { x: 0, y: 100 },
      ]

      const result = getPolyGridPoint(path, BORDER_WIDTH)

      const outsideDistance = result.outside.reduce((sum, p) => sum + Math.abs(p.x - path[0].x) + Math.abs(p.y - path[0].y), 0)
      const insideDistance = result.inside.reduce((sum, p) => sum + Math.abs(p.x - path[0].x) + Math.abs(p.y - path[0].y), 0)

      expect(outsideDistance).toBeGreaterThan(insideDistance)
    })

    it('outside 和 inside 都应该有 4 个点', () => {
      const path: [Point, Point, Point, Point] = [
        { x: 0, y: 10 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 110 },
      ]

      const result = getPolyGridPoint(path, BORDER_WIDTH)

      expect(result.outside).toHaveLength(4)
      expect(result.inside).toHaveLength(4)
    })
  })
})
