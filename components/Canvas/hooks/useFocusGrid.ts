import { useEffect, useRef, useState } from "react";

export default function useFocusGrid(gridRef: React.RefObject<HTMLDivElement | null>) {
  const [isFocused, setFocused] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
      setFocused(false);
    }
  };

  const setGridFocus = () => {
    if (!isFocused) {
      setFocused(true);
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  return [isFocused, setGridFocus] as const;

}