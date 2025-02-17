"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getGridsBySplit, isGridSplited } from "../canvas/components/grid/utils";
import { GridConfig, RectGridPoint } from "../canvas/components/grid/types"
import { useAdjustGrid } from "../canvas/components/grid/hooks/useAdjustGrid"

export default function GridAttr({ grid }: { grid: GridConfig }) {
  const { id, type, splitLine = [{ x: 0, y: 0 }, { x: 0, y: 0 }], splitSpaceWidth = 0 } = grid;
  const adjustGrid = useAdjustGrid();
  const isSplit = isGridSplited(grid);
  const splitLineStart = splitLine[0];
  const splitLineEnd = splitLine[1];

  const onRectChange = (key: keyof RectGridPoint): React.ChangeEventHandler<HTMLInputElement> => (e) => {
    adjustGrid(id, {
      [key]: Number(e.target.value)
    })
  }

  const onSplitSpaceWidthChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (isGridSplited(grid)) {
      const splitSpaceWidth = Number(e.target.value);
      const result = getGridsBySplit(grid, grid.splitLine!, { spaceWidth: splitSpaceWidth, recursion: true });
      if (result && result.grids) {
        adjustGrid(id, {
          splitSpaceWidth,
          splitResult: result.grids,
        })
      }
    }
  }

  return (
    <Card className="w-[250px]">
      <CardHeader>
        <CardTitle>Grid Attr</CardTitle>
        <CardDescription>type: {type}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-2 text-xs">
            <div>
              <div className="line-clamp-1">
                <span>Id:</span> {id}
              </div>
            </div>
            <div className="flex flex-wrap">
              {
                type === "rect" && (["lt_x", "lt_y", "rb_x", "rb_y"] as (keyof RectGridPoint)[]).map((key) => (
                  <div key={key} className="w-1/2 flex items-center gap-2 my-1 pr-1">
                    <span className="flex items-center">{key}:</span>
                    <Input className="flex-1 h-4 text-xs rounded-sm" value={grid[key] as number} onChange={onRectChange(key)} />
                  </div>
                ))
              }
            </div>
            {
              isSplit && (
                <div>
                  <div>
                    <div>split line:</div>
                    <div>({splitLineStart.x.toFixed(1)}, {splitLineStart.y.toFixed(1)}) ({splitLineEnd.x.toFixed(1)}, {splitLineEnd.y.toFixed(1)})</div>
                  </div>
                  <div className="flex items-center gap-2 my-1 pr-1">
                    <span className="flex items-center">split space width:</span>
                    <Input className="flex-1 h-4 text-xs rounded-sm" value={splitSpaceWidth} onChange={onSplitSpaceWidthChange} />
                  </div>
                </div>
              )
            }
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <Button variant="outline" >Cancel</Button>
        <Button variant="outline" >Deploy</Button> */}
      </CardFooter>
    </Card>
  )
}
