import { MouseEventHandler, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDraggable } from "@/hooks";
import { useAdjustComic } from "@/hooks/custom/useAdjustComic";
import useComicStatusStore from "@/store";
import { CanvasGridConfig, Point } from "../types";
import { ContainerContext } from "../context/container";
import { getAdjustedPoint, getGridsBySplit } from "../utils";
import { Grid } from ".";

function SplitPoint({ point, onChange }: { point: Point, onChange: (val: Point, isDrawing: boolean) => void }) {
    const pointRef = useRef<HTMLDivElement>(null);
    const gridRef = useContext(ContainerContext).container;
    const [, ,] = useDraggable(pointRef, {
        initialValue: { x: point.x - 5, y: point.y - 5 },
        containerElement: gridRef,
        preventDefault: true,
        stopPropagation: true,
        onMove(position/*, event*/) {
            onChange({
                x: position.x + 5,
                y: position.y + 5,
            }, true);
        },
        onEnd(position/*, event*/) {
            onChange({
                x: position.x + 5,
                y: position.y + 5,
            }, false);
        },
    });
    return (
        <div ref={pointRef} className='absolute size-[10px] rounded-full bg-black cursor-pointer' style={{ left: point.x - 5, top: point.y - 5 }}></div>
    )
}

export type SplitContainerProps = { grid: CanvasGridConfig, showAsFocused?: boolean, borderOnly?: boolean };
export default function SplitContainer({ grid }: SplitContainerProps) {
    const { adjustGrid } = useAdjustComic();
    const setCurrentGridId = useComicStatusStore(state => state.setCurrentGridId);
    const resetCurrentGridId = useComicStatusStore(state => state.resetCurrentGridId);
    const { getCurrentGridId } = useComicStatusStore();
    const isFocused = getCurrentGridId() === grid.id;

    const splitResult = grid.splitResult!;
    const splitLine = grid.splitLine!;
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(splitLine[0]);
    const [endPoint, setEndPoint] = useState(splitLine[1]);
    useEffect(() => {
        if (!isDrawing) {  // 仅在非绘制状态时同步外部变化
            setStartPoint(splitLine[0]);
            setEndPoint(splitLine[1]);
        }
    }, [splitLine, isDrawing]);
    const [middlePoint, setMiddlePoint] = useState({
        x: (startPoint.x + endPoint.x) / 2,
        y: (startPoint.y + endPoint.y) / 2
    });
    useEffect(() => {
        setMiddlePoint({
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2
        });
    }, [startPoint, endPoint]);

    const defaultSplitResult = { grids: splitResult, line: grid.splitLine };
    const { grids: splitGrids, line } = isDrawing && (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], { spaceWidth: grid.splitSpaceWidth!, recursion: true }) || defaultSplitResult;
    const { grids: borderGrids } = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], { spaceWidth: grid.splitSpaceWidth!, recursion: false }) || defaultSplitResult;

    const handleClickLine: MouseEventHandler<Element> = (e) => {
        try {
            if (isFocused) {
                return;
            }
            resetCurrentGridId();
            setTimeout(() => {
                setCurrentGridId(grid.id);
            });
        } finally {
            e.nativeEvent.stopImmediatePropagation();
        }
    }

    const handleDragglePoint = (type: "start" | "end" | "middle") => {
        return (point: Point, newIsDrawing: boolean) => {
            switch (type) {
                case "start":
                    const newStartPoint = getAdjustedPoint(point, endPoint!, { direction: "start" })
                    setStartPoint(newStartPoint);
                    break;
                case "end":
                    const newEndPoint = getAdjustedPoint(startPoint!, point, { direction: "end" })
                    setEndPoint(newEndPoint);
                    break;
                case "middle":
                    const offset = { x: point.x - middlePoint.x, y: point.y - middlePoint.y };
                    setStartPoint({ x: startPoint.x + offset.x, y: startPoint.y + offset.y });
                    setEndPoint({ x: endPoint.x + offset.x, y: endPoint.y + offset.y });
                    setMiddlePoint(point);
                    break;
                default:
                    break;
            }
            setIsDrawing(newIsDrawing)
            if (!newIsDrawing) {
                if (splitGrids) {
                    adjustGrid(grid.id, {
                        splitLine: JSON.parse(JSON.stringify(line)),
                        splitResult: JSON.parse(JSON.stringify(splitGrids)),
                        splitSpaceWidth: grid.splitSpaceWidth,
                    })
                }
            }
        }
    }

    return (<div>
        {
            startPoint && endPoint && (
                <svg
                    className={cn(
                        "absolute top-0 left-0 w-full h-full",
                        isFocused ? "opacity-100" : "opacity-0"
                    )}
                    style={{ pointerEvents: "none" }}
                >
                    <line
                        x1={startPoint.x}
                        y1={startPoint.y}
                        x2={endPoint.x}
                        y2={endPoint.y}
                        stroke="transparent"
                        strokeWidth={grid.splitSpaceWidth}
                        pointerEvents="all"
                        onClick={handleClickLine}
                    />
                    <line
                        x1={startPoint.x}
                        y1={startPoint.y}
                        x2={endPoint.x}
                        y2={endPoint.y}
                        stroke="gray"
                        strokeWidth="4"
                        strokeDasharray={5}
                        pointerEvents="none"
                    />
                </svg>
            )
        }
        {
            splitGrids && (splitGrids.map(grid_ => (<Grid grid={grid_} key={grid_.id} />)))
        }
        {
            isFocused && borderGrids && (borderGrids.map(grid_ => (<Grid grid={grid_} key={"border" + grid_.id} borderOnly showAsFocused />)))
        }
        {
            isFocused && startPoint && endPoint && (
                <>
                    <SplitPoint point={startPoint} onChange={handleDragglePoint("start")} />
                    <SplitPoint point={middlePoint} onChange={handleDragglePoint("middle")} />
                    <SplitPoint point={endPoint} onChange={handleDragglePoint("end")} />
                </>
            )
        }
    </div>)
}