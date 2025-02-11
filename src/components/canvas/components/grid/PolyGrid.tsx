import { CSSProperties, MouseEventHandler, useRef } from "react";
import useFocusStore from "@/src/store/focus";
import { isDef } from "@/src/utils";
import { useSplit } from "./hooks/useSplit";
import { getPolyContainerPoint, getPolyGridPoint, getPolyPointBySort } from "./utils";
import { borderWidth } from "./constant";
import { PolyGridConfig } from "./types";
import { Grid } from ".";

export type PolyGridProps = { grid: PolyGridConfig, previewFocus?: boolean, onlyShowBorder?: boolean };
export default function PolyGrid({ grid, previewFocus = false, onlyShowBorder = false }: PolyGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { getFocusId, setFocusId } = useFocusStore();
    const isFocused = getFocusId() === grid.id;

    const { outside } = getPolyGridPoint(grid.path, borderWidth);
    const lt_outside = getPolyContainerPoint(outside, 'lt');
    const rb_outside = getPolyContainerPoint(outside, 'rb');
    const splitGrids = useSplit(grid, isFocused, borderWidth * 2);

    const left = lt_outside.x;
    const top = lt_outside.y;
    const width = rb_outside.x - lt_outside.x;
    const height = rb_outside.y - lt_outside.y;
    const sortPath = getPolyPointBySort(outside);
    const clipPath = `polygon(${sortPath.map(p => `${p.x - left}px ${p.y - top}px`).join(',')})`;
    const customGridStyle = {
        left,
        top,
        width,
        height,
        clipPath,
    } as CSSProperties

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    if (!isDef(lt_outside) || !isDef(rb_outside)) {
        return null;
    }

    return (
        <div>
            {
                <div className={`custom-grid absolute ${(splitGrids || onlyShowBorder) ? "hidden" : ""}`}
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
                        points={grid.path.map(p => `${p.x - left},${p.y - top}`).join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={borderWidth}
                    />
                </svg>
            }
        </div>

    )
}
