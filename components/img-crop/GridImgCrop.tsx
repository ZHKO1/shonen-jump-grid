"use client";
import { useAdjustComic } from "@/hooks/custom/useAdjustComic";
import { cn } from "@/lib/utils";
import { getClipPath, getSvgPoints, getGridStyle } from "@/components/canvas/utils";
import { GridBorder } from "@/components/canvas/grid/GridBorder";
import { GridContent } from "@/components/canvas/grid/GridContent";
import { MaskType } from "./Mask";
import { CanvasGridConfig, CanvasOriginImgConfig } from "@/components/canvas/types";
import ImgCrop from "./ImgCrop";

export default function GridImgCrop({ grid, onClose }: { grid: CanvasGridConfig, onClose: () => void }) {
  const {
    imgStyle,
    sizeStyle,
    sizeStyleWithBorder,
    svgPath,
    svgPathWithBorder,
  } = getGridStyle(grid);
  const svgPoints = getSvgPoints(svgPath);
  const clipPath = svgPathWithBorder && getClipPath(svgPathWithBorder) || "";
  const originImg = grid.content?.originImg ? grid.content?.originImg :
    grid.content?.url ?
      {
        url: grid.content?.url || "",
        ...sizeStyle,
        dragX: 0,
        dragY: 0,
        zoom: 1,
      } :
      {
        url: "",
        width: 0,
        height: 0,
        dragX: 0,
        dragY: 0,
        zoom: 1,
      };

  const { adjustGrid } = useAdjustComic();

  const onSubmit = (url: string, originImg: CanvasOriginImgConfig) => {
    adjustGrid(grid.id, {
      content: {
        ...grid.content,
        url,
        originImg
      }
    });
  }

  const onClean = () => {
    adjustGrid(grid.id, {
      content: undefined
    });
  }

  const renderContent = (maskType: MaskType, onAnimationComplete: () => void) => (
    <>
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
    </>
  )

  return (
    <ImgCrop
      originImg={originImg}
      maskCropPath={svgPath}
      renderContent={renderContent}
      onClean={onClean}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}

