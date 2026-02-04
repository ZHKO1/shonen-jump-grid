import type { CanvasGridConfig, CanvasPolyGridConfig, CanvasRectGridConfig, Point } from '../types'
import { describe, expect, it } from 'vitest'
import gridJsonData from '../../../public/demo/onepiece/grid.json'
import { getGridsBySplit } from '../utils'
import splitCase1Data from './splitCase1.json'

const DEFAULT_OPTIONS = { spaceWidth: 12, recursion: false }

function normalize(num: number, digits: number = 5): number {
  return Number.parseFloat(num.toFixed(digits))
}

function gridsMatch(gridA: CanvasGridConfig, gridB: CanvasGridConfig): boolean {
  if (gridA.type !== gridB.type)
    return false

  if (gridA.type === 'rect' && gridB.type === 'rect') {
    return (
      normalize(gridA.lt_x) === normalize(gridB.lt_x)
      && normalize(gridA.lt_y) === normalize(gridB.lt_y)
      && normalize(gridA.rb_x) === normalize(gridB.rb_x)
      && normalize(gridA.rb_y) === normalize(gridB.rb_y)
    )
  }

  if (gridA.type === 'poly' && gridB.type === 'poly') {
    if (gridA.path.length !== gridB.path.length)
      return false
    return gridA.path.every((p, i) =>
      normalize(p.x) === normalize(gridB.path[i].x)
      && normalize(p.y) === normalize(gridB.path[i].y),
    )
  }

  return false
}

function expectGridsMatch(actual: [CanvasGridConfig, CanvasGridConfig], expected: [CanvasGridConfig, CanvasGridConfig]): void {
  const [actual0, actual1] = actual
  const [expected0, expected1] = expected

  const isNormalOrder = gridsMatch(actual0, expected0) && gridsMatch(actual1, expected1)
  const isReverseOrder = gridsMatch(actual0, expected1) && gridsMatch(actual1, expected0)

  expect(isNormalOrder || isReverseOrder).toBe(true)
}

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
  allowUndefinedSpaceWidth?: boolean,
): void {
  const hasSpaceWidth = allowUndefinedSpaceWidth
    ? grid.splitSpaceWidth !== undefined
    : grid.splitSpaceWidth

  if (grid.splitLine && grid.splitResult && hasSpaceWidth) {
    const cleanGrid = { ...grid }
    delete cleanGrid.splitLine
    delete cleanGrid.splitResult
    delete cleanGrid.splitSpaceWidth

    cases.push({
      pageId,
      gridId: grid.id,
      grid: cleanGrid,
      line: grid.splitLine,
      spaceWidth: grid.splitSpaceWidth!,
      expectedResult: grid.splitResult as [CanvasGridConfig, CanvasGridConfig],
    })

    grid.splitResult.forEach((subGrid) => {
      collectSplitCases(subGrid, pageId, cases, allowUndefinedSpaceWidth)
    })
  }
}

function runSnapshotTests(
  describeName: string,
  dataSource: { pages: any[] },
  testNameSuffix: string,
  allowUndefinedSpaceWidth?: boolean,
): void {
  describe(describeName, () => {
    const cases: SplitTestCase[] = []
    dataSource.pages.forEach((page) => {
      page.grids.forEach((grid: CanvasGridConfig) => {
        collectSplitCases(grid, page.id, cases, allowUndefinedSpaceWidth)
      })
    })

    cases.forEach((testCase, index) => {
      it(`[${index + 1}/${cases.length}] ${testCase.pageId}:${testCase.gridId} - ${testCase.grid.type} ${testNameSuffix}`, () => {
        const result = getGridsBySplit(testCase.grid, testCase.line, {
          spaceWidth: testCase.spaceWidth,
          recursion: false,
        })

        expect(result).not.toBeNull()
        expect(result!.grids).toHaveLength(2)

        expectGridsMatch(result!.grids, testCase.expectedResult)
      })
    })

    it(`总计测试了 ${cases.length} 个分割场景`, () => {
      expect(cases.length).toBeGreaterThan(0)
    })
  })
}

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

      expectGridsMatch(result!.grids, [
        { type: 'rect', lt_x: 0, lt_y: 0, rb_x: 100, rb_y: 44, id: 'top' },
        { type: 'rect', lt_x: 0, lt_y: 56, rb_x: 100, rb_y: 100, id: 'bottom' },
      ])
    })

    it('垂直分割：rect + 垂直线 -> 左右两个 rect', () => {
      const line: [Point, Point] = [{ x: 50, y: 0 }, { x: 50, y: 100 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      expectGridsMatch(result!.grids, [
        { type: 'rect', lt_x: 0, lt_y: 0, rb_x: 44, rb_y: 100, id: 'left' },
        { type: 'rect', lt_x: 56, lt_y: 0, rb_x: 100, rb_y: 100, id: 'right' },
      ])
    })

    it('斜线分割：rect + 斜线 -> 两个 poly', () => {
      const line: [Point, Point] = [{ x: 0, y: 30 }, { x: 100, y: 70 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      const [top, bottom] = result!.grids
      expect(top.type).toBe('poly')
      expect(bottom.type).toBe('poly')
      expect((top as CanvasPolyGridConfig).path).toHaveLength(4)
      expect((bottom as CanvasPolyGridConfig).path).toHaveLength(4)
    })

    it('斜线分割（垂直方向）：rect + 垂直倾斜线 -> 两个 poly', () => {
      const line: [Point, Point] = [{ x: 30, y: 0 }, { x: 70, y: 100 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)

      expect(result!.grids.every(g => g.type === 'poly')).toBe(true)
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
      expect(result!.grids.every(g => g.type === 'poly')).toBe(true)
    })

    it('horizon poly + 垂直线', () => {
      const line: [Point, Point] = [{ x: 50, y: 0 }, { x: 50, y: 100 }]
      const result = getGridsBySplit(horizonPoly, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)
      expect(result!.grids.every(g => g.type === 'poly')).toBe(true)
    })

    it('vertical poly + 水平线', () => {
      const line: [Point, Point] = [{ x: 0, y: 50 }, { x: 100, y: 50 }]
      const result = getGridsBySplit(verticalPoly, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)
      expect(result!.grids.every(g => g.type === 'poly')).toBe(true)
    })

    it('vertical poly + 垂直线', () => {
      const line: [Point, Point] = [{ x: 50, y: 0 }, { x: 50, y: 100 }]
      const result = getGridsBySplit(verticalPoly, line, DEFAULT_OPTIONS)

      expect(result).not.toBeNull()
      expect(result!.grids).toHaveLength(2)
      expect(result!.grids.every(g => g.type === 'poly')).toBe(true)
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
      const line: [Point, Point] = [{ x: 0, y: -50 }, { x: 100, y: -50 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).toBeNull()
    })

    it('分割线只触及边界（不穿过） -> null', () => {
      const line: [Point, Point] = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).toBeNull()
    })

    it('分割线斜向但不完全穿过 -> null', () => {
      const line: [Point, Point] = [{ x: -50, y: 50 }, { x: 50, y: -50 }]
      const result = getGridsBySplit(baseRect, line, DEFAULT_OPTIONS)

      expect(result).toBeNull()
    })
  })

  runSnapshotTests('快照测试：真实数据场景 (grid.json)', gridJsonData as any, '分割')
  runSnapshotTests('快照测试：复杂嵌套分割场景 (splitCase1.json)', splitCase1Data as any, '复杂分割', true)

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
