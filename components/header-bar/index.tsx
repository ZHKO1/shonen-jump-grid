'use client'
import { ArrowDownToLine, ArrowUpFromLine, Forward, LayoutDashboard, Play, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useFileDialog } from '@/hooks'
import { downloadText } from '@/lib/utils'
import useComicStatusStore from '@/store'
import { getShareCanvasConfig } from '../canvas/utils'

export default function HeaderBar() {
  const [,open, reset] = useFileDialog()
  const historyIndex = useComicStatusStore(state => state.currentHistoryStepIndex)
  const historyLength = useComicStatusStore(state => state.historySteps.length)
  const nextHistoryStep = useComicStatusStore(state => state.nextHistoryStep)
  const prevHistoryStep = useComicStatusStore(state => state.prevHistoryStep)
  const showAttrCard = useComicStatusStore(state => state.showAttrCard)
  const setShowAttrCard = useComicStatusStore(state => state.setShowAttrCard)
  const setShowComic = useComicStatusStore(state => state.setShowComic)
  const addHistoryStep = useComicStatusStore(state => state.addHistoryStep)
  const cleanAllHistoryStep = useComicStatusStore(state => state.cleanAllHistoryStep)
  const currentStep = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex])
  const comicConfig = currentStep?.comicConfig

  const onImport = async () => {
    reset()
    const files = await open()
    const textFile = files![0]!
    const reader = new FileReader()
    reader.onload = (event) => {
      const fileContent = event.target?.result as string
      try {
        const comicConfig = JSON.parse(fileContent)
        cleanAllHistoryStep()
        addHistoryStep({
          type: 'init',
          comicConfig,
        })
      }
      catch (error) {
        console.error('reader failed', error)
      }
    }
    reader.readAsText(textFile)
  }

  const onExport = async () => {
    const result = await getShareCanvasConfig(comicConfig)
    downloadText('jump.save', JSON.stringify(result))
  }

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onImport}>
                <ArrowDownToLine className="h-4 w-4" />
                <span className="sr-only">Import</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onExport}>
                <ArrowUpFromLine className="h-4 w-4" />
                <span className="sr-only">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export</TooltipContent>
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
