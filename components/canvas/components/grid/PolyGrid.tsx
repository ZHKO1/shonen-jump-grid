import { CSSProperties, MouseEventHandler, useRef } from "react";
import useFocusStore from "@/store/config";
import { isDef } from "@/lib";
import { useSplit } from "./hooks/useSplit";
import { getGridStyle, getPolyContainerPoint, getPolyGridPoint, getPolyPointBySort } from "./utils";
import { borderWidth } from "./constant";
import { PolyGridConfig } from "./types";
import { GridBorder } from "./GridBorder";
import { GridContent } from "./GridContent";
import { Grid } from ".";

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

    const {
        gridPosStyle,
        gridSizeStyle,
        svgPoints,
        clipPath,
    } = getGridStyle(grid);

    const gridStyle = {
        ...gridPosStyle,
        ...gridSizeStyle
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    const shouldShowBorder = (isFocused && !splitGrids) || showAsFocused;

    const getSplitGridId = (index: number) => `${grid.id}_split_${index}`;

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
                    <GridBorder
                        disableMotion={!isFocused}
                        gridId={grid.id}
                        svgPoints={svgPoints}
                        containerStyle={gridPosStyle}
                        svgStyle={gridSizeStyle}
                        focused={shouldShowBorder}
                    />
                )
            }
        </div>
    )
}
