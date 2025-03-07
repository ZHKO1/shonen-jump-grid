import { MouseEventHandler, useRef } from "react";
import useComicStatusStore from "@/store";
import { RectGridConfig } from "./types";
import { getGridStyle, getSvgPoints } from "./utils";
import { BORDER_WIDTH } from "./constant";
import { GridBorder } from "./GridBorder";
import { GridContent } from "./GridContent";
import { Grid } from ".";
import { useSplit } from "./hooks/useSplit";
import { useEventListener } from "@/hooks";
import { cn } from "@/lib/utils";

export interface RectGridProps {
    grid: RectGridConfig,
    showAsFocused?: boolean,
    borderOnly?: boolean
}

export default function RectGrid({ grid, showAsFocused = false, borderOnly = false }: RectGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const setCurrentGridId = useComicStatusStore(state => state.setCurrentGridId);
    const { getCurrentGridId } = useComicStatusStore();
    const isFocused = getCurrentGridId() === grid.id;
    const splitGrids = useSplit(grid, isFocused, BORDER_WIDTH * 2);
    const shouldShowBorder = (isFocused && !splitGrids) || showAsFocused;
    const getSplitGridId = (index: number) => `${grid.id}_split_${index}`;

    const {
        imgStyle,
        posStyleWithBorder,
        sizeStyleWithBorder,
        svgPath,
    } = getGridStyle(grid);
    const svgPoints = getSvgPoints(svgPath);

    const gridStyle = {
        ...posStyleWithBorder,
        ...sizeStyleWithBorder
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setCurrentGridId(grid.id);
        e.stopPropagation();
        // e.nativeEvent.stopImmediatePropagation();
    }

    useEventListener("click", handleClick, gridRef && gridRef.current);

    return (
        <div>
            {
                !(splitGrids || borderOnly) && (<GridContent
                    className={cn(isFocused && "z-10")}
                    disableMotion={!isFocused}
                    gridId={grid.id}
                    style={gridStyle}
                    ref={gridRef}
                    url={grid.content?.url}
                    imgStyle={imgStyle}
                    // onClick={handleClick}
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
                    <GridBorder
                        className={cn(isFocused && "z-10")}
                        disableMotion={!isFocused}
                        gridId={grid.id}
                        svgPoints={svgPoints}
                        containerStyle={posStyleWithBorder}
                        svgStyle={sizeStyleWithBorder}
                        focused={shouldShowBorder}
                    />
                )
            }
        </div>
    )
}