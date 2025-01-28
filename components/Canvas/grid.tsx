'use client';
import { MouseEventHandler, use, useEffect, useRef, useState } from 'react';
import { isDef } from '../utils';
import { useFocusGrid, useDrawLine } from './hooks/index';
import { getGridsBySplit, getMaxIndexFromComicConfig, getPolyContainerPoint, getPolyGridPoint, getPolyPointBySort, getRectGridPoint } from './utils';
import useStepsStore from '../store/step';

export type Point = { x: number, y: number };

export type GridShareConfig = {
    index: number,
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
    const { addStep, getCurrentStep } = useStepsStore();
    const currentStep = getCurrentStep();
    const gridRef = useRef<HTMLDivElement>(null);
    const [isGridFocused, setGridFocus] = useFocusGrid(gridRef);
    const { outside, inside } = getPolyGridPoint(grid.path, borderWidth);
    let lt_outside = getPolyContainerPoint(outside, 'lt');
    let rb_outside = getPolyContainerPoint(outside, 'rb');
    if (!isDef(lt_outside) || !isDef(rb_outside)) {
        return null;
    }
    const [startPoint, endPoint, isDrawing] = useDrawLine(isGridFocused);
    let grids = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], borderWidth * 2);

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
        setGridFocus(true);
        e.stopPropagation();
    }

    useEffect(() => {
        if (!isDrawing && startPoint && endPoint) {
            if (currentStep && grids) {
                const comicConfig = currentStep.comicConfig;
                const maxIndex = getMaxIndexFromComicConfig(comicConfig);
                const newComicConfig = [...comicConfig.filter(grid_ => grid_.index != grid.index), ...grids.map((grid_, index) => ({ ...grid_, index: maxIndex + index + 1 }))];
                addStep({
                    type: "split",
                    comicConfig: newComicConfig,
                });
            }
        }
    }, [isDrawing]);

    return (
        <>
            {
                <div className={`opacity-60 custom-grid absolute ${isGridFocused ? "animate-breathe" : "bg-gray-200"}`} style={{ left, top, width, height, clipPath }}
                    ref={gridRef}
                    onClick={handleClick}
                >
                    <div className="custom-grid-content bg-white" style={{ ...contentStyle }}></div>
                </div>
            }
            {
                grids && (grids.map((grid, index) => (<Grid grid={grid} key={(new Date()).getTime() + "_" + index} isDefaultFocused />)))
            }
            {
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
            }
        </>

    )
}

function RectGrid({ grid, isDefaultFocused = false }: { grid: RectGridConfig, isDefaultFocused?: boolean }) {
    const { addStep, getCurrentStep } = useStepsStore();
    const currentStep = getCurrentStep();
    const gridRef = useRef<HTMLDivElement>(null);
    const [isGridFocused, setGridFocus] = useFocusGrid(gridRef, isDefaultFocused);
    const [startPoint, endPoint, isDrawing] = useDrawLine(isGridFocused);
    const { outside } = getRectGridPoint({
        ...grid
    }, borderWidth);
    let grids = (startPoint && endPoint) && getGridsBySplit(grid, [startPoint, endPoint], borderWidth * 2);

    let left = outside.lt_x;
    let top = outside.lt_y;
    let width = outside.rb_x - outside.lt_x;
    let height = outside.rb_y - outside.lt_y;
    let contentStyle = {
        width: `calc(100% - ${borderWidth * 2}px)`,
        height: `calc(100% - ${borderWidth * 2}px)`,
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setGridFocus(true);
        e.stopPropagation();
    }

    useEffect(() => {
        if (!isDrawing && startPoint && endPoint) {
            if (currentStep && grids) {
                const comicConfig = currentStep.comicConfig;
                const maxIndex = getMaxIndexFromComicConfig(comicConfig);
                const newComicConfig = [...comicConfig.filter(grid_ => grid_.index != grid.index), ...grids.map((grid_, index) => ({ ...grid_, index: maxIndex + index + 1 }))];
                addStep({
                    type: "split",
                    comicConfig: newComicConfig,
                });
            }
        }
    }, [isDrawing]);

    return (
        <>
            {
                <div className={`opacity-60 custom-grid absolute ${grids ? "hidden" : ""} ${isGridFocused && !grids ? "animate-breathe" : "bg-gray-200"} flex flex-wrap content-center justify-center`}
                    style={{ left, top, width, height }}
                    ref={gridRef}
                    onClick={handleClick}
                >
                    <div className="custom-grid-content bg-white" style={contentStyle}></div>
                </div>

            }
            {
                grids && (grids.map((grid, index) => (<Grid grid={grid} key={(new Date()).getTime() + "_" + index} isDefaultFocused />)))
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
        </>
    )
}


export function Grid({ grid, isDefaultFocused }: { grid: GridConfig, isDefaultFocused?: boolean }) {
    if (grid.type === 'poly') {
        return <PolyGrid grid={grid} />;
    } else if (grid.type === 'rect') {
        return <RectGrid grid={grid} isDefaultFocused={isDefaultFocused} />;
    } else {
        return null;
    }
}