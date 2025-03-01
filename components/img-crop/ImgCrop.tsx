"use client";
import React, { useRef, useState } from "react";
import { useFileDialog } from "@/hooks/useFileDialog";
import { cn } from "@/lib/utils";
import { getClipPath, getSvgPoints, getGridStyle } from "../canvas/components/grid/utils";
import { GridBorder } from "../canvas/components/grid/GridBorder";
import { GridContent } from "../canvas/components/grid/GridContent";
import { useAdjustGrid } from "../canvas/components/grid/hooks/useAdjustGrid";
import Mask, { MaskRef, MaskType } from "./Mask";
import { CloseIcon, UploadImgIcon, ClearImgIcon, SubmitIcon } from "./Icons";
import ActionBar, { ActionType } from "./ActionBar";
import { useDragZoom } from "./hooks/useDragZoom";
import { GridConfig } from "../canvas/components/grid/types";
import Background from "./Background";
import Img from "./Img";

export default function ImgCrop({ grid, onClose }: { grid: GridConfig, onClose: () => void }) {
  const maskRef = useRef<MaskRef>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [maskType, setMaskType] = useState<MaskType>("full")
  const [imgUrl, setImgUrl] = useState<string>(grid?.content?.url || "");
  const [imageX, imageY, imageZoom] = useDragZoom(containerRef);
  const [, open, reset] = useFileDialog();
  const ajustGrid = useAdjustGrid();

  const {
    imgStyle,
    sizeStyle,
    sizeStyleWithBorder,
    svgPath,
    svgPathWithBorder,
  } = getGridStyle(grid);
  const svgPoints = getSvgPoints(svgPath);
  const clipPath = svgPathWithBorder && getClipPath(svgPathWithBorder) || "";


  const onAnimationComplete = () => {
    setMaskType("grid");
  }

  const handleClose = () => {
    handleClearImg();
    setMaskType("full");
    onClose();
  }

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const mask = maskRef.current;
    if (!canvas || !image || !mask) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const { x: imageX, y: imageY, width: imageWidth, height: imageHeight } = image.getBoundingClientRect()
    const { left: maskX, top: maskY } = mask.getMaskPosStyle();

    const scaleX = image.naturalWidth / imageWidth
    const scaleY = image.naturalHeight / imageHeight
    const pixelRatio = window.devicePixelRatio
    const { width: cropWidth, height: cropHeight } = sizeStyle;
    canvas.width = Math.floor(cropWidth * scaleX * pixelRatio)
    canvas.height = Math.floor(cropHeight * scaleY * pixelRatio)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = (maskX - imageX) * scaleX
    const cropY = (maskY - imageY) * scaleY
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()
    ctx.translate(-cropX, -cropY)
    ctx.translate(centerX, centerY)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)
    ctx.restore()

    const url = canvas.toDataURL('image/png');
    ajustGrid(grid.id, {
      content: {
        url,
      }
    });
    handleClose();
  }

  const handleSelectImg = async () => {
    handleClearImg();
    const files = await open();
    const imgFile = files![0]!;
    const dataUrl = URL.createObjectURL(imgFile)
    setImgUrl(dataUrl);
  }

  const handleClearImg = () => {
    reset();
    setImgUrl("");
  }

  const actions = [
    {
      Icon: UploadImgIcon,
      onClick: handleSelectImg,
    },
    {
      Icon: ClearImgIcon,
      onClick: handleClearImg,
    },
    {
      Icon: CloseIcon,
      onClick: handleClose,
    },
    {
      Icon: SubmitIcon,
      onClick: handleSubmit,
    }
  ].filter(action => action) as ActionType[];

  return (
    <>
      <Background
        ref={containerRef}
      >
        {imgUrl && <Img
          ref={imageRef}
          imgUrl={imgUrl}
          imageX={imageX}
          imageY={imageY}
          imageZoom={imageZoom}
        />}
      </Background>
      <div
        className="fixed inset-0  grid place-items-center z-[100] pointer-events-none">
        <GridContent
          className={
            cn(maskType === "grid" ? "bg-transparent" : "")
          }
          gridId={grid.id}
          style={sizeStyleWithBorder}
          clipPath={clipPath}
          url={maskType === "grid" ? "" : grid.content?.url}
          imgStyle={imgStyle}
        />
        <GridBorder
          gridId={grid.id}
          svgPoints={svgPoints}
          containerStyle={sizeStyleWithBorder}
          svgStyle={sizeStyleWithBorder}
          onLayoutAnimationComplete={onAnimationComplete}
        />
      </div>
      <Mask
        ref={maskRef}
        gridId={grid.id}
        gridSize={sizeStyle}
        svgPath={svgPath}
        maskType={maskType}
      />
      <ActionBar
        className="fixed top-4 right-4 z-[101]"
        actions={actions}
      />
      <canvas
        key="canvas"
        className="fixed left-0 bottom-0 z-10 invisible"
        ref={canvasRef}
        style={{
          border: '1px solid black',
          ...sizeStyle,
        }}
      />
    </>
  );
}

