import type { Point } from '../types'
import { cn } from '@/lib/utils'
import { BORDER_WIDTH } from '../constant'

export default function SplitLine({
  startPoint,
  endPoint,
  splitSpaceWidth = BORDER_WIDTH,
  showed,
  onClick,
}: {
  startPoint: Point
  endPoint: Point
  splitSpaceWidth?: number
  showed: boolean
  onClick?: React.MouseEventHandler<SVGLineElement> | undefined
}) {
  return (
    <svg
      className={cn(
        'absolute top-0 left-0 w-full h-full',
        showed ? 'opacity-100' : 'opacity-0',
      )}
      style={{ pointerEvents: 'none' }}
    >
      <line
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke="transparent"
        strokeWidth={splitSpaceWidth}
        pointerEvents="all"
        onClick={onClick}
      />
      <line
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke="gray"
        strokeWidth="4"
        strokeDasharray={5}
        pointerEvents="none"
      />
    </svg>
  )
}
