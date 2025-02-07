import { useEffect, useRef, useState } from "react";
import { useMouse } from "./useMouse";

type Point = { x: number, y: number };
export function useDrawLine(isFocused: boolean) {
  const isDrawingRef = useRef(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const mouseStateRef = useMouse();
  const resultRef = useRef<{ start?: Point, end?: Point }>({});

  const clean = () => {
    resultRef.current = {};
    setStartPoint(null);
    setEndPoint(null);
    isDrawingRef.current = false;
  }

  useEffect(() => {
    clean();

    const handleMouseDown = (event: MouseEvent) => {
      if (!isFocused) return;
      isDrawingRef.current = true;
      resultRef.current.start = { x: mouseStateRef.current.elementX, y: mouseStateRef.current.elementY };
      setStartPoint({ ...resultRef.current.start });
      setEndPoint(null);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isFocused) return;
      if (!isDrawingRef.current) return;
      updateEndPoint();
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!isFocused) return;
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      //resultRef.current.end = { x: mouseStateRef.current.elementX, y: mouseStateRef.current.elementY };
      updateEndPoint();
      if (resultRef.current.start!.x == resultRef.current.end!.x && resultRef.current.start!.y == resultRef.current.end!.y) {
        clean();
      }
    };

    function updateEndPoint() {
      resultRef.current.end = { x: mouseStateRef.current.elementX, y: mouseStateRef.current.elementY };
      let point1 = resultRef.current.start!;
      let point2 = resultRef.current.end!;
      let k = (point1.y - point2.y) / (point1.x - point2.x);
      if (point1.y !== point2.y && point1.x == point2.x) {
        setEndPoint({ ...point2 });
        return;
      }
      if (k > -0.1 && k < 0.1) {
        setEndPoint({ ...point2, y: point1.y });
      } else if (k < -12 || k > 12) {
        setEndPoint({ ...point2, x: point1.x });
      } else {
        setEndPoint({ ...point2 });
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isFocused]);

  return [startPoint, endPoint, isDrawingRef.current] as const;
}