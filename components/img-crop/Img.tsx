import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

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

  return (<>
    {
      imgUrl && <img
        className={cn("absolute top-0 bottom-0 left-0 right-0 m-auto max-w-full max-h-full select-none", className)}
        src={imgUrl}
        style={{
          ...style,
          transform: `translate(${imageX}px, ${imageY}px) scale(${imageZoom})`,
        }}
        ref={ref}
        {...props}
      />
    }</>
  );
})

Img.displayName = "Img";

export default Img;