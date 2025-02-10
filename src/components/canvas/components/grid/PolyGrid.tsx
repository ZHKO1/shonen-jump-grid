import { MouseEventHandler, useRef } from "react";
import { PolyGridConfig } from "./types";
import useFocusStore from "@/src/store/focus";
import { getPolyContainerPoint, getPolyGridPoint, getPolyPointBySort } from "./utils";
import { isDef } from "@/src/utils";
import { useSplit } from "./hooks/useSplit";
import { borderWidth } from "./constant";
import { Grid } from ".";

export default function PolyGrid({ grid, border = false }: { grid: PolyGridConfig, border?: boolean }) {
    const gridRef = useRef<HTMLDivElement>(null);
    // const [isGridFocused, setGridFocus] = useFocusGrid(gridRef);
    const { getFocusId, setFocusId } = useFocusStore();
    const isFocused = getFocusId() === grid.id;

    const { outside, inside } = getPolyGridPoint(grid.path, borderWidth);
    let lt_outside = getPolyContainerPoint(outside, 'lt');
    let rb_outside = getPolyContainerPoint(outside, 'rb');
    if (!isDef(lt_outside) || !isDef(rb_outside)) {
        return null;
    }
    let grids = useSplit(grid, isFocused, borderWidth * 2);

    let left = lt_outside.x;
    let top = lt_outside.y;
    let width = rb_outside.x - lt_outside.x;
    let height = rb_outside.y - lt_outside.y;
    let sortPath = getPolyPointBySort(outside);
    let clipPath = `polygon(${sortPath.map(p => `${p.x - left}px ${p.y - top}px`).join(',')})`;
    let contentStyle = {
        width: `100%`,
        height: `100%`,
        clipPath: `polygon(${inside.map(p => `${p.x - left}px ${p.y - top}px`).join(',')})`,
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    return (
        <div>
            {
                <div className={`opacity-60 custom-grid absolute ${(isFocused && !grids || border) ? "animate-breathe" : "bg-gray-200"}`}
                    style={{ left, top, width, height, clipPath }}
                    ref={gridRef}
                    onClick={handleClick}
                >
                    <div className="custom-grid-content bg-white" style={{ ...contentStyle }}></div>
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
