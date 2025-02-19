import { forwardRef } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GridConfig } from "./types";

export interface GridContentProps
    extends HTMLMotionProps<"div"> {
    gridId: GridConfig["id"],
    disableMotion?: boolean,
    clipPath?: string,
}

export const GridContent = forwardRef<HTMLDivElement, GridContentProps>(
    ({ className, gridId, disableMotion = false, clipPath = "", ...props }, ref) => {
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
            />
        )
    }
);