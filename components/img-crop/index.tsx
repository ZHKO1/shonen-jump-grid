"use client";
import Image from "next/image";
import React, { CSSProperties, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import { useOutsideClick } from "@/hooks/use-outside-click";
import useConfigStore from "@/store/config";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig, getRectGridPoint } from "../canvas/components/grid/utils";
import { RectGridConfig } from "../canvas/components/grid/types";
import { borderWidth } from "../canvas/components/grid/constant";

// { active, setActive, id }: { active: (typeof cards)[number], setActive: Function, id: string }
export default function ImgCrop() {
  const { getCurrentStep } = useStepsStore();
  const { setIsImgCropShowed, getIsImgCropShowed, getGridFocusId } = useConfigStore();
  const focusId = getGridFocusId();
  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;

  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId) as RectGridConfig;
  const IsImgCropShowed = getIsImgCropShowed();
  const isShowed = IsImgCropShowed && grid;
  console.log("IsImgCropShowed", IsImgCropShowed);
  console.log("isShowed", isShowed);


  const { outside } = getRectGridPoint({
    ...grid!
  }, borderWidth);
  const left = outside.lt_x;
  const top = outside.lt_y;
  const width = outside.rb_x - outside.lt_x;
  const height = outside.rb_y - outside.lt_y;
  const customGridSizeStyle = {
    width,
    height,
  } as CSSProperties

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
            <motion.div className={`custom-grid absolute flex flex-wrap content-center justify-center`}
              style={customGridSizeStyle}
              layoutId={`grid-content-${grid.id}`}
            >
            </motion.div>
            <motion.div
              className="absolute pointer-events-none"
              layoutId={`grid-border-${grid.id}`}
              style={customGridSizeStyle}
            >
              <svg className={`pointer-events-none text-gray-200`}
                style={customGridSizeStyle}
              >
                <polygon
                  points={([{ x: grid.lt_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.rb_y }, { x: grid.lt_x, y: grid.rb_y }]).map(p => `${p.x - left},${p.y - top}`).join(' ')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={borderWidth}
                />
              </svg>
            </motion.div>
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