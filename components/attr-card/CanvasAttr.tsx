"use client"
import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useComicStatusStore from "@/store";

export default function CanvasAttr() {
  const currentPageId = useComicStatusStore(state => state.currentPageId);
  return (
    <Card className="w-[250px]">
      <CardHeader>
        <CardTitle>Canvas</CardTitle>
        <CardDescription>Canvas Attr</CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
  )
}
