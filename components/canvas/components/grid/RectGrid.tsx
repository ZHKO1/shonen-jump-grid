import { CSSProperties, MouseEventHandler, useRef } from "react";
import { RectGridConfig } from "./types";
import useFocusStore from "@/store/focus";
import { getRectGridPoint } from "./utils";
import { borderWidth } from "./constant";
import { Grid } from ".";
import { useSplit } from "./hooks/useSplit";

export type RectGridProps = { grid: RectGridConfig, previewFocus?: boolean, onlyShowBorder?: boolean };
export default function RectGrid({ grid, previewFocus = false, onlyShowBorder = false }: RectGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { getFocusId, setFocusId } = useFocusStore();
    const isFocused = getFocusId() === grid.id;
    const { outside } = getRectGridPoint({
        ...grid
    }, borderWidth);
    const splitGrids = useSplit(grid, isFocused, borderWidth * 2);

    const left = outside.lt_x;
    const top = outside.lt_y;
    const width = outside.rb_x - outside.lt_x;
    const height = outside.rb_y - outside.lt_y;
    const customGridStyle = {
        left,
        top,
        width,
        height,
    } as CSSProperties

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    return (
        <div>
            {
                <div className={`custom-grid absolute ${(splitGrids || onlyShowBorder) ? "hidden" : ""} flex flex-wrap content-center justify-center`}
                    style={customGridStyle}
                    ref={gridRef}
                    onClick={handleClick}
                >
                </div>
            }
            {
                splitGrids && (splitGrids.map((grid_, index) => (<Grid grid={{ ...grid_, id: (new Date()).getTime() + "_" + index }} key={(new Date()).getTime() + "_" + index} previewFocus={true} />)))
            }
            {
                <svg className={`absolute w-full h-full pointer-events-none ${splitGrids ? "hidden" : ""} ${(isFocused && !splitGrids || previewFocus || onlyShowBorder) ? "animate-breathe_" : "text-gray-200"}`}
                    style={{ left, top }}
                >
                    <polygon
                        points={([{ x: grid.lt_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.lt_y }, { x: grid.rb_x, y: grid.rb_y }, { x: grid.lt_x, y: grid.rb_y }]).map(p => `${p.x - left},${p.y - top}`).join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={borderWidth}
                    />
                </svg>
            }
        </div>
    )
}