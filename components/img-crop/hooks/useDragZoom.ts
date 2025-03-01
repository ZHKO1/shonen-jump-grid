import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import normalizeWheel from 'normalize-wheel'
import { defaultDocument, defaultWindow, getTargetElement, off, on } from "@/lib";
import { Point } from "@/components/canvas/components/grid/types";

const ZOOMSPEED = 0.1;
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3

function getMousePoint(e: MouseEvent | React.MouseEvent) {
  return ({
    x: Number(e.clientX),
    y: Number(e.clientY),
  })
}

export function useDragZoom(containerRef: RefObject<HTMLDivElement | null>, imageRef: RefObject<HTMLImageElement | null>) {
  const containerPositionRef = useRef<Point>({ x: 0, y: 0 });
  const dragStartPositionRef = useRef<Point>({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const rafDragTimeoutRef = useRef<number>(0);

  const saveContainerPosition = useCallback(() => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect()
      containerPositionRef.current = { x: bounds.left, y: bounds.top }
    }
  }, [])

  const getPointOnContainer = ({ x, y }: Point, containerTopLeft: Point): Point => {
    if (!containerRef.current) {
      throw new Error('The Cropper is not mounted')
    }
    const bounds = containerRef.current.getBoundingClientRect()
    return {
      x: bounds.width / 2 - (x - containerTopLeft.x),
      y: bounds.height / 2 - (y - containerTopLeft.y),
    }
  }

  const getPointOnMedia = ({ x, y }: Point) => {
    return {
      x: (x + dragPos.x) / zoom,
      y: (y + dragPos.y) / zoom,
    }
  }

  useEffect(() => {
    const targetElement = getTargetElement(containerRef);
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const onMouseDown = (e: MouseEvent) => {
      if (!defaultDocument) return
      e.preventDefault()
      on(defaultDocument, "mousemove", onMouseMove);
      on(defaultDocument, "mouseup", onDragStopped);
      saveContainerPosition()
      let { x, y } = getMousePoint(e);
      dragStartPositionRef.current = { x, y }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!defaultWindow) return
      let { x, y } = getMousePoint(e);
      if (rafDragTimeoutRef.current) defaultWindow.cancelAnimationFrame(rafDragTimeoutRef.current)

      rafDragTimeoutRef.current = defaultWindow.requestAnimationFrame(() => {
        if (x === undefined || y === undefined) return
        const offsetX = x - dragStartPositionRef.current.x
        const offsetY = y - dragStartPositionRef.current.y
        const requestedPosition = {
          x: dragPos.x + offsetX,
          y: dragPos.y + offsetY,
        }
        setDragPos(requestedPosition);
      });
    };

    const onDragStopped = (e: MouseEvent) => {
      off(defaultDocument, "mousemove", onMouseMove);
      off(defaultDocument, "mouseup", onDragStopped);
    };

    const onWheel = (e: WheelEvent) => {
      if (!defaultWindow) return
      e.preventDefault()
      let point = getMousePoint(e);
      const { pixelY } = normalizeWheel(e);
      const newZoom = Math.min(Math.max(zoom - (pixelY * ZOOMSPEED) / 200, MIN_ZOOM), MAX_ZOOM)
      const zoomPoint = getPointOnContainer(point, containerPositionRef.current)
      const zoomTarget = getPointOnMedia(zoomPoint)
      const requestedPosition = {
        x: zoomTarget.x * newZoom - zoomPoint.x,
        y: zoomTarget.y * newZoom - zoomPoint.y,
      }
      setDragPos(requestedPosition);
      setZoom(newZoom);
    }

    on(targetElement, "mousedown", onMouseDown)
    on(targetElement, "wheel", onWheel, { passive: false })

    return () => {
      if (!(targetElement && targetElement.removeEventListener)) {
        return
      }
      off(targetElement, "mousedown", onMouseDown)
      off(targetElement, "wheel", onWheel, { passive: false })
    }

  }, [containerRef.current, dragPos.x, dragPos.y]);

  return [dragPos.x, dragPos.y, zoom] as const;
}