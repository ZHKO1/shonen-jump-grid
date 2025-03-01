import { forwardRef, HTMLAttributes, RefObject, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useIsomorphicLayoutEffect, useWindowSize } from "@/hooks";
import { cn } from "@/lib/utils";
import { getImageSize } from "./utils";
import { HTMLMotionProps, motion } from "framer-motion";

export type ImgTarget = {
  getImgStyle: () => { width: number, height: number, left: number, top: number }
} & HTMLImageElement

interface ImgProps extends HTMLMotionProps<'img'> {
  url: string;
  dragX: number;
  dragY: number;
  zoom: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

const Img = forwardRef<
  ImgTarget,
  ImgProps
>(({ url, dragX, dragY, zoom, defaultWidth = 0, defaultHeight = 0, className, style, ...props }, ref) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({ left: 0, top: 0, width: defaultWidth, height: defaultHeight });
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const imageSizePromise = useMemo(() => getImageSize(url), [url]);

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

  useImperativeHandle(ref, () => {
    return Object.assign(imgRef.current!, {
      getImgStyle: () => {
        return dimensions
      }
    })
  });

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

  return <motion.img
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    exit={{
      opacity: 0,
    }}
    className={cn("absolute select-none max-w-none max-h-none", className)}
    src={url}
    style={{
      ...style,
      transform: `translate(${dragX}px, ${dragY}px) scale(${zoom})`,
      left: dimensions.left,
      top: dimensions.top,
      width: dimensions.width,
      height: dimensions.height,
    }}
    ref={imgRef}
    {...props}
  />
})

Img.displayName = "Img";

export default Img;