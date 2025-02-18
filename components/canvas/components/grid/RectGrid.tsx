import { CSSProperties, MouseEventHandler, useRef } from "react";
import { motion } from "framer-motion";
import useFocusStore from "@/store/config";
import { cn } from "@/lib/utils";
import { RectGridConfig } from "./types";
import { getRectGridPoint } from "./utils";
import { borderWidth } from "./constant";
import { Grid } from ".";
import { useSplit } from "./hooks/useSplit";

export type RectGridProps = { grid: RectGridConfig, showAsFocused?: boolean, borderOnly?: boolean };
export default function RectGrid({ grid, showAsFocused = false, borderOnly = false }: RectGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { getGridFocusId, setGridFocusId } = useFocusStore();
    const isFocused = getGridFocusId() === grid.id;
    // 有时候motion.div会给自己加上opacity:0，原因不明，因此只在必要时（也就是焦点状态）才使用motion.div
    const NewDiv = isFocused ? motion.div : "div";
    const { outside } = getRectGridPoint({
        ...grid
    }, borderWidth);
    const splitGrids = useSplit(grid, isFocused, borderWidth * 2);

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

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    const shouldShowBorder = (isFocused && !splitGrids) || showAsFocused;

    const gridContainerStyle = {
        ...customGridPosStyle,
        ...customGridSizeStyle
    };

    const getSplitGridId = (index: number) => `${grid.id}_split_${index}`;

    return (
        <div>
            <NewDiv
                className={cn(
                    "bg-slate-400 absolute flex flex-wrap content-center justify-center",
                    (splitGrids || borderOnly) && "hidden"
                )}
                style={gridContainerStyle}
                ref={gridRef}
                onClick={handleClick}
                {
                ...(isFocused ? { layoutId: `grid-content-${grid.id}` } : {})
                }
            />

            {splitGrids?.map((grid_, index) => (
                <Grid
                    grid={{ ...grid_, id: getSplitGridId(index) }}
                    key={getSplitGridId(index)}
                    showAsFocused
                />
            ))}

            <NewDiv
                className="absolute pointer-events-none"
                {
                ...(isFocused ? { layoutId: `grid-border-${grid.id}` } : {})
                }
                style={customGridPosStyle}
            >
                <svg
                    className={cn(
                        "pointer-events-none",
                        splitGrids && "hidden",
                        shouldShowBorder ? "animate-breathe" : "text-gray-200"
                    )}
                    style={customGridSizeStyle}
                >
                    <polygon
                        points={([{ x: grid.lt_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.rb_y }, { x: grid.lt_x, y: grid.rb_y }]).map(p => `${p.x - left},${p.y - top}`).join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={borderWidth}
                    />
                </svg>
            </NewDiv>
        </div>
    )
}