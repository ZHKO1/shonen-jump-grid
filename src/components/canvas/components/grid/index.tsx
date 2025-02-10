'use client';
import { MouseEventHandler, use, useContext, useEffect, useRef, useState } from 'react';
import { isDef } from '../../../../utils';
import { getAdjustedPoint, getGridFromComicConfig, getGridsBySplit, getPolyContainerPoint, getPolyGridPoint, getPolyPointBySort, getRectGridPoint, isGridSplited } from './utils';
import useFocusStore from '../../../../store/focus';
import { useDraggable } from '../../../../hooks';
import { ContainerContext } from '../../context/container';
import useStepsStore from '../../../../store/step';
import { GridConfig } from './types';
import SplitContainer from './SplitContainer';
import RectGrid from './RectGrid';
import PolyGrid from './PolyGrid';


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