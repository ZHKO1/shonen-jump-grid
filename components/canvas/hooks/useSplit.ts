import type { CanvasGridConfig } from '../types'
import { useEffect } from 'react'
import { useAdjustComic } from '@/hooks/custom/useAdjustComic'
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
          splitLine: JSON.parse(JSON.stringify(line)),
          splitResult: JSON.parse(JSON.stringify(grids)),
          splitSpaceWidth: spaceWidth,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing])

  return { grids, startPoint, endPoint }
}
