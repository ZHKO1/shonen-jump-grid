"use client";
import React, { act, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, Point } from "framer-motion";
// import { useOutsideClick } from "@/hooks/use-outside-click";
import useConfigStore from "@/store/config";
import useStepsStore from "@/store/step";
import { useFileDialog } from "@/hooks/useFileDialog";
import { cn } from "@/lib/utils";
import { getClipPath, getGridFromComicConfig, getSvgPoints, getGridStyle } from "../canvas/components/grid/utils";
import { GridBorder } from "../canvas/components/grid/GridBorder";
import { GridContent } from "../canvas/components/grid/GridContent";
import Mask, { MaskType } from "./Mask";
import { CloseIcon, UploadImgIcon, ClearImgIcon, SubmitIcon } from "./Icons";
import ActionBar, { ActionType } from "./ActionBar";
import { useDragZoom } from "./hooks/useDragZoom";

export default function ImgCrop() {
  const { getCurrentStep } = useStepsStore();
  const { getGridFocusId, getShowImgCrop, setShowImgCrop } = useConfigStore();
  const showImgCrop = getShowImgCrop();

  const focusId = getGridFocusId();
  const currentStep = getCurrentStep();
  const comicConfig = currentStep?.comicConfig;
  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageX, imageY, imageZoom] = useDragZoom(containerRef, imageRef);
  const [maskType, setMaskType] = useState<MaskType>("full")
  const [imgUrl, setImgUrl] = useState<string>(grid?.content?.url || "");
  const [, open, reset] = useFileDialog();

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
    onClearImg();
    setMaskType("full");
    setShowImgCrop(false);
  }

  const onSubmit = () => {
  }

  const onUploadImg = async () => {
    reset();
    const files = await open();
    const imgFile = files![0]!;
    const dataUrl = URL.createObjectURL(imgFile)
    setImgUrl(dataUrl);
  }

  const onClearImg = () => {
    reset();
    setImgUrl("");
  }

  const actions = [
    !imgUrl && {
      Icon: UploadImgIcon,
      onClick: onUploadImg,
      iconkey: "upload"
    },
    imgUrl && {
      Icon: ClearImgIcon,
      onClick: onClearImg,
      iconkey: "upload",
    },
    {
      Icon: CloseIcon,
      onClick: onClose,
    },
    {
      Icon: SubmitIcon,
      onClick: onSubmit,
    }
  ].filter(action => action) as ActionType[];

  return (
    <>
      <AnimatePresence>
        {showImgCrop && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full z-10 bg-grid"
              ref={containerRef}
            >
              {
                imgUrl && <img
                  className="absolute top-0 bottom-0 left-0 right-0 m-auto max-w-full max-h-full select-none"
                  src={imgUrl}
                  style={{
                    transform: `translate(${imageX}px, ${imageY}px) scale(${imageZoom})`,
                  }}
                  ref={imageRef}
                  alt={"background"} />
              }
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {
          showImgCrop && (<div
            className="fixed inset-0  grid place-items-center z-[100] pointer-events-none">
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
      <AnimatePresence>
        {
          showImgCrop && <ActionBar
            className="fixed top-4 right-4 z-[101]"
            actions={actions}
          />
        }
      </AnimatePresence>
    </>
  );
}

