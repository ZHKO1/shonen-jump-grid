import { CSSProperties, MouseEventHandler, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useFocusStore from "@/store/config";
import { isDef } from "@/lib";
import { useSplit } from "./hooks/useSplit";
import { getPolyContainerPoint, getPolyGridPoint, getPolyPointBySort } from "./utils";
import { borderWidth } from "./constant";
import { PolyGridConfig } from "./types";
import { Grid } from ".";

export type PolyGridProps = { grid: PolyGridConfig, showAsFocused?: boolean, borderOnly?: boolean };
export default function PolyGrid({ grid, showAsFocused = false, borderOnly = false }: PolyGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { getGridFocusId, setGridFocusId } = useFocusStore();
    const isFocused = getGridFocusId() === grid.id;
    const NewDiv = isFocused ? motion.div : "div";

    const { outside } = getPolyGridPoint(grid.path, borderWidth);
    const lt_outside = getPolyContainerPoint(outside, 'lt');
    const rb_outside = getPolyContainerPoint(outside, 'rb');
    const splitGrids = useSplit(grid, isFocused, borderWidth * 2);

    const left = lt_outside.x;
    const top = lt_outside.y;
    const width = rb_outside.x - lt_outside.x;
    const height = rb_outside.y - lt_outside.y;
    const sortPath = getPolyPointBySort(outside);
    const clipPath = `polygon(${sortPath.map(p => `${p.x - left}px ${p.y - top}px`).join(',')})`;
    const customGridPosStyle = {
        left,
        top,
    } as CSSProperties
    const customGridSizeStyle = {
        width,
        height,
    } as CSSProperties
    const customGridClipPathStyle = {
        clipPath,
    } as CSSProperties    
    const customGridStyle = {
        ...customGridPosStyle,
        ...customGridSizeStyle,
        ...customGridClipPathStyle,
    };

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    const shouldHideContent = (splitGrids || borderOnly);
    const shouldShowBorder = (isFocused && !splitGrids) || showAsFocused;

    const getSplitGridId = (index: number) => `${grid.id}_split_${index}`;

    if (!isDef(lt_outside) || !isDef(rb_outside)) {
        return null;
    }

    return (
        <div>
            <NewDiv
                className={cn(
                    "bg-slate-400 absolute",
                    shouldHideContent && "hidden"
                )}
                style={customGridStyle}
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
                        "absolute w-full h-full pointer-events-none",
                        splitGrids && "hidden",
                        shouldShowBorder ? "animate-breathe" : "text-gray-200"
                    )}
                    style={customGridSizeStyle}
                >
                    <polygon
                        points={grid.path.map(p => `${p.x - left},${p.y - top}`).join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={borderWidth}
                    />
                </svg>
            </NewDiv>
        </div>
    )
}
