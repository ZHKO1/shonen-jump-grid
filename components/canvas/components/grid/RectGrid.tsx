import { forwardRef, CSSProperties, MouseEventHandler, useRef } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import useFocusStore from "@/store/config";
import { cn } from "@/lib/utils";
import { GridConfig, RectGridConfig } from "./types";
import { getRectGridPoint } from "./utils";
import { borderWidth } from "./constant";
import { Grid } from ".";
import { useSplit } from "./hooks/useSplit";

export interface RectGridContentProps
    extends HTMLMotionProps<"div"> {
    gridId: GridConfig["id"],
    disableMotion?: boolean,
}

export interface RectGridBorderProps
    extends HTMLMotionProps<"div"> {
    gridId: GridConfig["id"],
    disableMotion?: boolean,
    svgPoints: string,
    focused?: boolean,
    containerStyle?: CSSProperties,
    svgStyle?: CSSProperties,
}

export interface RectGridProps {
    grid: RectGridConfig,
    showAsFocused?: boolean,
    borderOnly?: boolean
}

export const RectGridContent = forwardRef<HTMLDivElement, RectGridContentProps>(
    ({ className, gridId, disableMotion = false, ...props }, ref) => {
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
            />
        )
    }
);

export const RectGridBorder = forwardRef<HTMLDivElement, RectGridBorderProps>(
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
                        strokeWidth={borderWidth}
                    />
                </svg>
            </Comp>
        )
    }
);

export default function RectGrid({ grid, showAsFocused = false, borderOnly = false }: RectGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { getGridFocusId, setGridFocusId } = useFocusStore();
    const isFocused = getGridFocusId() === grid.id;

    const { outside } = getRectGridPoint({
        ...grid
    }, borderWidth);
    const splitGrids = useSplit(grid, isFocused, borderWidth * 2);
    const shouldShowBorder = (isFocused && !splitGrids) || showAsFocused;

    const left = outside.lt_x;
    const top = outside.lt_y;
    const width = outside.rb_x - outside.lt_x;
    const height = outside.rb_y - outside.lt_y;
    const customGridPosStyle = {
        left,
        top,
    } as CSSProperties
    const customGridSizeStyle = {
        width,
        height,
    } as CSSProperties
    const customGridStyle = {
        ...customGridPosStyle,
        ...customGridSizeStyle
    };
    const svgPoints = ([{ x: grid.lt_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.rb_y }, { x: grid.lt_x, y: grid.rb_y }]).map(p => `${p.x - left},${p.y - top}`).join(' ')

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    const getSplitGridId = (index: number) => `${grid.id}_split_${index}`;

    return (
        <div>
            {
                !(splitGrids || borderOnly) && (<RectGridContent
                    disableMotion={!isFocused}
                    gridId={grid.id}
                    style={customGridStyle}
                    ref={gridRef}
                    onClick={handleClick}
                />)
            }

            {splitGrids?.map((grid_, index) => (
                <Grid
                    grid={{ ...grid_, id: getSplitGridId(index) }}
                    key={getSplitGridId(index)}
                    showAsFocused
                />
            ))}

            {
                !splitGrids && (
                    <RectGridBorder
                        disableMotion={!isFocused}
                        gridId={grid.id}
                        svgPoints={svgPoints}
                        containerStyle={customGridPosStyle}
                        svgStyle={customGridSizeStyle}
                        focused={shouldShowBorder}
                    />
                )
            }
        </div>
    )
}