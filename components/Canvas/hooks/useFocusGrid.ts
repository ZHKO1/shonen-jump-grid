import { useEffect, useRef, useState } from "react";

export function useFocusGrid(gridRef: React.RefObject<HTMLDivElement | null>) {
  const [isFocused, setFocused] = useState(false);
  const mouseStatusRef = useRef({ drag: false, click: false });

  const setGridFocus = () => {
    if (!isFocused) {
      setFocused(true);
    }
  }

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      mouseStatusRef.current = { drag: false, click: true };
    }
  
    const handleDocumentMouseMove = (event: MouseEvent) => {
      if (mouseStatusRef.current.click) {
        mouseStatusRef.current.drag = true;
      }
    }
  
    const handleClickOutside = (event: MouseEvent) => {
      try {
        if (mouseStatusRef.current.click) {
          if (!mouseStatusRef.current.drag) {
            if (isFocused && gridRef.current && !gridRef.current.contains(event.target as Node)) {
              setFocused(false);
            }
          }
        }
      } finally {
        mouseStatusRef.current.drag = false;
        mouseStatusRef.current.click = false;
      };
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isFocused]);

  return [isFocused, setGridFocus] as const;

}