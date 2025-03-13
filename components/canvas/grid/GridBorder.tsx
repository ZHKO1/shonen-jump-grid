import { forwardRef, CSSProperties } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CanvasGridConfig } from "../types";
import { BORDER_WIDTH } from "../constant";

export interface GridBorderProps
    extends HTMLMotionProps<"div"> {
    gridId: CanvasGridConfig["id"],
    disableMotion?: boolean,
    svgPoints: string,
    focused?: boolean,
    containerStyle?: CSSProperties,
    svgStyle?: CSSProperties,
}

export const GridBorder = forwardRef<HTMLDivElement, GridBorderProps>(
    ({ className, gridId, svgPoints, disableMotion = false, focused = false, containerStyle = {}, svgStyle = {}, ...props }, ref) => {
        const Comp = (disableMotion ? "div" : motion.div) as (typeof motion.div)
        const extraProps = (disableMotion ? {} : { layoutId: `grid-border-${gridId}` })
        return (
            <Comp
                className={cn("absolute pointer-events-none", className)}
                ref={ref}
                {
                ...extraProps
                }
                {...props}
                style={{
                    ...props.style,
                    ...containerStyle
                }}
            >
                <svg
                    className={cn(
                        "pointer-events-none",
                        focused ? "animate-breathe" : "text-gray-200"
                    )}
                    style={svgStyle}
                >
                    <polygon
                        points={svgPoints}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={BORDER_WIDTH}
                    />
                </svg>
            </Comp>
        )
    }
);

GridBorder.displayName = "GridBorder";