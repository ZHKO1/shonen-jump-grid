"use client";
import React, { useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import useComicStatusStore from "@/store";
import { getGridFromComicConfig } from "@/components/canvas/utils";
import ImgCrop from "./ImgCrop";
import { defaultDocument } from "@/lib";

export default function ImgCropContainer() {
  const focusId = useComicStatusStore(state => state.currentPageStatus.gridId);
  const showImgCrop = useComicStatusStore(state => state.showImgCrop);
  const setShowImgCrop = useComicStatusStore(state => state.setShowImgCrop);
  const currentStep = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex]);
  const comicConfig = currentStep?.comicConfig;
  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  if (defaultDocument) {
    if (showImgCrop) {
      defaultDocument.body.style.overflow = "hidden";
    } else {
      defaultDocument.body.style.overflow = "auto";
    }
  }

  const onClose = useCallback(() => {
    setTimeout(() => {
      setShowImgCrop(false)
    }, 100);
  }, [setShowImgCrop]);

  if (!grid) {
    return null;
  }

  return (
    <AnimatePresence>
      {showImgCrop && (<ImgCrop
        grid={grid}
        onClose={onClose}
      />)}
    </AnimatePresence>
  );
}

