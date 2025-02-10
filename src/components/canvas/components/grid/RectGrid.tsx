import { MouseEventHandler, useRef } from "react";
import { RectGridConfig } from "./types";
import useFocusStore from "@/src/store/focus";
import { getRectGridPoint } from "./utils";
import { borderWidth } from "./constant";
import { Grid } from ".";
import { useSplit } from "./hooks/useSplit";

export default function RectGrid({ grid, border = false }: { grid: RectGridConfig, border?: boolean }) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { getFocusId, setFocusId } = useFocusStore();
    const isFocused = getFocusId() === grid.id;
    const { outside } = getRectGridPoint({
        ...grid
    }, borderWidth);
    const grids = useSplit(grid, isFocused, borderWidth * 2);

    const left = outside.lt_x;
    const top = outside.lt_y;
    const width = outside.rb_x - outside.lt_x;
    const height = outside.rb_y - outside.lt_y;
    const customGridStyle = {
        left,
        top,
        width,
        height,
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    return (
        <div>
            {
                <div className={`custom-grid absolute ${grids ? "hidden" : ""} flex flex-wrap content-center justify-center`}
                    style={customGridStyle}
                    ref={gridRef}
                    onClick={handleClick}
                >
                </div>
            }
            {
                grids && (grids.map((grid_, index) => (<Grid grid={{ ...grid_, id: (new Date()).getTime() + "_" + index }} key={(new Date()).getTime() + "_" + index} border={true} />)))
            }
            {
                <svg className={`absolute w-full h-full pointer-events-none ${grids ? "hidden" : ""} ${(isFocused && !grids || border) ? "animate-breathe_" : "text-gray-200"}`}
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