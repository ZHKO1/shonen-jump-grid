'use client';
import { MouseEventHandler, use, useEffect, useRef, useState } from 'react';
import { isDef } from '../utils';
import { useFocusGrid, useDrawLine } from './hooks/index';
import { getGridsBySplit, getPolyContainerPoint, getPolyGridPoint, getPolyPointBySort, getRectGridPoint } from './utils';
import { useSplit } from './hooks/useSplit';
import useFocusStore from '../store/focus';

export type Point = { x: number, y: number };

export type GridShareConfig = {
    id: string | number,
    split_line?: [Point, Point],
    split_result?: [GridConfig, GridConfig],
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

function PolyGrid({ grid }: { grid: PolyGridConfig }) {
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
                <div className={`opacity-60 custom-grid absolute ${isFocused ? "animate-breathe" : "bg-gray-200"}`}
                    style={{ left, top, width, height, clipPath }}
                    ref={gridRef}
                    onClick={handleClick}
                >
                    <div className="custom-grid-content bg-white" style={{ ...contentStyle }}></div>
                </div>
            }
            {
                grids && (grids.map((grid_, index) => (<Grid grid={{...grid_, id: (new Date()).getTime() + "_" + index}} key={(new Date()).getTime() + "_" + index} isDefaultFocused />)))
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

function RectGrid({ grid, isDefaultFocused = false }: { grid: RectGridConfig, isDefaultFocused?: boolean }) {
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
        console.log("handleClick");
        setFocusId(grid.id);
        e.nativeEvent.stopImmediatePropagation();
    }

    return (
        <div>
            {
                <div className={`opacity-60 custom-grid absolute ${grids ? "hidden" : ""} ${isFocused && !grids ? "animate-breathe" : "bg-gray-200"} flex flex-wrap content-center justify-center`}
                    style={{ left, top, width, height }}
                    ref={gridRef}
                    onClick={handleClick}
                >
                    <div className="custom-grid-content bg-white" style={contentStyle}></div>
                </div>

            }
            {
                grids && (grids.map((grid_, index) => (<Grid grid={{...grid_, id: (new Date()).getTime() + "_" + index}} key={(new Date()).getTime() + "_" + index} isDefaultFocused />)))
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

function SplitContainer({ grid }: { grid: GridConfig }) {
    const [isFocused, setFocus] = useState(false);
    let split_result = grid.split_result;
    let startPoint = grid.split_line?.[0];
    let endPoint = grid.split_line?.[1];

    const handleClickLine: MouseEventHandler<SVGLineElement> = (e) => {
        setFocus(true)
        e.nativeEvent.stopImmediatePropagation();
    }

    return (<div>
        {
            startPoint && endPoint && (
                <svg className={`absolute top-0 left-0 w-full h-full ${isFocused ? "opacity-100" : "opacity-0"}`}
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
            split_result && (split_result.map(grid_ => (<Grid grid={grid_} key={grid_.id} />)))
        }
        {
            isFocused && startPoint && endPoint && (
                <>
                    <div className='absolute size-[10px] rounded-full bg-black cursor-pointer' style={{ left: startPoint.x - 5, top: startPoint.y - 5 }}></div>
                    <div className='absolute size-[10px] rounded-full bg-black cursor-pointer' style={{ left: (startPoint.x + endPoint.x) / 2 - 5, top: (startPoint.y + endPoint.y) / 2 - 5 }}></div>
                    <div className='absolute size-[10px] rounded-full bg-black cursor-pointer' style={{ left: endPoint.x - 5, top: endPoint.y - 5 }}></div>
                </>
            )
        }
    </div>)
}


export function Grid({ grid, isDefaultFocused }: { grid: GridConfig, isDefaultFocused?: boolean }) {
    if (grid.split_line && grid.split_result && grid.split_result.length > 0) {
        return <SplitContainer grid={grid} />;
    }
    if (grid.type === 'poly') {
        return <PolyGrid grid={grid} />;
    } else if (grid.type === 'rect') {
        return <RectGrid grid={grid} isDefaultFocused={isDefaultFocused} />;
    } else {
        return null;
    }
}