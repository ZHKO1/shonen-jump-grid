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
import { CanvasPageConfig } from "../canvas/types"
// import useComicStatusStore from "@/store";

export default function CanvasAttr({ page }: { page?: CanvasPageConfig }) {
  // const currentPageId = useComicStatusStore(state => state.currentPageId);
  const pageId = page?.id || "";
  const height = page?.height || "";

  const isLogoPage = pageId === "page0";

  const handleLogoConfig = (e: React.MouseEvent) => {
    e.preventDefault();
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
                        <div className="grid grid-cols-5 gap-1">
                          <Label className="col-span-2 text-xs flex items-center">logo:</Label>
                          <div className="grid col-span-3 text-xs">
                            <Button variant="outline" size="sm" className="h-6" onClick={handleLogoConfig}>config</Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          <Label className="col-span-2 text-xs flex items-center">logo positionX:</Label>
                          <div className="grid col-span-3 text-xs">
                            <Button variant="outline" size="sm" className="h-6" onClick={handleLogoConfig}>config</Button>
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>
              </form>
            </CardContent>
          </>
        )
      }
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card >
  )
}
