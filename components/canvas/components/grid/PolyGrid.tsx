import { MouseEventHandler, useRef } from "react";
import useFocusStore from "@/store/config";
import { isDef } from "@/lib";
import { useSplit } from "./hooks/useSplit";
import { getClipPath, getGridStyle, getSvgPoints } from "./utils";
import { borderWidth } from "./constant";
import { PolyGridConfig } from "./types";
import { GridBorder } from "./GridBorder";
import { GridContent } from "./GridContent";
import { Grid } from ".";
import { useEventListener } from "@/hooks";

export interface PolyGridProps {
    grid: PolyGridConfig,
    showAsFocused?: boolean,
    borderOnly?: boolean
};
export default function PolyGrid({ grid, showAsFocused = false, borderOnly = false }: PolyGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { getGridFocusId, setGridFocusId } = useFocusStore();
    const isFocused = getGridFocusId() === grid.id;
    const splitGrids = useSplit(grid, isFocused, borderWidth * 2);
    const shouldShowBorder = (isFocused && !splitGrids) || showAsFocused;
    const getSplitGridId = (index: number) => `${grid.id}_split_${index}`;

    const {
        posStyleWithBorder,
        sizeStyleWithBorder,
        svgPath,
        svgPathWithBorder,
    } = getGridStyle(grid);
    const svgPoints = getSvgPoints(svgPath);
    const clipPath = getClipPath(svgPathWithBorder!);

    const gridStyle = {
        ...posStyleWithBorder,
        ...sizeStyleWithBorder
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocusId(grid.id);
        // e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
    }

    useEventListener("click", handleClick, gridRef && gridRef.current);

    return (
        <div>
            {
                !(splitGrids || borderOnly) && (<GridContent
                    disableMotion={!isFocused}
                    gridId={grid.id}
                    style={{
                        ...gridStyle
                    }}
                    clipPath={clipPath}
                    ref={gridRef}
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
