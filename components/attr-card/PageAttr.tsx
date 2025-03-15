"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasPageConfig } from "@/components/canvas/types"
import Layer from "./Layer"
import useComicStatusStore, { LayerType, LogoPageStatus } from "@/store"
import { getGridFromComicConfig } from "../canvas/utils"
import GridAttr from "./GridAttr"

export default function PageAttr({ page }: { page?: CanvasPageConfig }) {
  const pageId = page?.id || "";
  const height = page?.height || "";
  const isLogoPage = useComicStatusStore(state => state.currentPageStatus.type === "logo-page");
  const setShowImgCrop = useComicStatusStore(state => state.setShowImgCrop);
  const setCurrentLayerType = useComicStatusStore(state => state.setCurrentLayerType);
  const setCurrentGridId = useComicStatusStore(state => state.setCurrentGridId);
  const layerType = useComicStatusStore(state => (state.currentPageStatus as LogoPageStatus).layerType || "grids");

  const currentStep = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex]);
  const comicConfig = currentStep?.comicConfig;
  const currentGridId = useComicStatusStore(state => state.currentPageStatus.gridId);
  const grid = comicConfig && getGridFromComicConfig(comicConfig, currentGridId);

  const handleLogoConfig = (e: React.MouseEvent) => {
    setShowImgCrop(true);
    e.preventDefault();
  }

  const handleLayerClick = (val: LayerType) => {
    setCurrentGridId("");
    setCurrentLayerType(val);
  }

  return (
    <Card className="w-[250px]">
      <CardHeader>
        <CardTitle>Page</CardTitle>
        <CardDescription>Page Attr</CardDescription>
      </CardHeader>
      {
        page && (
          <>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-1 text-xs">
                  <div className="grid grid-cols-4 gap-1">
                    <div className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">id:</Label>
                      <Label className="col-span-3 text-xs">{pageId}</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <div className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">height:</Label>
                      <Label className="col-span-3 text-xs">{height}</Label>
                    </div>
                  </div>
                  {
                    isLogoPage && (
                      <>
                        <div className="grid gap-1">
                          <Label className="text-xs flex items-center">layer:</Label>
                          <div className="text-xs">
                            <Layer onClick={handleLayerClick} />
                          </div>
                        </div>
                        {
                          layerType === "logo" && (
                            <>
                              <div className="grid grid-cols-5 gap-1">
                                <Label className="col-span-2 text-xs flex items-center">logo:</Label>
                                <div className="grid col-span-3 text-xs">
                                  <Button variant="outline" size="sm" className="h-6" onClick={handleLogoConfig}>config</Button>
                                </div>
                              </div>
                            </>
                          )
                        }
                      </>
                    )
                  }
                </div>
              </form>
            </CardContent>
          </>
        )
      }
      {
        (currentGridId !== "") && grid && <GridAttr grid={grid} />
      }
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card >
  )
}
