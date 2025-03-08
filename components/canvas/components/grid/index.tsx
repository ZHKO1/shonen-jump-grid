'use client';
import { isGridSplited } from './utils';
import { CanvasGridConfig } from './types';
import SplitContainer from './SplitContainer';
import RectGrid, { RectGridProps } from './RectGrid';
import PolyGrid, { PolyGridProps } from './PolyGrid';

export type GridProps = { grid: CanvasGridConfig, showAsFocused?: boolean, borderOnly?: boolean };
export function Grid(props: GridProps) {
    if (isGridSplited(props.grid)) {
        return <SplitContainer {...props}/>;
    }
    if (props.grid.type === 'poly') {
        return <PolyGrid {...props as PolyGridProps}/>;
    } else if (props.grid.type === 'rect') {
        return <RectGrid {...props as RectGridProps}/>;
    } else {
        return null;
    }
}