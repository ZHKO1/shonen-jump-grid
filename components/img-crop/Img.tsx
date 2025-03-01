import { forwardRef, HTMLAttributes, useMemo, useState } from "react";
import { useIsomorphicLayoutEffect, useWindowSize } from "@/hooks";
import { cn } from "@/lib/utils";
import { getImageSize } from "./utils";

interface ImgProps extends HTMLAttributes<HTMLImageElement> {
  imgUrl: string;
  imageX: number;
  imageY: number;
  imageZoom: number;
}

const Img = forwardRef<
  HTMLImageElement,
  ImgProps
>(({ imgUrl, imageX, imageY, imageZoom, className, style, ...props }, ref) => {
  const [dimensions, setDimensions] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const imageSizePromise = useMemo(() => getImageSize(imgUrl), [imgUrl]);

  const initImageWH = () => {
    return imageSizePromise.then(({ width, height }) => {
      if (width < windowWidth && height < windowHeight) {
        setDimensions(state => ({
          ...state,
          width,
          height
        }));
      } else {
        const maxWidth_W = windowWidth - 20;
        const maxHeight_W = maxWidth_W / width * height;
        if (maxHeight_W < windowHeight - 20) {
          console.log(maxWidth_W, maxHeight_W);
          setDimensions(state => ({
            ...state,
            width: maxWidth_W,
            height: maxHeight_W
          }));
          return;
        }
        const maxHeight_H = windowHeight - 20;
        const maxWidth_H = maxHeight_H / height * width;
        if (maxWidth_H < windowWidth - 20) {
          console.log(maxWidth_H, maxHeight_H);
          setDimensions(state => ({
            ...state,
            width: maxWidth_H,
            height: maxHeight_H
          }));
          return;
        }
        throw new Error("calc img width height error");
      }
    }).catch(e => {
      console.error(e);
    });
  }

  useIsomorphicLayoutEffect(() => {
    let promise = Promise.resolve();
    if (dimensions.width == 0 || dimensions.height == 0) {
      promise = initImageWH();
    }
    promise.then(() => {
      setDimensions(state => {
        return {
          ...state,
          left: (windowWidth - state.width) / 2,
          top: (windowHeight - state.height) / 2,
        }
      });
    })
  }, [imageSizePromise, windowWidth, windowHeight]);

  return <img
    className={cn("absolute select-none max-w-none max-h-none", className)}
    src={imgUrl}
    style={{
      ...style,
      transform: `translate(${imageX}px, ${imageY}px) scale(${imageZoom})`,
      left: dimensions.left,
      top: dimensions.top,
      width: dimensions.width,
      height: dimensions.height,
    }}
    ref={ref}
    {...props}
  />
})

Img.displayName = "Img";

export default Img;