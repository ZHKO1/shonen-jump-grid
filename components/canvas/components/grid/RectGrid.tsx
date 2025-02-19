import { CSSProperties, MouseEventHandler, useRef } from "react";
import useFocusStore from "@/store/config";
import { RectGridConfig } from "./types";
import { getGridStyle, getRectGridPoint } from "./utils";
import { borderWidth } from "./constant";
import { GridBorder } from "./GridBorder";
import { GridContent } from "./GridContent";
import { Grid } from ".";
import { useSplit } from "./hooks/useSplit";

export interface RectGridProps {
    grid: RectGridConfig,
    showAsFocused?: boolean,
    borderOnly?: boolean
}

export default function RectGrid({ grid, showAsFocused = false, borderOnly = false }: RectGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { getGridFocusId, setGridFocusId } = useFocusStore();
    const isFocused = getGridFocusId() === grid.id;

    const splitGrids = useSplit(grid, isFocused, borderWidth * 2);
    const shouldShowBorder = (isFocused && !splitGrids) || showAsFocused;

    const {
        gridPosStyle,
        gridSizeStyle,
        svgPoints,
    } = getGridStyle(grid);

    const gridStyle = {
        ...gridPosStyle,
        ...gridSizeStyle
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    const getSplitGridId = (index: number) => `${grid.id}_split_${index}`;

    return (
        <div>
            {
                !(splitGrids || borderOnly) && (<GridContent
                    disableMotion={!isFocused}
                    gridId={grid.id}
                    style={gridStyle}
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