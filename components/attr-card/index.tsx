"use client"
import * as React from "react"

import useStepsStore from "@/store/step";
import useConfigStore from "@/store/config";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import GridAttr from "./GridAttr"
import CanvasAttr from "./CanvasAttr"

export default function AttrCard() {
  const { getCurrentHistoryStep } = useStepsStore();
  const { getShowAttrCard, getCurrentGridId } = useConfigStore();
  const focusId = getCurrentGridId();

  const currentStep = getCurrentHistoryStep();
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  if (!getShowAttrCard()) {
    return null;
  }

  return (
    <div>
      {
        (focusId !== "") && grid ? <GridAttr grid={grid} /> : <CanvasAttr />
      }
    </div>
  )
}
