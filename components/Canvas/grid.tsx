'use client';
import { MouseEventHandler, use, useContext, useEffect, useRef, useState } from 'react';
import { isDef } from '../utils';
import { getGridsBySplit, getPolyContainerPoint, getPolyGridPoint, getPolyPointBySort, getRectGridPoint, isGridSplited } from './utils';
import { useSplit } from './hooks/useSplit';
import useFocusStore from '../store/focus';
import { useDraggable } from '../hooks';
import { ContainerContext } from './context/container';
import useStepsStore from '../store/step';

export type Point = { x: number, y: number };

export type GridShareConfig = {
    id: string | number,
    splitLine?: [Point, Point],
    splitResult?: [GridConfig, GridConfig],
    splitSpaceWidth?: number,
}

export type PolyGridPoint = {
    path: [Point, Point, Point, Point],
}

export type PolyGridConfig = {
    type: 'poly',
} & GridShareConfig & PolyGridPoint

export type RectGridPoint = {
    lt_x: number,
    lt_y: number,
    rb_x: number,
    rb_y: number,
}

export type RectGridConfig = {
    type: 'rect',
} & GridShareConfig & RectGridPoint

export type GridConfig = (PolyGridConfig | RectGridConfig);

export type ComicConfig = GridConfig[];

const borderWidth = 6;

function PolyGrid({ grid, border = false }: { grid: PolyGridConfig, border?: boolean }) {
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

function RectGrid({ grid, border = false }: { grid: RectGridConfig, border?: boolean }) {
    const gridRef = useRef<HTMLDivElement>(null);
    // const [isGridFocused, setGridFocus] = useFocusGrid(gridRef, isDefaultFocused);
    const { getFocusId, setFocusId } = useFocusStore();
    const isFocused = getFocusId() === grid.id;
    const { outside } = getRectGridPoint({
        ...grid
    }, borderWidth);
    let grids = useSplit(grid, isFocused, borderWidth * 2);

    let left = outside.lt_x;
    let top = outside.lt_y;
    let width = outside.rb_x - outside.lt_x;
    let height = outside.rb_y - outside.lt_y;
    let contentStyle = {
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

function SplitPoint({ point, onChange }: { point: Point, onChange: (val: Point, isDrawing: boolean) => void }) {
    const pointRef = useRef<HTMLDivElement>(null);
    const gridRef = useContext(ContainerContext).container;
    const [, ,] = useDraggable(pointRef, {
        initialValue: { x: point.x - 5, y: point.y - 5 },
        containerElement: gridRef,
        preventDefault: true,
        stopPropagation: true,
        onMove(position, event) {
            onChange({
                x: position.x + 5,
                y: position.y + 5,
            }, true);
        },
        onEnd(position, event) {
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

function SplitContainer({ grid, border = false }: { grid: GridConfig, border?: boolean }) {
    const { addStep, getCurrentStep } = useStepsStore();
    const { getFocusId, setFocusId, clean } = useFocusStore();
    const isFocused = getFocusId() === grid.id;

    let splitResult = grid.splitResult;
    let [isDrawing, setIsDrawing] = useState(false);
    let [startPoint, setStartPoint] = useState(grid.splitLine?.[0]);
    let endPoint = grid.splitLine?.[1];

    let { grids, line } = isDrawing && (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], borderWidth * 2) || { grids: splitResult, line: grid.splitLine };

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
                    setStartPoint(point);
                    break;
                case "end":
                    // setEndPoint(point);
                    break;
            }
            setIsDrawing(newIsDrawing)
            if (!newIsDrawing) {

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
            grids && (grids.map(grid_ => (<Grid grid={grid_} key={grid_.id} border={isFocused || border} />)))
        }
        {
            isFocused && startPoint && endPoint && (
                <>
                    <SplitPoint point={startPoint} onChange={handleDragglePoint("start")} />
                    <div className='absolute size-[10px] rounded-full bg-black cursor-pointer -translate-x-1/2 -translate-y-1/2' onClick={handleClickLine} style={{ left: (startPoint.x + endPoint.x) / 2, top: (startPoint.y + endPoint.y) / 2 }}></div>
                    <div className='absolute size-[10px] rounded-full bg-black cursor-pointer -translate-x-1/2 -translate-y-1/2' onClick={handleClickLine} style={{ left: endPoint.x, top: endPoint.y }}></div>
                </>
            )
        }
    </div>)
}


export function Grid({ grid, border }: { grid: GridConfig, border?: boolean }) {
    if (isGridSplited(grid)) {
        return <SplitContainer grid={grid} border={border} />;
    }
    if (grid.type === 'poly') {
        return <PolyGrid grid={grid} border={border} />;
    } else if (grid.type === 'rect') {
        return <RectGrid grid={grid} border={border} />;
    } else {
        return null;
    }
}