'use client'
import type { CanvasGridConfig } from '../types'
import { isGridSplited } from '../utils'
import GridBase from './GridBase'
import SplitContainer from './SplitContainer'

export interface GridProps { grid: CanvasGridConfig, showAsFocused?: boolean, borderOnly?: boolean }
export function Grid(props: GridProps) {
  const { grid } = props
  if (isGridSplited(grid)) {
    return <SplitContainer {...props} />
  }
  return <GridBase {...props as GridProps} />
}
