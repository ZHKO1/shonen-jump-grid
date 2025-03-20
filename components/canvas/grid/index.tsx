'use client'
import type { CanvasGridConfig } from '../types'
import type { PolyGridProps } from './PolyGrid'
import type { RectGridProps } from './RectGrid'
import { isGridSplited } from '../utils'
import PolyGrid from './PolyGrid'
import RectGrid from './RectGrid'
import SplitContainer from './SplitContainer'

export interface GridProps { grid: CanvasGridConfig, showAsFocused?: boolean, borderOnly?: boolean }
export function Grid(props: GridProps) {
  const { grid } = props
  if (isGridSplited(grid)) {
    return <SplitContainer {...props} />
  }
  if (grid.type === 'poly') {
    return <PolyGrid {...props as PolyGridProps} />
  }
  else if (grid.type === 'rect') {
    return <RectGrid {...props as RectGridProps} />
  }
  else {
    return null
  }
}
