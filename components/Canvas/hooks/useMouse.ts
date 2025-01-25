// https://github.com/uidotdev/usehooks/blob/main/index.js useMouse

import { useLayoutEffect, useRef, useState } from "react";

export type MouseState = {
  x: number,
  y: number,
  elementX: number,
  elementY: number,
  elementPositionX: number,
  elementPositionY: number
};

export function useMouse(gridRef: React.RefObject<HTMLDivElement | null>,) {
  const stateRef = useRef<MouseState>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
  });

  const ref = gridRef;

  useLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      let newState = {
        x: event.pageX,
        y: event.pageY,
      } as MouseState;

      if (ref.current?.nodeType === Node.ELEMENT_NODE) {
        const { left, top } = ref.current.getBoundingClientRect();
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
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return stateRef;
}