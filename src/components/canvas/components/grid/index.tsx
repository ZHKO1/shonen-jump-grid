'use client';
import { isGridSplited } from './utils';
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