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
import { CloseIcon, UploadImgIcon, ClearImgIcon, SubmitIcon } from "./Icons";
import ActionBar from "./ActionBar";

export default function ImgCrop() {
  const { getCurrentStep } = useStepsStore();
  const { getGridFocusId, getShowImgCrop, setShowImgCrop } = useConfigStore();
  const showImgCrop = getShowImgCrop();

  const focusId = getGridFocusId();
  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;
  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  const [maskType, setMaskType] = useState<MaskType>("full");


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

  const onAnimationComplete = () => {
    setMaskType("grid");
  }

  const onClose = () => {
    setMaskType("full");
    setShowImgCrop(false);
  }

  const onSubmit = () => {
  }

  const onUploadImg = () => {
  }

  const onClearImg = () => {
  }

  const actions = [
    {
      Icon: UploadImgIcon,
      onClick: onUploadImg
    },
    {
      Icon: ClearImgIcon,
      onClick: onClearImg
    },
    {
      Icon: CloseIcon,
      onClick: onClose
    },
    {
      Icon: SubmitIcon,
      onClick: onSubmit
    }
  ]

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
            <ActionBar
              className="absolute top-4 right-4 "
              actions={actions}
            />
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

