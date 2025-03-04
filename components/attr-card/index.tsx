"use client"
import * as React from "react"
import useComicStatusStore from "@/store";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import GridAttr from "./GridAttr"
import CanvasAttr from "./CanvasAttr"

export default function AttrCard() {
  const showAttrCard = useComicStatusStore(state => state.showAttrCard);
  const focusId = useComicStatusStore(state => state.currentGridId);

  const currentStep = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex]);
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  if (!showAttrCard) {
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
