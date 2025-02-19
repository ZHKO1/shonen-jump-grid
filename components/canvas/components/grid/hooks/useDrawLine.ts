import { useContext, useEffect, useRef, useState } from "react";
import { useMouse } from "./useMouse";
import type { Point } from '../types';
import { useLatest } from "@/hooks/useLatest";
import { getAdjustedPoint } from "../utils";
import { ContainerContext } from "@/components/canvas/context/container";


type DrawState = {
  isDrawing: boolean;
  start: Point | null;
  end: Point | null;
};

export function useDrawLine(isFocused: boolean) {
  const { current: grid } = useContext(ContainerContext).container;
  const mouseStateRef = useMouse();
  const mouseDownTimeRef = useRef<number>(0);
  const [drawState, setDrawState] = useState<DrawState>({
    isDrawing: false,
    start: null,
    end: null,
  });
  const latestDrawState = useLatest(drawState);

  const checkTimeElapsed = () => {
    if (mouseDownTimeRef.current) {
      if (Date.now() - mouseDownTimeRef.current > 200) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (!isFocused) {
      mouseDownTimeRef.current = 0;
      setDrawState({ isDrawing: false, start: null, end: null });
      return;
    }

    const handleMouseDown = () => {
      mouseDownTimeRef.current = Date.now();
      const start = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY
      };
      setDrawState({ isDrawing: true, start, end: null });

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);  
    };

    const handleMouseMove = () => {
      const { start, isDrawing } = latestDrawState.current;
      if (!isDrawing || !start) return;

      if (!checkTimeElapsed()) {
        return;
      }

      const newEnd = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY
      };

      setDrawState(prev => ({
        ...prev,
        end: getAdjustedPoint(prev.start!, newEnd, { direction: "end" })
      }));
    };

    const handleMouseUp = () => {
      const { start, isDrawing } = latestDrawState.current;
      if (!isDrawing || !start) return;

      if (!checkTimeElapsed()) {
        mouseDownTimeRef.current = 0;
        setDrawState({ isDrawing: false, start: null, end: null });
        return;
      }

      const newEnd = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY
      };

      // 检查是否为无效线（起点终点相同）
      if (start.x === newEnd.x &&
        start.y === newEnd.y) {
        setDrawState({ isDrawing: false, start: null, end: null });
      } else {
        setDrawState(prev => ({
          ...prev,
          end: getAdjustedPoint(prev.start!, newEnd, { direction: "end" }),
          isDrawing: false
        }));
      }
      mouseDownTimeRef.current = 0;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);  
    };

    grid && grid.addEventListener("mousedown", handleMouseDown);

    return () => {
      grid && grid.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isFocused]);

  return [drawState.start, drawState.end, drawState.isDrawing] as const;
}