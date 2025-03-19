import type { Point } from '../types'
import { useContext, useRef } from 'react'
import { useDraggable } from '@/hooks'
import { ContainerContext } from '../context/container'

export default function SplitPoint({
  point,
  onChange,
  draggable = false,
}: {
  point: Point
  onChange?: (val: Point, isDrawing: boolean) => void
  draggable?: boolean
}) {
  const pointRef = useRef<HTMLDivElement>(null)
  const context = useContext(ContainerContext)
  const gridRef = context.container

  const [, ,] = useDraggable(pointRef, {
    initialValue: { x: point.x - 5, y: point.y - 5 },
    containerElement: gridRef,
    preventDefault: true,
    stopPropagation: true,
    onMove(position) {
      if (onChange) {
        onChange({
          x: position.x / context.scale + 5,
          y: position.y / context.scale + 5,
        }, true)
      }
    },
    onEnd(position) {
      if (onChange) {
        onChange({
          x: position.x / context.scale + 5,
          y: position.y / context.scale + 5,
        }, false)
      }
    },
    enabled: draggable,
  })

  return (
    <div
      ref={pointRef}
      className="absolute size-[10px] rounded-full bg-black cursor-pointer"
      style={{ left: point.x - 5, top: point.y - 5 }}
    >
    </div>
  )
}
