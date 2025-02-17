import useStepsStore from "@/store/step";
import { useEffect } from "react";
import { useDrawLine } from "./useDrawLine";
import { getGridFromComicConfig, getGridsBySplit } from "../utils";
import { GridConfig } from "../types";
import { useAdjustGrid } from "./useAdjustGrid";

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