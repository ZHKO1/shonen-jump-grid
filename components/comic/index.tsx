"use client";
import React, { useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import useComicStatusStore from "@/store";
import { defaultDocument } from "@/lib";
import Preview from "./Preview";
import { getComicConfigFromCanvas } from "../canvas/utils";

export default function ComicContainer() {
  const showComic = useComicStatusStore(state => state.showComic);
  const setShowComic = useComicStatusStore(state => state.setShowComic);
  const currentStep = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex]);
  const canvasComicConfig = currentStep?.comicConfig;
  const comicConfig = getComicConfigFromCanvas(canvasComicConfig);

  if (defaultDocument) {
    if (showComic) {
      defaultDocument.body.style.overflow = "hidden";
    } else {
      defaultDocument.body.style.overflow = "auto";
    }
  }

  const onClose = useCallback(() => {
    setTimeout(() => {
      setShowComic(false)
    }, 100);
  }, [setShowComic]);

  return (
    <AnimatePresence>
      {showComic && (<Preview config={comicConfig} onClose={onClose}/>)}
    </AnimatePresence>
  );
}

