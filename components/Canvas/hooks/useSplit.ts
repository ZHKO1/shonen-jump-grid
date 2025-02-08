import useStepsStore from "@/components/store/step";
import { useContext, useEffect, useRef, useState } from "react";
import { useDrawLine } from "./useDrawLine";
import { getGridFromComicConfig, getGridsBySplit } from "../utils";
import { GridConfig } from "../grid";

export function useSplit(grid: GridConfig, isGridFocused: boolean, spaceWidth: number) {
  const { addStep, getCurrentStep } = useStepsStore();
  const currentStep = getCurrentStep();
  const [startPoint, endPoint, isDrawing] = useDrawLine(isGridFocused);
  let { grids, line } = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], spaceWidth) || {};

  useEffect(() => {
    if (!isDrawing && startPoint && endPoint) {
      if (currentStep && grids) {
        const comicConfig = currentStep.comicConfig;
        const newComicConfig = JSON.parse(JSON.stringify(comicConfig));

        const newGrid = getGridFromComicConfig(newComicConfig, grid.id);
        if (newGrid) {
          newGrid.splitLine = JSON.parse(JSON.stringify(line));
          newGrid.splitResult = JSON.parse(JSON.stringify(grids));
          newGrid.splitSpaceWidth = spaceWidth;
          addStep({
            type: "split",
            comicConfig: newComicConfig,
          });
        }
      }
    }
  }, [isDrawing]);

  return grids;
}