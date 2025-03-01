import { CSSProperties, forwardRef } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GridConfig } from "./types";
import { borderWidth } from "./constant";

export interface GridContentProps
    extends HTMLMotionProps<"div"> {
    gridId: GridConfig["id"],
    imgStyle: CSSProperties,
    disableMotion?: boolean,
    clipPath?: string,
    url?: string,
}

export const GridContent = forwardRef<HTMLDivElement, GridContentProps>(
    ({ className, gridId, imgStyle, disableMotion = false, clipPath = "", url = "", ...props }, ref) => {
        // 有时候motion.div会给自己加上opacity:0，原因不明，因此只在必要时（也就是焦点状态）才使用motion.div
        const Comp = (disableMotion ? "div" : motion.div) as (typeof motion.div)
        const extraProps = (disableMotion ? {} : { layoutId: `grid-content-${gridId}` })
        return (
            <Comp
                className={cn(
                    "bg-slate-400 absolute flex flex-wrap content-center justify-center",
                    className
                )}
                ref={ref}
                {
                ...extraProps
                }
                {...props}
                style={{
                    ...props.style,
                    ...clipPath ? { clipPath } : {}
                }}
            >
                {url &&
                    <div className="absolute"
                        style={imgStyle}>
                        <img
                            className="absolute w-full h-full select-none"
                            src={url}
                            alt={"background"} />
                    </div>
                }
            </Comp>
        )
    }
);