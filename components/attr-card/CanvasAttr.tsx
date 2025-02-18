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
import useFocusStore from "@/store/config";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";

export default function CanvasAttr() {
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
