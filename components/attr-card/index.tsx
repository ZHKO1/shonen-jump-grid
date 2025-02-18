"use client"
import * as React from "react"

import useStepsStore from "@/store/step";
import useConfigStore from "@/store/config";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import GridAttr from "./GridAttr"
import CanvasAttr from "./CanvasAttr"
import { isDef } from "@/lib";

export default function AttrCard() {
  const { getCurrentStep } = useStepsStore();
  const { getIsAttrCardShowed, getGridFocusId } = useConfigStore();
  const focusId = getGridFocusId();

  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  return (
    <div className={getIsAttrCardShowed() ? "" : "hidden"}>
      {
        (focusId !== "") && grid ? <GridAttr grid={grid} /> : <CanvasAttr />
      }
    </div>
  )
}
