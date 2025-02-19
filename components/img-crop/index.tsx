"use client";
import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
// import { useOutsideClick } from "@/hooks/use-outside-click";
import useConfigStore from "@/store/config";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig, getGridStyle } from "../canvas/components/grid/utils";
import { GridBorder } from "../canvas/components/grid/GridBorder";
import { GridContent } from "../canvas/components/grid/GridContent";

export default function ImgCrop() {
  const { getCurrentStep } = useStepsStore();
  const { setIsImgCropShowed, getIsImgCropShowed, getGridFocusId } = useConfigStore();
  const focusId = getGridFocusId();
  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);
  const IsImgCropShowed = getIsImgCropShowed();
  const isShowed = IsImgCropShowed && grid;

  const {
    // gridPosStyle,
    gridSizeStyle,
    svgPoints = "",
    clipPath,
  } = grid && getGridStyle(grid) || {};

  // const ref = useRef<HTMLDivElement>(null);
  // useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {isShowed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isShowed && (
          <div className="fixed inset-0  grid place-items-center z-[100]">
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
              onClick={() => setIsImgCropShowed(false)}
            >
              <CloseIcon />
            </motion.button>
            <GridContent
              className="bg-green-600"
              gridId={grid.id}
              style={gridSizeStyle}
              clipPath={clipPath}
            />
            <GridBorder
              gridId={grid.id}
              svgPoints={svgPoints}
              containerStyle={gridSizeStyle}
              svgStyle={gridSizeStyle}
            />
          </div>
        )}
      </AnimatePresence>
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