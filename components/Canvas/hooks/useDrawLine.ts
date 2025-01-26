import { useContext, useEffect, useRef, useState } from "react";
import { useMouse } from "./useMouse";
import { ContainerContext } from "../context/container";

type Point = { x: number, y: number };
export function useDrawLine(isFocused: boolean) {
  const isDrawingRef = useRef(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const containerRef = useContext(ContainerContext).container;
  const mouseStateRef = useMouse(containerRef);
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
      resultRef.current.end = { x: mouseStateRef.current.elementX, y: mouseStateRef.current.elementY };
      setEndPoint({ ...resultRef.current.end });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!isFocused) return;
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      resultRef.current.end = { x: mouseStateRef.current.elementX, y: mouseStateRef.current.elementY };
      if (resultRef.current.start!.x == resultRef.current.end!.x && resultRef.current.start!.y == resultRef.current.end!.y) {
        clean();
      } else {
        setEndPoint({ ...resultRef.current.end });
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
  }, [isFocused, containerRef.current]);

  return [startPoint, endPoint, isDrawingRef.current] as const;
}