"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, Point } from "framer-motion";
// import { useOutsideClick } from "@/hooks/use-outside-click";
import useConfigStore from "@/store/config";
import useStepsStore from "@/store/step";
import { cn } from "@/lib/utils";
import { getClipPath, getGridFromComicConfig, getSvgPoints, getGridStyle } from "../canvas/components/grid/utils";
import { GridBorder } from "../canvas/components/grid/GridBorder";
import { GridContent } from "../canvas/components/grid/GridContent";
import Mask, { MaskType } from "./Mask";

export default function ImgCrop() {
  const { getCurrentStep } = useStepsStore();
  const { getGridFocusId, getShowImgCrop, setShowImgCrop } = useConfigStore();
  const showImgCrop = getShowImgCrop();
  
  const focusId = getGridFocusId();
  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;
  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  const [maskType, setMaskType] = useState<MaskType>("full");
  const onAnimationComplete = () => {
    setMaskType("grid");
  }
  const handleClose = () => {
    setMaskType("full");
    setShowImgCrop(false);
  }

  if (!grid) {
    return null;
  }

  const {
    sizeStyle,
    sizeStyleWithBorder,
    svgPath,
    svgPathWithBorder,
  } = grid && getGridStyle(grid);
  const svgPoints = getSvgPoints(svgPath);
  const clipPath = svgPathWithBorder && getClipPath(svgPathWithBorder) || "";
  if (showImgCrop) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return (
    <>
      <AnimatePresence>
        {showImgCrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center h-full w-full z-10 bg-grid"
          >
            <img className="block max-w-full max-h-full object-contain" width="720" height="1080" src={"/comic_.png"} alt={"background"} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {
          showImgCrop && (<div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`grid-${grid.id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={handleClose}
            >
              <CloseIcon />
            </motion.button>
            <GridContent
              className={
                cn(maskType === "grid" ? "bg-transparent" : "")
              }
              gridId={grid.id}
              style={sizeStyleWithBorder}
              clipPath={clipPath}
            />
            <GridBorder
              gridId={grid.id}
              svgPoints={svgPoints}
              containerStyle={sizeStyleWithBorder}
              svgStyle={sizeStyleWithBorder}
              onLayoutAnimationComplete={onAnimationComplete}
            />
          </div>)
        }
      </AnimatePresence>
      {showImgCrop && (<Mask
        gridId={grid.id}
        gridSize={sizeStyle as { width: number, height: number }}
        svgPath={svgPath}
        maskType={maskType}
      />)}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};