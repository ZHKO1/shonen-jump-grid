import type { RefObject } from 'react'
import type React from 'react'
import type { Point } from '@/components/canvas/types'
import normalizeWheel from 'normalize-wheel'
import { useCallback, useEffect, useRef, useState } from 'react'
import { defaultDocument, defaultWindow, off, on } from '@/lib/utils'

const ZOOMSPEED = 0.1
const MIN_ZOOM = 0.01
const MAX_ZOOM = 3

function getMousePoint(e: MouseEvent | React.MouseEvent) {
  return ({
    x: Number(e.clientX),
    y: Number(e.clientY),
  })
}

function getPointOnMedia({ x, y }: Point, { x: dragPosX, y: dragPosY }: Point, zoom: number) {
  return {
    x: (x + dragPosX) / zoom,
    y: (y + dragPosY) / zoom,
  }
}

function getPointOnContainer({ x, y }: Point, container: HTMLDivElement, containerTopLeft: Point): Point {
  if (!container) {
    throw new Error('The Cropper is not mounted')
  }
  const bounds = container.getBoundingClientRect()
  return {
    x: bounds.width / 2 - (x - containerTopLeft.x),
    y: bounds.height / 2 - (y - containerTopLeft.y),
  }
}

export function useDragZoom(containerRef: RefObject<HTMLDivElement | null>, defaultValue: { dragX?: number, dragY?: number, zoom?: number }) {
  const containerPositionRef = useRef<Point>({ x: 0, y: 0 })
  const dragStartPositionRef = useRef<Point>({ x: 0, y: 0 })
  const [dragPos, setDragPos] = useState<Point>({ x: defaultValue.dragX || 0, y: defaultValue.dragY || 0 })
  const [zoom, setZoom] = useState<number>(defaultValue.zoom || 1)
  const rafDragTimeoutRef = useRef<number>(0)
  const { current: container } = containerRef

  const reset = useCallback(() => {
    setDragPos({ x: 0, y: 0 })
    setZoom(1)
  }, [])

  const saveContainerPosition = useCallback(() => {
    if (container) {
      const bounds = container.getBoundingClientRect()
      containerPositionRef.current = { x: bounds.left, y: bounds.top }
    }
  }, [container])

  useEffect(() => {
    const targetElement = container
    if (!(targetElement && targetElement.addEventListener)) {
      return
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!defaultWindow)
        return
      const { x, y } = getMousePoint(e)
      if (rafDragTimeoutRef.current)
        defaultWindow.cancelAnimationFrame(rafDragTimeoutRef.current)

      rafDragTimeoutRef.current = defaultWindow.requestAnimationFrame(() => {
        if (x === undefined || y === undefined)
          return
        const offsetX = x - dragStartPositionRef.current.x
        const offsetY = y - dragStartPositionRef.current.y
        const requestedPosition = {
          x: dragPos.x + offsetX,
          y: dragPos.y + offsetY,
        }
        setDragPos(requestedPosition)
      })
    }

    const onDragStopped = () => {
      off(defaultDocument, 'mousemove', onMouseMove)
      off(defaultDocument, 'mouseup', onDragStopped)
    }

    const onWheel = (e: WheelEvent) => {
      if (!defaultWindow)
        return
      e.preventDefault()
      const point = getMousePoint(e)
      const { pixelY } = normalizeWheel(e)
      const newZoom = Math.min(Math.max(zoom - (pixelY * ZOOMSPEED) / 200, MIN_ZOOM), MAX_ZOOM)
      const zoomPoint = getPointOnContainer(point, container, containerPositionRef.current)
      const zoomTarget = getPointOnMedia(zoomPoint, { x: dragPos.x, y: dragPos.y }, zoom)
      const requestedPosition = {
        x: zoomTarget.x * newZoom - zoomPoint.x,
        y: zoomTarget.y * newZoom - zoomPoint.y,
      }
      setDragPos(requestedPosition)
      setZoom(newZoom)
    }

    const onMouseDown = (e: MouseEvent) => {
      if (!defaultDocument)
        return
      e.preventDefault()
      on(defaultDocument, 'mousemove', onMouseMove)
      on(defaultDocument, 'mouseup', onDragStopped)
      saveContainerPosition()
      const { x, y } = getMousePoint(e)
      dragStartPositionRef.current = { x, y }
    }

    on(targetElement, 'mousedown', onMouseDown)
    on(targetElement, 'wheel', onWheel, { passive: false })

    return () => {
      if (!(targetElement && targetElement.removeEventListener)) {
        return
      }
      off(targetElement, 'mousedown', onMouseDown)
      off(targetElement, 'wheel', onWheel, { passive: false })
    }
  }, [container, dragPos.x, dragPos.y, zoom, saveContainerPosition])

  return [dragPos.x, dragPos.y, zoom, reset] as const
}
