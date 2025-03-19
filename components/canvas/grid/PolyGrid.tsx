import type { MouseEventHandler } from 'react'
import type { CanvasPolyGridConfig } from '../types'
import type { GridIconProps } from './GridIcon'
import { useRef } from 'react'
import { useEventListener } from '@/hooks'
import { cn } from '@/lib/utils'
import useComicStatusStore from '@/store'
import { Grid } from '.'
import { BORDER_WIDTH } from '../constant'
import { useSplit } from '../hooks/useSplit'
import { getClipPath, getGridStyle, getSvgPoints } from '../utils'
import { GridBorder } from './GridBorder'
import { GridContent } from './GridContent'
import { GridIcon } from './GridIcon'
import SplitLine from './SplitLine'
import SplitPoint from './SplitPoint'

export interface PolyGridProps {
  grid: CanvasPolyGridConfig
  showAsFocused?: boolean
  borderOnly?: boolean
};
export default function PolyGrid({ grid, showAsFocused = false, borderOnly = false }: PolyGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const setCurrentGridId = useComicStatusStore(state => state.setCurrentGridId)
  const { getCurrentGridId } = useComicStatusStore()
  const isFocused = getCurrentGridId() === grid.id
  const { grids: splitGrids, startPoint, endPoint } = useSplit(grid, isFocused, BORDER_WIDTH * 2)
  const shouldShowBorder = (isFocused && !splitGrids) || showAsFocused
  const getSplitGridId = (index: number) => `${grid.id}_split_${index}`

  const {
    imgStyle,
    posStyleWithBorder,
    sizeStyleWithBorder,
    svgPath,
    svgPathWithBorder,
    focusIconPosStyle,
  } = getGridStyle(grid)
  const svgPoints = getSvgPoints(svgPath)
  const clipPath = getClipPath(svgPathWithBorder!)

  const gridStyle = {
    ...posStyleWithBorder,
    ...sizeStyleWithBorder,
  }

  const { focus } = grid.content || {}
  let animation = '' as GridIconProps['iconType'] | ''
  switch (focus?.type) {
    case 'move':
      animation = focus.direction
      break
    case 'change-background':
      animation = 'gray-to-color'
      break
    default:
      break
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    setCurrentGridId(grid.id)
    // e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation()
  }

  useEventListener('click', handleClick, gridRef && gridRef.current)

  return (
    <div>
      {
        splitGrids && startPoint && endPoint && (
          <SplitLine
            startPoint={startPoint}
            endPoint={endPoint}
            showed
            splitSpaceWidth={grid.splitSpaceWidth}
          />
        )
      }
      {
        !(splitGrids || borderOnly) && (
          <GridContent
            className={cn(isFocused && 'z-10')}
            disableMotion={!isFocused}
            gridId={grid.id}
            style={{
              ...gridStyle,
            }}
            clipPath={clipPath}
            ref={gridRef}
            url={grid.content?.url}
            imgStyle={imgStyle}
          >
            {animation && (
              <GridIcon
                className={focusIconPosStyle && 'absolute'}
                iconType={animation}
                style={focusIconPosStyle}
              />
            )}
          </GridContent>
        )
      }

      {splitGrids?.map((grid_, index) => (
        <Grid
          grid={{ ...grid_, id: getSplitGridId(index) }}
          key={getSplitGridId(index)}
          showAsFocused
        />
      ))}

      {
        !splitGrids && (
          <GridBorder
            className={cn(isFocused && 'z-10')}
            disableMotion={!isFocused}
            gridId={grid.id}
            svgPoints={svgPoints}
            containerStyle={posStyleWithBorder}
            svgStyle={sizeStyleWithBorder}
            focused={shouldShowBorder}
          />
        )
      }
      {
        splitGrids && startPoint && endPoint && (
          <>
            <SplitPoint point={startPoint} />
            <SplitPoint point={endPoint} />
          </>
        )
      }
    </div>
  )
}
