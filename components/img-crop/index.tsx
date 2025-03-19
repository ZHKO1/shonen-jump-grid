'use client'
import type { LogoPageStatus } from '@/store'
import { AnimatePresence } from 'framer-motion'
import React, { useCallback } from 'react'
import { getGridFromComicConfig, getPageFromComicConfig } from '@/components/canvas/utils'
import { defaultDocument } from '@/lib/utils'
import useComicStatusStore from '@/store'
import GridImgCrop from './GridImgCrop'
import LogoImgCrop from './LogoImgCrop'

export default function ImgCropContainer() {
  const pageId = useComicStatusStore(state => state.currentPageStatus.id)
  const focusId = useComicStatusStore(state => state.currentPageStatus.gridId)
  const showImgCrop = useComicStatusStore(state => state.showImgCrop)
  const setShowImgCrop = useComicStatusStore(state => state.setShowImgCrop)
  const currentStep = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex])
  const layerType = useComicStatusStore(state => (state.currentPageStatus as LogoPageStatus).layerType || 'grids')
  const comicConfig = currentStep?.comicConfig
  const page = comicConfig && getPageFromComicConfig(comicConfig, pageId)
  const logo = page?.logo
  const grid = comicConfig && getGridFromComicConfig(comicConfig, focusId)

  if (defaultDocument) {
    if (showImgCrop) {
      defaultDocument.body.style.overflow = 'hidden'
    }
    else {
      defaultDocument.body.style.overflow = 'auto'
    }
  }

  const onClose = useCallback(() => {
    setTimeout(() => {
      setShowImgCrop(false)
    }, 100)
  }, [setShowImgCrop])

  if (layerType === 'grids' && !grid) {
    return null
  }

  if (layerType === 'grids' && grid) {
    return (
      <AnimatePresence>
        {showImgCrop && (
          <GridImgCrop
            grid={grid}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    )
  }

  if (layerType === 'logo') {
    return (
      <AnimatePresence>
        {showImgCrop && (
          <LogoImgCrop
            logo={logo}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    )
  }

  return null
}
