"use client"
import * as React from "react"

import useFocusStore from "@/store/focus";
import useStepsStore from "@/store/step";
import useAttrStore from "@/store/attr";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import GridAttr from "./GridAttr"
import CanvasAttr from "./CanvasAttr"
import { isDef } from "@/lib";

export default function AttrCard() {
  const { getFocusId } = useFocusStore();
  const { getCurrentStep } = useStepsStore();
  const { getShow } = useAttrStore();
  const focusId = getFocusId();

  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  return (
    <div className={getShow() ? "" : "hidden"}>
      {
        (focusId !== "") && grid ? <GridAttr grid={grid} /> : <CanvasAttr />
      }
    </div>
  )
}
