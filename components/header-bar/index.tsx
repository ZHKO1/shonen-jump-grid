'use client'
import { Forward, LayoutDashboard, Play, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useComicStatusStore from '@/store'

export default function HeaderBar() {
  const historyIndex = useComicStatusStore(state => state.currentHistoryStepIndex)
  const historyLength = useComicStatusStore(state => state.historySteps.length)
  const nextHistoryStep = useComicStatusStore(state => state.nextHistoryStep)
  const prevHistoryStep = useComicStatusStore(state => state.prevHistoryStep)
  const showAttrCard = useComicStatusStore(state => state.showAttrCard)
  const setShowAttrCard = useComicStatusStore(state => state.setShowAttrCard)
  const setShowComic = useComicStatusStore(state => state.setShowComic)

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full p-2 border-b-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled={historyIndex <= 0} variant="ghost" size="icon" onClick={prevHistoryStep}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled={historyIndex >= historyLength - 1} variant="ghost" size="icon" onClick={nextHistoryStep}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setShowComic(true)}>
                <Play className="h-4 w-4" />
                <span className="sr-only">Play</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Play</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Toggle aria-label="Toggle italic" pressed={showAttrCard} onPressedChange={pressed => setShowAttrCard(pressed)}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="sr-only">Detail</span>
          </Toggle>
        </div>
      </div>
    </TooltipProvider>
  )
}
