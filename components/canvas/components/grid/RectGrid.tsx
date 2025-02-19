import { CSSProperties, MouseEventHandler, useRef } from "react";
import useFocusStore from "@/store/config";
import { RectGridConfig } from "./types";
import { getRectGridPoint } from "./utils";
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
                !(splitGrids || borderOnly) && (<GridContent
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
                    <GridBorder
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