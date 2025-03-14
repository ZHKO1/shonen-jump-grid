"use client"
import * as React from "react"
import useComicStatusStore from "@/store";
import { getGridFromComicConfig, getPageFromComicConfig } from "@/components/canvas/utils";
import GridAttr from "./GridAttr"
import PageAttr from "./PageAttr"

export default function AttrCard() {
  const showAttrCard = useComicStatusStore(state => state.showAttrCard);
  const currentGridId = useComicStatusStore(state => state.currentGridId);
  const currentPageId = useComicStatusStore(state => state.currentPageId);

  const currentStep = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex]);
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, currentGridId);
  const page = comicConfig && getPageFromComicConfig(comicConfig, currentPageId) || void 0;

  if (!showAttrCard) {
    return null;
  }

  return (
    <div>
      {
        (currentGridId !== "") && grid ? <GridAttr grid={grid} /> : <PageAttr page={page} />
      }
    </div>
  )
}
