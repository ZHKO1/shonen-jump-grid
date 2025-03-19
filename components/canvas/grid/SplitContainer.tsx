import type { MouseEventHandler } from 'react'
import type { CanvasGridConfig, Point } from '../types'
import { useEffect, useState } from 'react'
import { useAdjustComic } from '@/hooks/custom/useAdjustComic'
import useComicStatusStore from '@/store'
import { Grid } from '.'
import { getAdjustedPoint, getGridsBySplit } from '../utils'
import SplitLine from './SplitLine'
import SplitPoint from './SplitPoint'

export interface SplitContainerProps { grid: CanvasGridConfig, showAsFocused?: boolean, borderOnly?: boolean }
export default function SplitContainer({ grid }: SplitContainerProps) {
  const { adjustGrid } = useAdjustComic()
  const setCurrentGridId = useComicStatusStore(state => state.setCurrentGridId)
  const resetCurrentGridId = useComicStatusStore(state => state.resetCurrentGridId)
  const { getCurrentGridId } = useComicStatusStore()
  const isFocused = getCurrentGridId() === grid.id

  const splitResult = grid.splitResult!
  const splitLine = grid.splitLine!
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState(splitLine[0])
  const [endPoint, setEndPoint] = useState(splitLine[1])
  useEffect(() => {
    if (!isDrawing) { // 仅在非绘制状态时同步外部变化
      setStartPoint(splitLine[0])
      setEndPoint(splitLine[1])
    }
  }, [splitLine, isDrawing])
  const [middlePoint, setMiddlePoint] = useState({
    x: (startPoint.x + endPoint.x) / 2,
    y: (startPoint.y + endPoint.y) / 2,
  })
  useEffect(() => {
    setMiddlePoint({
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2,
    })
  }, [startPoint, endPoint])

  const defaultSplitResult = { grids: splitResult, line: grid.splitLine }
  const { grids: splitGrids, line } = isDrawing && (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], { spaceWidth: grid.splitSpaceWidth!, recursion: true }) || defaultSplitResult
  const { grids: borderGrids } = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], { spaceWidth: grid.splitSpaceWidth!, recursion: false }) || defaultSplitResult

  const handleClickLine: MouseEventHandler<Element> = (e) => {
    try {
      if (isFocused) {
        return
      }
      resetCurrentGridId()
      setTimeout(() => {
        setCurrentGridId(grid.id)
      })
    }
    finally {
      e.nativeEvent.stopImmediatePropagation()
    }
  }

  const handleDragglePoint = (type: 'start' | 'end' | 'middle') => {
    return (point: Point, newIsDrawing: boolean) => {
      let newStartPoint, newEndPoint, offset
      switch (type) {
        case 'start':
          newStartPoint = getAdjustedPoint(point, endPoint!, { direction: 'start' })
          setStartPoint(newStartPoint)
          break
        case 'end':
          newEndPoint = getAdjustedPoint(startPoint!, point, { direction: 'end' })
          setEndPoint(newEndPoint)
          break
        case 'middle':
          offset = { x: point.x - middlePoint.x, y: point.y - middlePoint.y }
          setStartPoint({ x: startPoint.x + offset.x, y: startPoint.y + offset.y })
          setEndPoint({ x: endPoint.x + offset.x, y: endPoint.y + offset.y })
          setMiddlePoint(point)
          break
        default:
          break
      }
      setIsDrawing(newIsDrawing)
      if (!newIsDrawing) {
        if (splitGrids) {
          adjustGrid(grid.id, {
            splitLine: JSON.parse(JSON.stringify(line)),
            splitResult: JSON.parse(JSON.stringify(splitGrids)),
            splitSpaceWidth: grid.splitSpaceWidth,
          })
        }
      }
    }
  }

  return (
    <div>
      {
        startPoint && endPoint && (
          <SplitLine
            startPoint={startPoint}
            endPoint={endPoint}
            showed={isFocused}
            splitSpaceWidth={grid.splitSpaceWidth}
            onClick={handleClickLine}
          />
        )
      }
      {
        splitGrids && (splitGrids.map(grid_ => (<Grid grid={grid_} key={grid_.id} />)))
      }
      {
        isFocused && borderGrids && (borderGrids.map(grid_ => (<Grid grid={grid_} key={`border${grid_.id}`} borderOnly showAsFocused />)))
      }
      {
        isFocused && startPoint && endPoint && (
          <>
            <SplitPoint point={startPoint} onChange={handleDragglePoint('start')} draggable />
            <SplitPoint point={middlePoint} onChange={handleDragglePoint('middle')} draggable />
            <SplitPoint point={endPoint} onChange={handleDragglePoint('end')} draggable />
          </>
        )
      }
    </div>
  )
}
