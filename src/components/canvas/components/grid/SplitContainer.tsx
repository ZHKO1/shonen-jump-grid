import { MouseEventHandler, useContext, useEffect, useRef, useState } from "react";
import { GridConfig, Point } from "./types";
import { ContainerContext } from "../../context/container";
import { useDraggable } from "@/src/hooks";
import useStepsStore from "@/src/store/step";
import { getAdjustedPoint, getGridFromComicConfig, getGridsBySplit } from "./utils";
import { borderWidth } from "./constant";
import useFocusStore from "@/src/store/focus";
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

export type SplitContainerProps = { grid: GridConfig, previewFocus?: boolean, onlyShowBorder?: boolean };
export default function SplitContainer({ grid, previewFocus = false, onlyShowBorder = false }: SplitContainerProps) {
    const { addStep, getCurrentStep } = useStepsStore();
    const currentStep = getCurrentStep();
    const { getFocusId, setFocusId, clean } = useFocusStore();
    const isFocused = getFocusId() === grid.id;

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
    const { grids: splitGrids, line } = isDrawing && (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], { spaceWidth: borderWidth * 2, recursion: true }) || defaultSplitResult;
    const { grids: borderGrids } = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], { spaceWidth: borderWidth * 2, recursion: false }) || defaultSplitResult;

    const handleClickLine: MouseEventHandler<Element> = (e) => {
        try {
            if (isFocused) {
                return;
            }
            clean();
            setTimeout(() => {
                setFocusId(grid.id);
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
                if (currentStep && splitGrids) {
                    const comicConfig = currentStep.comicConfig;
                    const newComicConfig = JSON.parse(JSON.stringify(comicConfig));

                    const newGrid = getGridFromComicConfig(newComicConfig, grid.id);
                    if (newGrid) {
                        newGrid.splitLine = JSON.parse(JSON.stringify(line));
                        newGrid.splitResult = JSON.parse(JSON.stringify(splitGrids));
                        newGrid.splitSpaceWidth = grid.splitSpaceWidth;
                        addStep({
                            type: "adjust-space",
                            comicConfig: newComicConfig,
                        });
                    }
                }
            }
        }
    }

    return (<div>
        {
            startPoint && endPoint && (
                <svg className={`absolute top-0 left-0 w-full h-full ${(isFocused) ? "opacity-100" : "opacity-0"}`}
                    style={{ pointerEvents: "none" }}>
                    <line
                        x1={startPoint.x}
                        y1={startPoint.y}
                        x2={endPoint.x}
                        y2={endPoint.y}
                        stroke="white"
                        strokeWidth="4"
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
            splitGrids && (splitGrids.map(grid_ => (<Grid grid={grid_} key={grid_.id}/>)))
        }
        {
            (onlyShowBorder || isFocused) && borderGrids && (borderGrids.map(grid_ => (<Grid grid={grid_} key={grid_.id}  onlyShowBorder={true}/>)))
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