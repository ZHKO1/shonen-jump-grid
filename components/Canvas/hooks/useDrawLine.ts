import { useEffect, useRef, useState } from "react";
import { useMouse } from "./useMouse";
import type { Point } from '../grid';
import { useLatest } from "@/components/hooks/useLatest";

type DrawState = {
  isDrawing: boolean;
  start: Point | null;
  end: Point | null;
};

export function useDrawLine(isFocused: boolean) {
  const mouseStateRef = useMouse();
  const [drawState, setDrawState] = useState<DrawState>({
    isDrawing: false,
    start: null,
    end: null
  });
  const latestDrawState = useLatest(drawState);

  const getAdjustedEndPoint = (start: Point, end: Point): Point => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    if (deltaX === 0) return { ...end };

    const slope = deltaY / deltaX;

    if (Math.abs(slope) < 0.1) return { x: end.x, y: start.y };
    if (Math.abs(slope) > 12) return { x: start.x, y: end.y };

    return { ...end };
  };

  useEffect(() => {
    if (!isFocused) {
      setDrawState({ isDrawing: false, start: null, end: null });
      return;
    }

    const handleMouseDown = () => {
      const start = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY
      };
      setDrawState({ isDrawing: true, start, end: null });
    };

    const handleMouseMove = () => {
      let { start, isDrawing } = latestDrawState.current;
      if (!isDrawing || !start) return;

      const newEnd = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY
      };

      setDrawState(prev => ({
        ...prev,
        end: getAdjustedEndPoint(prev.start!, newEnd)
      }));
    };

    const handleMouseUp = () => {
      let { start, isDrawing } = latestDrawState.current;
      if (!isDrawing || !start) return;

      const newEnd = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY
      };

      // 检查是否为无效线（起点终点相同）
      if (start.x === newEnd.x &&
        start.y === newEnd.y) {
        setDrawState({ isDrawing: false, start: null, end: null });
      } else {
        setDrawState(prev => ({ ...prev, end: getAdjustedEndPoint(prev.start!, newEnd), isDrawing: false }));
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isFocused]);

  return [drawState.start, drawState.end, drawState.isDrawing] as const;
}