import { MouseEventHandler, useRef } from "react";
import { RectGridConfig } from "./types";
import useFocusStore from "@/src/store/focus";
import { getRectGridPoint } from "./utils";
import { borderWidth } from "./constant";
import { Grid } from ".";
import { useSplit } from "./hooks/useSplit";

export default function RectGrid({ grid, border = false }: { grid: RectGridConfig, border?: boolean }) {
    const gridRef = useRef<HTMLDivElement>(null);
    // const [isGridFocused, setGridFocus] = useFocusGrid(gridRef, isDefaultFocused);
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
    const contentStyle = {
        width: `calc(100% - ${borderWidth * 2}px)`,
        height: `calc(100% - ${borderWidth * 2}px)`,
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    return (
        <div>
            {
                <div className={`opacity-60 custom-grid absolute ${grids ? "hidden" : ""} ${(isFocused && !grids || border) ? "animate-breathe" : "bg-gray-200"} flex flex-wrap content-center justify-center`}
                    style={{ left, top, width, height }}
                    ref={gridRef}
                    onClick={handleClick}
                >
                    <div className="custom-grid-content bg-white" style={contentStyle}></div>
                </div>

            }
            {
                grids && (grids.map((grid_, index) => (<Grid grid={{ ...grid_, id: (new Date()).getTime() + "_" + index }} key={(new Date()).getTime() + "_" + index} border={true} />)))
            }
            {
                /*
                startPoint && endPoint && (
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <line
                            x1={startPoint.x}
                            y1={startPoint.y}
                            x2={endPoint.x}
                            y2={endPoint.y}
                            stroke="black"
                            strokeWidth="2"
                        />
                    </svg>
                )
                */
            }
        </div>
    )
}