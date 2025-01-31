import useStepsStore from "@/components/store/step";
import { useContext, useEffect, useRef, useState } from "react";
import { useDrawLine } from "./useDrawLine";
import { getGridFromComicConfig, getGridsBySplit } from "../utils";
import { GridConfig } from "../grid";

export function useSplit(grid: GridConfig, isGridFocused: boolean, spaceWidth: number) {
  const { addStep, getCurrentStep } = useStepsStore();
  const currentStep = getCurrentStep();
  const [startPoint, endPoint, isDrawing] = useDrawLine(isGridFocused);
  let grids = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], spaceWidth);

  useEffect(() => {
    if (!isDrawing && startPoint && endPoint) {
      if (currentStep && grids) {
        const comicConfig = currentStep.comicConfig;
        const newComicConfig = JSON.parse(JSON.stringify(comicConfig));

        const newGrid = getGridFromComicConfig(newComicConfig, grid.id);
        if (newGrid) {
          newGrid.split_line = [startPoint, endPoint];
          newGrid.split_result = JSON.parse(JSON.stringify(grids)).map((grid_: GridConfig, index: number) => ({
            ...grid_,
            id: grid.id + "_" + index
          }));
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