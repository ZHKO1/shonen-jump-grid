import type { CanvasComicConfig, CanvasPageConfig, GridId, PageId } from '../../components/canvas/types'
import { useCallback } from 'react'
import { deepCopy } from '@/lib/utils'
import useComicStatusStore from '@/store'
import { getGridFromComicConfig, getPageFromComicConfig } from '../../components/canvas/utils'

export function useAdjustComic() {
  const addHistoryStep = useComicStatusStore(state => state.addHistoryStep)
  const getCurrentHistoryStep = useComicStatusStore(state => state.getCurrentHistoryStep)
  const getCurrentPageId = useComicStatusStore(state => state.getCurrentPageId)
  const setCurrentPageId = useComicStatusStore(state => state.setCurrentPageId)
  const setCurrentGridId = useComicStatusStore(state => state.setCurrentGridId)

  const adjustGrid = useCallback((id: GridId, params: any, { tmp } = {
    tmp: false,
  }) => {
    const currentStep = getCurrentHistoryStep()
    if (currentStep) {
      const comicConfig = currentStep.comicConfig
      const comicConfigCopy = deepCopy(comicConfig)
      const targetGrid = getGridFromComicConfig(comicConfigCopy, id)
      if (targetGrid) {
        Object.assign(targetGrid, params)
        addHistoryStep({
          type: 'adjust-grid',
          comicConfig: comicConfigCopy,
        }, {
          tmp,
        })
      }
    }
  }, [addHistoryStep, getCurrentHistoryStep])

  const adjustPage = useCallback((id: PageId, params: any, { tmp } = {
    tmp: false,
  }) => {
    const currentStep = getCurrentHistoryStep()
    if (currentStep) {
      const comicConfig = currentStep.comicConfig
      const comicConfigCopy = deepCopy(comicConfig)
      const targetGrid = getPageFromComicConfig(comicConfigCopy, id)
      if (targetGrid) {
        Object.assign(targetGrid, params)
        addHistoryStep({
          type: 'adjust-page',
          comicConfig: comicConfigCopy,
        }, {
          tmp,
        })
      }
    }
  }, [getCurrentHistoryStep, addHistoryStep])

  const addPage = useCallback((page: CanvasPageConfig) => {
    const currentStep = getCurrentHistoryStep()
    if (currentStep) {
      const comicConfig = currentStep.comicConfig
      const comicConfigCopy = deepCopy(comicConfig) as CanvasComicConfig
      comicConfigCopy.pages.push(page)
      addHistoryStep({
        type: 'adjust-page',
        comicConfig: comicConfigCopy,
      })
    }
  }, [getCurrentHistoryStep, addHistoryStep])

  const deletePage = useCallback((pageId: PageId) => {
    const currentStep = getCurrentHistoryStep()
    const currentPageId = getCurrentPageId()
    if (currentStep) {
      const comicConfig = currentStep.comicConfig
      const comicConfigCopy = deepCopy(comicConfig) as CanvasComicConfig
      if (pageId === currentPageId) {
        const index = comicConfigCopy.pages.findIndex(page => page.id === pageId)
        let nextPageId: PageId = ''
        if (index > 0) {
          nextPageId = comicConfigCopy.pages[index - 1].id
        }
        else if (index < comicConfigCopy.pages.length - 1) {
          nextPageId = comicConfigCopy.pages[index + 1].id
        }
        setCurrentPageId(nextPageId)
        setCurrentGridId('')
      }
      comicConfigCopy.pages = comicConfigCopy.pages.filter(page => page.id !== pageId)
      addHistoryStep({
        type: 'adjust-page',
        comicConfig: comicConfigCopy,
      })
    }
  }, [setCurrentPageId, setCurrentGridId, getCurrentPageId, getCurrentHistoryStep, addHistoryStep])

  return { adjustGrid, adjustPage, addPage, deletePage }
}
