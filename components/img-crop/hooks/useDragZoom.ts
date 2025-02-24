import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { defaultDocument, defaultWindow, getTargetElement, off, on } from "@/lib";
import { Point } from "@/components/canvas/components/grid/types";

function getMousePoint(e: MouseEvent | React.MouseEvent) {
  return ({
    x: Number(e.clientX),
    y: Number(e.clientY),
  })
}

export function useDragZoom(containerRef: RefObject<HTMLDivElement | null>, imageRef: RefObject<HTMLImageElement | null>) {
  const containerPositionRef = useRef<Point>({ x: 0, y: 0 });
  const dragStartPositionRef = useRef<Point>({ x: 0, y: 0 });
  const [cropState, setCropState] = useState<Point>({ x: 0, y: 0 });
  const rafDragTimeoutRef = useRef<number>(0);

  const saveContainerPosition = useCallback(() => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect()
      containerPositionRef.current = { x: bounds.left, y: bounds.top }
    }
  }, [])

  useEffect(() => {
    const targetElement = getTargetElement(containerRef);
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!defaultDocument) return
      e.preventDefault()
      on(defaultDocument, "mousemove", onMouseMove);
      on(defaultDocument, "mouseup", onDragStopped);
      saveContainerPosition()
      let { x, y } = getMousePoint(e);
      dragStartPositionRef.current = { x, y }
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let { x, y } = getMousePoint(e);
      if (!defaultWindow) return
      if (rafDragTimeoutRef.current) defaultWindow.cancelAnimationFrame(rafDragTimeoutRef.current)

      rafDragTimeoutRef.current = defaultWindow.requestAnimationFrame(() => {
        if (x === undefined || y === undefined) return
        const offsetX = x - dragStartPositionRef.current.x
        const offsetY = y - dragStartPositionRef.current.y
        const requestedPosition = {
          x: cropState.x + offsetX,
          y: cropState.y + offsetY,
        }
        setCropState(requestedPosition);
      });
    };

    const onDragStopped = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      off(defaultDocument, "mousemove", onMouseMove);
      off(defaultDocument, "mouseup", onDragStopped);
    };

    on(targetElement, "mousedown", onMouseDown)

    return () => {
      if (!(targetElement && targetElement.removeEventListener)) {
        return
      }
      off(targetElement, "mousedown", onMouseDown)
    }

  }, [containerRef.current, cropState.x, cropState.y]);

  return [cropState.x, cropState.y, 1] as const;
}