import type { CanvasGridConfig } from '../types'
import { useEffect } from 'react'
import { useAdjustComic } from '@/hooks/custom/useAdjustComic'
import { deepCopy } from '@/lib/utils'
import { getGridsBySplit } from '../utils'
import { useDrawLine } from './useDrawLine'

export function useSplit(grid: CanvasGridConfig, isGridFocused: boolean, spaceWidth: number) {
  const { adjustGrid } = useAdjustComic()
  const [startPoint, endPoint, isDrawing] = useDrawLine(isGridFocused)
  const { grids, line } = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], { spaceWidth }) || {}

  useEffect(() => {
    if (!isDrawing && startPoint && endPoint) {
      if (grids) {
        adjustGrid(grid.id, {
          splitLine: deepCopy(line),
          splitResult: deepCopy(grids),
          splitSpaceWidth: spaceWidth,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing])

  return { grids, startPoint, endPoint }
}
