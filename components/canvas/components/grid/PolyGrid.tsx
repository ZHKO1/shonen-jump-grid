import { MouseEventHandler, useRef } from "react";
import useComicStatusStore from "@/store";
import { useSplit } from "./hooks/useSplit";
import { getClipPath, getGridStyle, getSvgPoints } from "./utils";
import { BORDER_WIDTH } from "./constant";
import { CanvasPolyGridConfig } from "./types";
import { GridBorder } from "./GridBorder";
import { GridContent } from "./GridContent";
import { Grid } from ".";
import { useEventListener } from "@/hooks";
import { cn } from "@/lib/utils";
import { GridIcon, GridIconProps } from "./GridIcon";

export interface PolyGridProps {
    grid: CanvasPolyGridConfig,
    showAsFocused?: boolean,
    borderOnly?: boolean
};
export default function PolyGrid({ grid, showAsFocused = false, borderOnly = false }: PolyGridProps) {
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
        svgPathWithBorder,
        focusIconPosStyle,
    } = getGridStyle(grid);
    const svgPoints = getSvgPoints(svgPath);
    const clipPath = getClipPath(svgPathWithBorder!);

    const gridStyle = {
        ...posStyleWithBorder,
        ...sizeStyleWithBorder
    }

    const { focus } = grid.content || {};
    let animation = "" as GridIconProps["iconType"] | "";
    switch (focus?.type) {
        case "move":
            animation = focus.direction;
            break;
        case "change-background":
            animation = "gray-to-color";
            break;
        default:
            break;
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setCurrentGridId(grid.id);
        // e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
    }

    useEventListener("click", handleClick, gridRef && gridRef.current);

    return (
        <div>
            {
                !(splitGrids || borderOnly) && (<GridContent
                    className={cn(isFocused && "z-10")}
                    disableMotion={!isFocused}
                    gridId={grid.id}
                    style={{
                        ...gridStyle
                    }}
                    clipPath={clipPath}
                    ref={gridRef}
                    url={grid.content?.url}
                    imgStyle={imgStyle}
                >
                    {animation && <GridIcon
                        className={focusIconPosStyle && "absolute"}
                        iconType={animation}
                        style={focusIconPosStyle}
                    />}
                </GridContent>)
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
