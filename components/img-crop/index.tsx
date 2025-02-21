"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, Point } from "framer-motion";
// import { useOutsideClick } from "@/hooks/use-outside-click";
import useConfigStore from "@/store/config";
import useStepsStore from "@/store/step";
import { getClipPath, getGridFromComicConfig, getSvgPoints, getGridStyle } from "../canvas/components/grid/utils";
import { GridBorder } from "../canvas/components/grid/GridBorder";
import { GridContent } from "../canvas/components/grid/GridContent";
import { useElementBounding } from "@/hooks/useElementBounding";

export default function ImgCrop() {
  const ref = useRef<HTMLDivElement>(null);
  const { getCurrentStep } = useStepsStore();
  const { setIsImgCropShowed, getIsImgCropShowed, getGridFocusId } = useConfigStore();
  const isShowed = getIsImgCropShowed();
  const { width: windowWidth, height: windowHeight, update } = useElementBounding(ref, {
    windowResize: true,
  });
  useEffect(() => {
    const element = ref.current;
    if (isShowed && element) {
      update();
    }
  }, [isShowed])

  const focusId = getGridFocusId();
  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;
  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

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

  const {
    width: gridWidth = 0,
    height: gridHeight = 0,
  } = sizeStyle as { width: number, height: number };
  const maskSvgPosStyle = {
    left: (windowWidth - gridWidth) / 2,
    top: (windowHeight - gridHeight) / 2,
  }
  const maskSvgPoints = getSvgPoints(svgPath.map(({ x, y }) => ({
    x: x + maskSvgPosStyle.left,
    y: y + maskSvgPosStyle.top,
  })) as [Point, Point, Point, Point]);

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
            className="fixed inset-0 flex items-center justify-center h-full w-full z-10"
            ref={ref}
          >
            <img className="block max-w-full max-h-full object-contain" width="720" height="1080" src={"/comic_.png"} alt={"background"} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isShowed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // transition={{delay: 0.25}}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          >
            <svg
              className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none" width="100%" height="100%">
              <defs>
                <mask id={`hole-${grid.id}`}>
                  <rect width="100%" height="100%" fill="white" />
                  <polygon
                    points={maskSvgPoints}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect fill="black" fillOpacity={0.5} width="100%" height="100%" mask={`url(#hole-${grid.id})`} />
            </svg>
          </motion.div>
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
              className="bg-transparent"
              gridId={grid.id}
              style={sizeStyleWithBorder}
              clipPath={clipPath}
            />
            <GridBorder
              gridId={grid.id}
              svgPoints={svgPoints}
              containerStyle={sizeStyleWithBorder}
              svgStyle={sizeStyleWithBorder}
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