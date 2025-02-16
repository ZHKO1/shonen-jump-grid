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
import useFocusStore from "@/store/focus";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import { GridConfig, RectGridConfig, RectGridPoint } from "../canvas/components/grid/types"

export default function GridAttr({ grid }: { grid: GridConfig }) {
  const { id, type } = grid;
  const { addStep, getCurrentStep } = useStepsStore();
  const currentStep = getCurrentStep();
  const onRectChange = (key: keyof RectGridPoint): React.ChangeEventHandler<HTMLInputElement> => (e) => {
    if (currentStep) {
      const comicConfig = currentStep.comicConfig;
      const newComicConfig = JSON.parse(JSON.stringify(comicConfig));
      const newGrid = getGridFromComicConfig(newComicConfig, id) as RectGridConfig;
      newGrid[key] = Number(e.target.value);
      addStep({
        type: "adjust",
        comicConfig: newComicConfig,
      });
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
                <span className="font-medium">Id:</span> {id}
              </div>
            </div>
            <div className="flex flex-wrap">
              {
                type === "rect" && (["lt_x", "lt_y", "rb_x", "rb_y"] as (keyof RectGridPoint)[]).map((key) => (
                  <div key={key} className="w-1/2 flex items-center gap-2 my-1 pr-1">
                    <span className="text-xs font-medium flex items-center">{key}:</span>
                    <Input className="flex-1 h-4 text-xs rounded-sm" value={grid[key] as number} onChange={onRectChange(key)} />
                  </div>
                ))
              }
              {
                ["splitLine", "splitSpaceWidth"].map(key => (
                  <div key={key} className="flex items-center gap-2 my-1 pr-1">
                    <span className="text-xs font-medium flex items-center">{key}:</span>
                    <Input className="w-10 h-4 text-xs rounded-sm" />
                  </div>
                ))
              }
            </div>
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
