'use client'
import { AnimatePresence } from 'framer-motion'
import { useCallback } from 'react'
import { getComicConfigFromCanvas } from '@/components/canvas/utils'
import { defaultDocument } from '@/lib/utils'
import useComicStatusStore from '@/store'
import Preview from './Preview'

export default function ComicContainer() {
  const showComic = useComicStatusStore(state => state.showComic)
  const setShowComic = useComicStatusStore(state => state.setShowComic)
  const canvasComicConfig = useComicStatusStore(state => showComic ? state.historySteps[state.currentHistoryStepIndex]?.comicConfig : null)
  const comicConfig = showComic && canvasComicConfig ? getComicConfigFromCanvas(canvasComicConfig) : null

  if (defaultDocument) {
    if (showComic) {
      defaultDocument.body.style.overflow = 'hidden'
    }
    else {
      defaultDocument.body.style.overflow = 'auto'
    }
  }

  const onClose = useCallback(() => {
    setTimeout(() => {
      setShowComic(false)
    }, 100)
  }, [setShowComic])

  return (
    <AnimatePresence>
      {showComic && (<Preview config={comicConfig} onClose={onClose} />)}
    </AnimatePresence>
  )
}
