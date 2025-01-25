'use client';
import { MouseEventHandler, useRef, useState } from 'react';
import { isDef } from '../utils';
import { useFocusGrid, useSplitGrid } from './hooks/index';
import { getPolyContainerPoint, getPolyContentClipPath, getPolyPointBySort } from './utils';

export type Point = { x: number, y: number };

export type PolyGridConfig = {
    type: 'poly',
    path: [Point, Point, Point, Point]
}

export type RectGridConfig = {
    type: 'rect',
    lt_x: number,
    lt_y: number,
    rb_x: number,
    rb_y: number
}

export type GridConfig = PolyGridConfig | RectGridConfig;

const borderWidth = 4;

function PolyGrid({ grid }: { grid: PolyGridConfig }) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [isGridFocused, setGridFocus] = useFocusGrid(gridRef);
    let lt = getPolyContainerPoint(grid.path, 'lt');
    let rb = getPolyContainerPoint(grid.path, 'rb');
    if (!isDef(lt) || !isDef(rb)) {
        return null;

    }
    let left = lt.x;
    let top = lt.y;
    let width = rb.x - lt.x;
    let height = rb.y - lt.y;
    let sortPath = getPolyPointBySort(grid.path);
    let clipPath = `polygon(${sortPath.map(p => `${p.x - left}px ${p.y - top}px`).join(',')})`;
    let contentStyle = {
        width: `100%`,
        height: `100%`,
        clipPath: getPolyContentClipPath(sortPath, borderWidth),
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocus();
        e.stopPropagation();
    }

    return (
        <div className={`custom-grid absolute ${isGridFocused ? "animate-breathe" : "bg-gray-200"}`} style={{ left, top, width, height, clipPath }}
            ref={gridRef}
            onClick={handleClick}
        >
            <div className="custom-grid-content bg-white" style={{ ...contentStyle }}></div>
        </div>
    )
}

function RectGrid({ grid }: { grid: RectGridConfig }) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [isGridFocused, setGridFocus] = useFocusGrid(gridRef);
    const [startPoint, endPoint] = useSplitGrid(gridRef, isGridFocused);
    let left = grid.lt_x;
    let top = grid.lt_y;
    let width = grid.rb_x - grid.lt_x;
    let height = grid.rb_y - grid.lt_y;
    let contentStyle = {
        width: `calc(100% - ${borderWidth * 2}px)`,
        height: `calc(100% - ${borderWidth * 2}px)`,
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocus();
        e.stopPropagation();
    }

    return (
        <div className={`custom-grid absolute ${isGridFocused ? "animate-breathe" : "bg-gray-200"} flex flex-wrap content-center justify-center`}
            style={{ left, top, width, height }}
            ref={gridRef}
            onClick={handleClick}
        >
            <div className="custom-grid-content bg-white" style={contentStyle}></div>
            {startPoint && endPoint && (
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
            )}
        </div>
    )
}


export function Grid({ grid }: { grid: GridConfig }) {
    if (grid.type === 'poly') {
        return <PolyGrid grid={grid} />;
    } else {
        return <RectGrid grid={grid} />;
    }
}