"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useConfigStore from "@/store/config"
import { getGridsBySplit, isGridSplited } from "../canvas/components/grid/utils";
import { GridConfig, Point } from "../canvas/components/grid/types"
import { useAdjustGrid } from "../canvas/components/grid/hooks/useAdjustGrid"
import { borderWidth } from "../canvas/components/grid/constant"

export default function GridAttr({ grid }: { grid: GridConfig }) {
  const { id, type, splitLine = [{ x: 0, y: 0 }, { x: 0, y: 0 }], splitSpaceWidth = 0 } = grid;
  const adjustGrid = useAdjustGrid();
  const isSplit = isGridSplited(grid);
  const splitLineStart = splitLine[0];
  const splitLineEnd = splitLine[1];
  const { setShowImgCrop } = useConfigStore();

  // const onRectChange = (key: keyof RectGridPoint): React.ChangeEventHandler<HTMLInputElement> => (e) => {
  //   adjustGrid(id, {
  //     [key]: Number(e.target.value)
  //   })
  // }

  const onSplitSpaceWidthChange = (isCommit: boolean) => (number: number[]) => {
    if (isGridSplited(grid)) {
      const splitSpaceWidth = Number(number[0]);
      const result = getGridsBySplit(grid, grid.splitLine!, { spaceWidth: splitSpaceWidth, recursion: true });
      if (result && result.grids) {
        adjustGrid(id, {
          splitSpaceWidth,
          splitResult: result.grids,
        }, {
          preview: isCommit ? false : true
        })
      }
    }
  }

  const handleImgConfig = (e: React.MouseEvent) => {
    setShowImgCrop(true);
    e.preventDefault();
  }

  return (
    <Card className="w-[250px]">
      <CardHeader>
        <CardTitle>Grid Attr</CardTitle>
        <CardDescription>type: {type}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-1 text-xs">
            <div className="grid grid-cols-4 gap-1">
              <div className="grid col-span-4 grid-cols-5 gap-1">
                <Label className="col-span-2 text-xs">Id:</Label>
                <Label className="col-span-3 text-xs">{id}</Label>
              </div>
              {
                type === "rect" && (
                  <>
                    <div className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">upper-left:</Label>
                      <Label className="col-span-3 text-xs">({grid.lt_x.toFixed(1) + "," + grid.lt_y.toFixed(1)})</Label>
                    </div>
                    <div className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">lower-right:</Label>
                      <Label className="col-span-3 text-xs">({grid.rb_x.toFixed(1) + "," + grid.rb_y.toFixed(1)})</Label>
                    </div>
                  </>
                )
              }
              {
                type === "poly" && (
                  (grid.path as Point[]).map((point, index) => (
                    <div key={"path" + index} className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">point{index}:</Label>
                      <Label className="col-span-3 text-xs">({point.x.toFixed(1) + "," + point.y.toFixed(1)})</Label>
                    </div>
                  ))
                )
              }
              {
                isSplit ? (
                  <>
                    <div className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">split line:</Label>
                      <Label className="col-span-3 text-xs">({splitLineStart.x.toFixed(1)}, {splitLineStart.y.toFixed(1)})</Label>
                    </div>
                    <div className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs"></Label>
                      <Label className="col-span-3 text-xs">({splitLineEnd.x.toFixed(1)}, {splitLineEnd.y.toFixed(1)})</Label>
                    </div>
                    <div className="col-span-4 flex flex-col gap-2 my-1 pr-1">
                      <Label className="text-xs">split space width: {splitSpaceWidth}</Label>
                      <Slider
                        value={[splitSpaceWidth]}
                        min={borderWidth * 2}
                        max={100}
                        step={1}
                        onValueChange={onSplitSpaceWidthChange(false)}
                        onValueCommit={onSplitSpaceWidthChange(true)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid col-span-4 grid-cols-5 gap-1">
                    <Label className="col-span-2 text-xs flex items-center">image:</Label>
                    <div className="grid grid-cols-2 col-span-3 text-xs gap-1">
                      <Button variant="outline" size="sm" className="h-6" onClick={handleImgConfig}>config</Button>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        {/* <Button variant="outline" >Cancel</Button> */}
      </CardFooter>
    </Card >
  )
}
