'use client'
import type { CanvasGridConfig, Point } from '@/components/canvas/types'

import * as React from 'react'
import { BORDER_WIDTH } from '@/components/canvas/constant'
import { getGridsBySplit, isGridFlushable, isGridSplited } from '@/components/canvas/utils'
import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useAdjustComic } from '@/hooks'
import useComicStatusStore from '@/store'

function AnimationSelect({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-6 rounded-md text-xs box-border">
        <SelectValue placeholder="select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem className="h-6 text-xs" value="none">none</SelectItem>
          <SelectItem className="h-6 text-xs" value="left-to-right">left to right</SelectItem>
          <SelectItem className="h-6 text-xs" value="right-to-left">right to left</SelectItem>
          <SelectItem className="h-6 text-xs" value="change-background">gray to color</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default function GridAttr({ grid }: { grid: CanvasGridConfig }) {
  const {
    id,
    type,
    splitLine = [{ x: 0, y: 0 }, { x: 0, y: 0 }],
    splitSpaceWidth = 0,
  } = grid
  const { adjustGrid } = useAdjustComic()
  const isSplit = isGridSplited(grid)
  const isFlushable = isGridFlushable(grid)
  const splitLineStart = splitLine[0]
  const splitLineEnd = splitLine[1]
  const setShowImgCrop = useComicStatusStore(state => state.setShowImgCrop)

  const { focus } = grid.content || {}
  let animation = 'none'
  switch (focus?.type) {
    case 'move':
      animation = focus.direction
      break
    case 'change-background':
      animation = 'change-background'
      break
    default:
      break
  }

  // const onRectChange = (key: keyof RectGridPoint): React.ChangeEventHandler<HTMLInputElement> => (e) => {
  //   adjustGrid(id, {
  //     [key]: Number(e.target.value)
  //   })
  // }

  const onClickUnsplit = () => {
    if (isSplit) {
      adjustGrid(id, {
        splitLine: void 0,
        splitResult: void 0,
        splitSpaceWidth: void 0,
      })
    }
  }

  const onSplitSpaceWidthChange = (isCommit: boolean) => (number: number[]) => {
    if (isSplit) {
      const splitSpaceWidth = Number(number[0])
      const result = getGridsBySplit(grid, grid.splitLine!, { spaceWidth: splitSpaceWidth, recursion: true })
      if (result && result.grids) {
        adjustGrid(id, {
          splitSpaceWidth,
          splitResult: result.grids,
        }, {
          tmp: !isCommit,
        })
      }
    }
  }

  const onIsFlushChange = (checked: boolean) => {
    if (!isSplit) {
      adjustGrid(id, {
        isFlush: checked,
      })
    }
  }

  const handleImgConfig = (e: React.MouseEvent) => {
    setShowImgCrop(true)
    e.preventDefault()
  }

  const onAnimationChange = (val: string) => {
    let focus
    switch (val) {
      case 'left-to-right':
      case 'right-to-left':
        focus = {
          type: 'move',
          direction: val,
        }
        break
      case 'change-background':
        focus = {
          type: 'change-background',
        }
        break
      default:
        break
    }
    adjustGrid(id, {
      content: {
        ...grid.content,
        focus,
      },
    })
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Grid Attr</CardTitle>
        <CardDescription>
          type:
          {type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-1 text-xs">
            <div className="grid grid-cols-4 gap-1">
              <div className="grid col-span-4 grid-cols-5 gap-1">
                <Label className="col-span-2 text-xs">id:</Label>
                <Label className="col-span-3 text-xs">{id}</Label>
              </div>
              {
                type === 'rect' && (
                  <>
                    <div className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">upper-left:</Label>
                      <Label className="col-span-3 text-xs">
                        (
                        {`${grid.lt_x.toFixed(1)},${grid.lt_y.toFixed(1)}`}
                        )
                      </Label>
                    </div>
                    <div className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">lower-right:</Label>
                      <Label className="col-span-3 text-xs">
                        (
                        {`${grid.rb_x.toFixed(1)},${grid.rb_y.toFixed(1)}`}
                        )
                      </Label>
                    </div>
                  </>
                )
              }
              {
                type === 'poly' && (
                  (grid.path as Point[]).map((point, index) => (
                    <div key={`path_${point.x}_${point.y}`} className="grid col-span-4 grid-cols-5 gap-1">
                      <Label className="col-span-2 text-xs">
                        point
                        {index}
                        :
                      </Label>
                      <Label className="col-span-3 text-xs">
                        (
                        {`${point.x.toFixed(1)},${point.y.toFixed(1)}`}
                        )
                      </Label>
                    </div>
                  ))
                )
              }
              {
                isSplit
                  ? (
                      <>
                        <div className="grid col-span-4 grid-cols-5 gap-1">
                          <Label className="col-span-2 text-xs">split line:</Label>
                          <Label className="col-span-3 text-xs">
                            (
                            {splitLineStart.x.toFixed(1)}
                            ,
                            {splitLineStart.y.toFixed(1)}
                            )
                          </Label>
                        </div>
                        <div className="grid col-span-4 grid-cols-5 gap-1">
                          <Label className="col-span-2 text-xs"></Label>
                          <Label className="col-span-3 text-xs">
                            (
                            {splitLineEnd.x.toFixed(1)}
                            ,
                            {splitLineEnd.y.toFixed(1)}
                            )
                          </Label>
                        </div>
                        <div className="col-span-4 flex flex-col gap-2 my-1 pr-1">
                          <Label className="text-xs">
                            split space width:
                            {splitSpaceWidth}
                          </Label>
                          <Slider
                            value={[splitSpaceWidth]}
                            min={BORDER_WIDTH * 2}
                            max={100}
                            step={1}
                            onValueChange={onSplitSpaceWidthChange(false)}
                            onValueCommit={onSplitSpaceWidthChange(true)}
                          />
                        </div>
                        <div className="grid col-span-4 grid-cols-5 gap-1">
                          <div className="grid col-span-3 text-xs col-start-2">
                            <Button variant="outline" size="sm" className="h-6" onClick={onClickUnsplit}>unsplit</Button>
                          </div>
                        </div>
                      </>
                    )
                  : (
                      <>
                        {isFlushable && (
                          <div className="grid col-span-4 grid-cols-5 gap-1">
                            <Label className="col-span-2 text-xs flex items-center">flush:</Label>
                            <div className="grid col-span-3 text-xs">
                              <Switch checked={!!grid.isFlush} onCheckedChange={onIsFlushChange} />
                            </div>
                          </div>
                        )}
                        <div className="grid col-span-4 grid-cols-5 gap-1">
                          <Label className="col-span-2 text-xs flex items-center">image:</Label>
                          <div className="grid col-span-3 text-xs">
                            <Button variant="outline" size="sm" className="h-6" onClick={handleImgConfig}>config</Button>
                          </div>
                        </div>
                        <div className="grid col-span-4 grid-cols-5 gap-1">
                          <Label className="col-span-2 text-xs flex items-center">animation:</Label>
                          <div className="grid col-span-3 text-xs">
                            <AnimationSelect value={animation} onChange={onAnimationChange} />
                          </div>
                        </div>
                      </>
                    )
              }
            </div>
          </div>
        </form>
      </CardContent>
    </>
  )
}
