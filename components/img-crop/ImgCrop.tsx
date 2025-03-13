"use client";
import React, { useRef, useState } from "react";
import { useFileDialog } from "@/hooks";
import { useAdjustComic } from "@/hooks/custom/useAdjustComic";
import { cn } from "@/lib/utils";
import { getClipPath, getSvgPoints, getGridStyle } from "../canvas/utils";
import { GridBorder } from "../canvas/grid/GridBorder";
import { GridContent } from "../canvas/grid/GridContent";
import Background from "@/components/background";
import ActionBar, { ActionType } from "@/components/action-bar";
import { CloseIcon, UploadImgIcon, ClearImgIcon, SubmitIcon } from "@/components/action-bar/Icons";
import Mask, { MaskRef, MaskType } from "./Mask";
import { useDragZoom } from "./hooks/useDragZoom";
import { CanvasGridConfig } from "../canvas/types";
import Img, { ImgTarget } from "./Img";

export default function ImgCrop({ grid, onClose }: { grid: CanvasGridConfig, onClose: () => void }) {
  const maskRef = useRef<MaskRef>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<ImgTarget>(null);
  const [maskType, setMaskType] = useState<MaskType>("full")
  const [imgUrl, setImgUrl] = useState<string>(grid?.content?.originImg?.url || "");
  const [originImgSize, setOriginImgSize] = useState({
    width: grid?.content?.originImg?.width || 0,
    height: grid?.content?.originImg?.height || 0
  });
  const [dragX, dragY, zoom, resetDragZoom] = useDragZoom(containerRef, {
    dragX: grid?.content?.originImg?.dragX,
    dragY: grid?.content?.originImg?.dragY,
    zoom: grid?.content?.originImg?.zoom,
  });
  const [, open, reset] = useFileDialog();
  const { adjustGrid } = useAdjustComic();

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
    const mask = maskRef.current;
    if (!canvas || !mask) {
      console.error("handleSubmit canvas and mask is undefined?");
      return;
    }

    if (!imgUrl) {
      adjustGrid(grid.id, {
        content: undefined
      });
      handleClose();
      return;
    }

    const image = imageRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || !image) {
      console.error("handleSubmit ctx and image is undefined?");
      return;
    }

    const { x, y, width: imageWidth, height: imageHeight } = image.getBoundingClientRect()
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

    const cropX = (maskX - x) * scaleX
    const cropY = (maskY - y) * scaleY
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()
    ctx.translate(-cropX, -cropY)
    ctx.translate(centerX, centerY)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)
    ctx.restore()

    const url = canvas.toDataURL('image/png');

    adjustGrid(grid.id, {
      content: {
        ...grid.content,
        url,
        originImg: {
          url: imgUrl,
          width: image.getImgStyle().width,
          height: image.getImgStyle().height,
          dragX,
          dragY,
          zoom,
        }
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
    setOriginImgSize({
      width: 0,
      height: 0,
    })
    resetDragZoom();
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
        className="bg-grid"
      >
        {imgUrl && <Img
          ref={imageRef}
          url={imgUrl}
          dragX={dragX}
          dragY={dragY}
          zoom={zoom}
          defaultWidth={originImgSize.width}
          defaultHeight={originImgSize.height}
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

