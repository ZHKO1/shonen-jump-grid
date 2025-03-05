// https://github.com/uidotdev/usehooks/blob/main/index.js useMouse
import { useRef, useContext, useCallback } from "react";
import { ContainerContext } from "@/components/canvas/context/container";
import { useEventListener } from "@/hooks";
import { defaultDocument } from "@/lib";

export type MouseState = {
  x: number,
  y: number,
  elementX: number,
  elementY: number,
  elementPositionX: number,
  elementPositionY: number
};

export function useMouse() {
  const gridRef = useContext(ContainerContext).container;

  const stateRef = useRef<MouseState>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
  });

  const grid = gridRef.current;

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!grid) {
      return;
    }

    const newState = {
      x: event.pageX,
      y: event.pageY,
    } as MouseState;

    if (grid.nodeType === Node.ELEMENT_NODE) {
      const { left, top } = grid.getBoundingClientRect();
      const elementPositionX = left + window.scrollX;
      const elementPositionY = top + window.scrollY;
      const elementX = event.pageX - elementPositionX;
      const elementY = event.pageY - elementPositionY;

      newState.elementX = elementX;
      newState.elementY = elementY;
      newState.elementPositionX = elementPositionX;
      newState.elementPositionY = elementPositionY;
    }

    stateRef.current = newState;
  }, [grid]);

  useEventListener("mousemove", handleMouseMove, defaultDocument);

  return stateRef;
}