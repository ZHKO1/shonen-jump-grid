"use client";
import { useRef } from "react";
import Canvas from "./Canvas";
import { Height, Width } from "../comic/core/config";
import { useResizeScale } from "@/hooks/useResizeScale";

export default function CanvasPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scaleX, scaleY } = useResizeScale(Width, Height, containerRef);
  return (
    <div className="relative w-full h-full p-2">
      <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative"
            style={{
              width: Width,
              height: Height,
              transform: `scale(${scaleX}, ${scaleY})`
            }}>
            <Canvas />
          </div>
        </div>
      </div >
    </div>
  );
}
