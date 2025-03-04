import { useEffect } from "react";
import { useAdjustGrid } from "@/hooks/custom/useAdjustGrid";
import { useDrawLine } from "./useDrawLine";
import { getGridsBySplit } from "../utils";
import { GridConfig } from "../types";

export function useSplit(grid: GridConfig, isGridFocused: boolean, spaceWidth: number) {
  const adjustGrid = useAdjustGrid();
  const [startPoint, endPoint, isDrawing] = useDrawLine(isGridFocused);
  const { grids, line } = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], { spaceWidth }) || {};

  useEffect(() => {
    if (!isDrawing && startPoint && endPoint) {
      if (grids) {
        adjustGrid(grid.id, {
          splitLine: JSON.parse(JSON.stringify(line)),
          splitResult: JSON.parse(JSON.stringify(grids)),
          splitSpaceWidth: spaceWidth,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  return grids;
}