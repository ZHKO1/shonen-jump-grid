import type { CanvasGridConfig, CanvasPolyGridConfig, CanvasRectGridConfig, Point } from '../types'
import { describe, expect, it } from 'vitest'
import gridJsonData from '../../../public/demo/onepiece/grid.json'
import { getGridsBySplit } from '../utils'

const DEFAULT_OPTIONS = { spaceWidth: 12, recursion: false }

describe('getGridsBySplit', () => {
  describe('rect 分割', () => {
    const baseRect: CanvasRectGridConfig = {
      type: 'rect',
      lt_x: 0,
      lt_y: 0,
      rb_x: 100,
      rb_y: 100,
      id: 'test-rect',
    }

    it('水平分割：rect + 水平线 -> 上下两个 rect', () => {
      const line: [Point, Point] = [{ x: 0, y: 50 }, { x: 100, y: 50 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      const [top, bottom] = result!.grids
      expect(top.type).toBe('rect')
      expect(bottom.type).toBe('rect')

      // 上半部分
      expect((top as CanvasRectGridConfig).lt_y).toBe(0)
      expect((top as CanvasRectGridConfig).rb_y).toBe(50 - 6) // 50 - spaceWidth/2

      // 下半部分
      expect((bottom as CanvasRectGridConfig).lt_y).toBe(50 + 6) // 50 + spaceWidth/2
      expect((bottom as CanvasRectGridConfig).rb_y).toBe(100)
    })

    it('垂直分割：rect + 垂直线 -> 左右两个 rect', () => {
      const line: [Point, Point] = [{ x: 50, y: 0 }, { x: 50, y: 100 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      const [left, right] = result!.grids
      expect(left.type).toBe('rect')
      expect(right.type).toBe('rect')

      // 左半部分
      expect((left as CanvasRectGridConfig).lt_x).toBe(0)
      expect((left as CanvasRectGridConfig).rb_x).toBe(50 - 6)

      // 右半部分
      expect((right as CanvasRectGridConfig).lt_x).toBe(50 + 6)
      expect((right as CanvasRectGridConfig).rb_x).toBe(100)
    })

    it('斜线分割：rect + 斜线 -> 两个 poly', () => {
      // 从左边 y=30 到右边 y=70 的斜线
      const line: [Point, Point] = [{ x: 0, y: 30 }, { x: 100, y: 70 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      const [top, bottom] = result!.grids
      // 斜线分割应该生成两个 poly
      expect(top.type).toBe('poly')
      expect(bottom.type).toBe('poly')

      // 验证 poly 有 4 个点
      expect((top as CanvasPolyGridConfig).path).toHaveLength(4)
      expect((bottom as CanvasPolyGridConfig).path).toHaveLength(4)
    })

    it('斜线分割（垂直方向）：rect + 垂直倾斜线 -> 两个 poly', () => {
      // 从上边 x=30 到下边 x=70 的斜线
      const line: [Point, Point] = [{ x: 30, y: 0 }, { x: 70, y: 100 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      const [left, right] = result!.grids
      expect(left.type).toBe('poly')
      expect(right.type).toBe('poly')
    })
  })

  describe('poly 分割', () => {
    // horizon poly: 上下边水平，左右边可能倾斜
    const horizonPoly: CanvasPolyGridConfig = {
      type: 'poly',
      path: [
        { x: 10, y: 0 }, // 左上
        { x: 90, y: 0 }, // 右上
        { x: 100, y: 100 }, // 右下
        { x: 0, y: 100 }, // 左下
      ],
      id: 'test-horizon-poly',
    }

    // vertical poly: 左右边垂直，上下边可能倾斜
    const verticalPoly: CanvasPolyGridConfig = {
      type: 'poly',
      path: [
        { x: 0, y: 10 }, // 左上
        { x: 100, y: 0 }, // 右上
        { x: 100, y: 100 }, // 右下
        { x: 0, y: 90 }, // 左下
      ],
      id: 'test-vertical-poly',
    }

    it('horizon poly + 水平线', () => {
      const line: [Point, Point] = [{ x: 0, y: 50 }, { x: 100, y: 50 }]
      const result = getGridsBySplit(horizonPoly, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      const [top, bottom] = result!.grids
      expect(top.type).toBe('poly')
      expect(bottom.type).toBe('poly')
    })

    it('horizon poly + 垂直线', () => {
      const line: [Point, Point] = [{ x: 50, y: 0 }, { x: 50, y: 100 }]
      const result = getGridsBySplit(horizonPoly, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      const [left, right] = result!.grids
      expect(left.type).toBe('poly')
      expect(right.type).toBe('poly')
    })

    it('vertical poly + 水平线', () => {
      const line: [Point, Point] = [{ x: 0, y: 50 }, { x: 100, y: 50 }]
      const result = getGridsBySplit(verticalPoly, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      const [top, bottom] = result!.grids
      expect(top.type).toBe('poly')
      expect(bottom.type).toBe('poly')
    })

    it('vertical poly + 垂直线', () => {
      const line: [Point, Point] = [{ x: 50, y: 0 }, { x: 50, y: 100 }]
      const result = getGridsBySplit(verticalPoly, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)
    })
  })

  describe('边界情况', () => {
    const baseRect: CanvasRectGridConfig = {
      type: 'rect',
      lt_x: 0,
      lt_y: 0,
      rb_x: 100,
      rb_y: 100,
      id: 'test-rect',
    }

    it('分割线不穿过格子（在格子外部） -> null', () => {
      // 分割线完全在格子上方
      const line: [Point, Point] = [{ x: 0, y: -50 }, { x: 100, y: -50 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).toBeNull()
    })

    it('分割线只触及边界（不穿过） -> null', () => {
      // 分割线在格子顶边
      const line: [Point, Point] = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).toBeNull()
    })

    it('分割线斜向但不完全穿过 -> null', () => {
      // 斜线只穿过一边
      const line: [Point, Point] = [{ x: -50, y: 50 }, { x: 50, y: -50 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).toBeNull()
    })
  })

  describe('快照测试：真实数据场景 (grid.json)', () => {
    // 递归收集所有带 splitLine 的 grid
    interface SplitTestCase {
      pageId: string
      gridId: string | number
      grid: CanvasGridConfig
      line: [Point, Point]
      spaceWidth: number
      expectedResult: [CanvasGridConfig, CanvasGridConfig]
    }

    function collectSplitCases(
      grid: CanvasGridConfig,
      pageId: string,
      cases: SplitTestCase[],
    ): void {
      if (grid.splitLine && grid.splitResult && grid.splitSpaceWidth) {
        // 创建不含 splitLine/splitResult 的纯净 grid 用于测试
        const cleanGrid = { ...grid }
        delete cleanGrid.splitLine
        delete cleanGrid.splitResult
        delete cleanGrid.splitSpaceWidth

        cases.push({
          pageId,
          gridId: grid.id,
          grid: cleanGrid,
          line: grid.splitLine,
          spaceWidth: grid.splitSpaceWidth,
          expectedResult: grid.splitResult,
        })

        // 递归检查子 grid
        grid.splitResult.forEach((subGrid) => {
          collectSplitCases(subGrid, pageId, cases)
        })
      }
    }

    const allCases: SplitTestCase[] = []
    gridJsonData.pages.forEach((page: any) => {
      page.grids.forEach((grid: CanvasGridConfig) => {
        collectSplitCases(grid, page.id, allCases)
      })
    })

    // 为每个分割场景生成测试
    allCases.forEach((testCase, index) => {
      it(`[${index + 1}/${allCases.length}] ${testCase.pageId}:${testCase.gridId} - ${testCase.grid.type} 分割`, () => {
        const result = getGridsBySplit(testCase.grid, testCase.line, {
          spaceWidth: testCase.spaceWidth,
          recursion: false,
        })

        expect(result).not.toBeNull()
        expect(result!.grids).toHaveLength(2)

        const [actual0, actual1] = result!.grids
        const [expected0, expected1] = testCase.expectedResult

        // 对比第一个子格子
        expect(actual0.type).toBe(expected0.type)
        if (actual0.type === 'rect' && expected0.type === 'rect') {
          compareByFixed(actual0.lt_x, expected0.lt_x)
          compareByFixed(actual0.lt_y, expected0.lt_y)
          compareByFixed(actual0.rb_x, expected0.rb_x)
          compareByFixed(actual0.rb_y, expected0.rb_y)
        }
        else if (actual0.type === 'poly' && expected0.type === 'poly') {
          expect(actual0.path).toHaveLength(expected0.path.length)
          actual0.path.forEach((point, i) => {
            compareByFixed(point.x, expected0.path[i].x)
            compareByFixed(point.y, expected0.path[i].y)
          })
        }

        // 对比第二个子格子
        expect(actual1.type).toBe(expected1.type)
        if (actual1.type === 'rect' && expected1.type === 'rect') {
          compareByFixed(actual1.lt_x, expected1.lt_x)
          compareByFixed(actual1.lt_y, expected1.lt_y)
          compareByFixed(actual1.rb_x, expected1.rb_x)
          compareByFixed(actual1.rb_y, expected1.rb_y)
        }
        else if (actual1.type === 'poly' && expected1.type === 'poly') {
          expect(actual1.path).toHaveLength(expected1.path.length)
          actual1.path.forEach((point, i) => {
            compareByFixed(point.x, expected1.path[i].x)
            compareByFixed(point.y, expected1.path[i].y)
          })
        }
      })

      function compareByFixed(actual: number, expected: number, digits: number = 5): void {
        expect(actual.toFixed(digits)).toBe(expected.toFixed(digits))
      }
    })

    it(`总计测试了 ${allCases.length} 个分割场景`, () => {
      expect(allCases.length).toBeGreaterThan(0)
    })
  })

  describe('recursion 选项测试', () => {
    it('recursion=true 时应递归处理已有分割', () => {
      // 创建一个已经分割过的 grid
      const splitGrid: CanvasGridConfig = {
        type: 'rect',
        lt_x: 0,
        lt_y: 0,
        rb_x: 100,
        rb_y: 100,
        id: 'split-grid',
        splitLine: [{ x: 0, y: 50 }, { x: 100, y: 50 }],
        splitResult: [
          { type: 'rect', lt_x: 0, lt_y: 0, rb_x: 100, rb_y: 44, id: 'split-grid_0' },
          { type: 'rect', lt_x: 0, lt_y: 56, rb_x: 100, rb_y: 100, id: 'split-grid_1' },
        ],
        splitSpaceWidth: 12,
      }

      // 新的分割线
      const newLine: [Point, Point] = [{ x: 50, y: 0 }, { x: 50, y: 100 }]

      const resultWithRecursion = getGridsBySplit(splitGrid, newLine, { spaceWidth: 12, recursion: true })
      const resultWithoutRecursion = getGridsBySplit(splitGrid, newLine, { spaceWidth: 12, recursion: false })

      expect(resultWithRecursion).not.toBeNull()
      expect(resultWithoutRecursion).not.toBeNull()

      // 两者都应该返回结果，但内部结构可能不同
      expect(resultWithRecursion!.grids).toHaveLength(2)
      expect(resultWithoutRecursion!.grids).toHaveLength(2)
    })
  })
})
