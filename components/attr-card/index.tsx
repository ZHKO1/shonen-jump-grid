"use client"
import * as React from "react"

import useFocusStore from "@/store/focus";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import GridAttr from "./GridAttr"
import CanvasAttr from "./CanvasAttr"
import { isDef } from "@/lib";

export default function AttrCard() {
  const { getFocusId } = useFocusStore();
  const { getCurrentStep } = useStepsStore();
  const focusId = getFocusId();

  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  if ((focusId !== "") && grid) {
    return <GridAttr grid={grid} />
  } else {
    return <CanvasAttr />
  }
}
