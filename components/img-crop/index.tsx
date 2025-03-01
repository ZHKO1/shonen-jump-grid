"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";
// import { useOutsideClick } from "@/hooks/use-outside-click";
import useConfigStore from "@/store/config";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import ImgCrop from "./ImgCrop";
import { defaultDocument } from "@/lib";

export default function ImgCropContainer() {
  const { getCurrentStep } = useStepsStore();
  const { getGridFocusId, getShowImgCrop, setShowImgCrop } = useConfigStore();
  const showImgCrop = getShowImgCrop();

  const focusId = getGridFocusId();
  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;
  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  if (defaultDocument) {
    if (showImgCrop) {
      defaultDocument.body.style.overflow = "hidden";
    } else {
      defaultDocument.body.style.overflow = "auto";
    }
  }


  if (!grid) {
    return null;
  }

  return (
    <AnimatePresence>
      {showImgCrop && (<ImgCrop
        grid={grid}
        onClose={() => setShowImgCrop(false)}
      />)}
    </AnimatePresence>
  );
}

