import { isDef } from '../utils';
import { getPoint, getPolyType } from './utils';

export type PolyGridConfig = {
    type: 'poly',
    path: { x: number, y: number }[]
}

export type RectGridConfig = {
    type: 'rect',
    lt_x: number,
    lt_y: number,
    rb_x: number,
    rb_y: number
}

export type GridConfig = PolyGridConfig | RectGridConfig;

function PolyGrid({ grid }: { grid: PolyGridConfig }) {
    let lt = getPoint(grid.path, 'lt');
    let rb = getPoint(grid.path, 'rb');
    if (!isDef(lt) || !isDef(rb)) {
        return null;

    }
    let left = lt.x;
    let top = lt.y;
    let width = rb.x - lt.x;
    let height = rb.y - lt.y;
    let polyType = getPolyType(grid.path);
    if (polyType === 'horizon') {
        return (
            <div className="custom-grid absolute bg-yellow-100" style={{ left, top, width, height }}>
                <div className="custom-grid-content"></div>
            </div>
        )
    }

}

function RectGrid({ grid }: { grid: RectGridConfig }) {
    let left = grid.lt_x;
    let top = grid.lt_y;
    let width = grid.rb_x - grid.lt_x;
    let height = grid.rb_y - grid.lt_y;
    return (
        <div className="custom-grid absolute border-2" style={{ left, top, width, height }}>
            <div className="custom-grid-content"></div>
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