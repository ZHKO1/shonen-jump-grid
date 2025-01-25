import { useEffect, useRef, useState } from "react";
import { MouseState, useMouse } from "./useMouse";

type Point = { x: number, y: number };
export function useSplitGrid(gridRef: React.RefObject<HTMLDivElement | null>, isFocused: boolean) {
  const isDrawingRef = useRef(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const mouseStateRef = useMouse(gridRef);

  const clean = () => {
    setStartPoint(null);
    setEndPoint(null);
    isDrawingRef.current = false;
  }

  useEffect(() => {
    clean();

    const handleMouseDown = (event: MouseEvent) => {
      if (!isFocused) return;
      isDrawingRef.current = true;
      setStartPoint({ x: mouseStateRef.current.elementX, y: mouseStateRef.current.elementY });
      setEndPoint(null);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isFocused) return;
      if (!isDrawingRef.current) return;
      setEndPoint({ x: mouseStateRef.current.elementX, y: mouseStateRef.current.elementY });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!isFocused) return;
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      setEndPoint({ x: mouseStateRef.current.elementX, y: mouseStateRef.current.elementY });
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

  return [startPoint, endPoint] as const;
}