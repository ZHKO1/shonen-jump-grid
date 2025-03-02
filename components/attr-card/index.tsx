"use client"
import * as React from "react"

import useStepsStore from "@/store/step";
import useConfigStore from "@/store/config";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import GridAttr from "./GridAttr"
import CanvasAttr from "./CanvasAttr"

export default function AttrCard() {
  const { getCurrentStep } = useStepsStore();
  const { getShowAttrCard, getGridFocusId, getCurrentPage } = useConfigStore();
  const currentPage = getCurrentPage();
  const focusId = getGridFocusId();

  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, currentPage, focusId);

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
