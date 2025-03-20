'use client'
import { useEffect, useMemo, useRef } from 'react'
import { cn, off, on } from '@/lib/utils'
import useComicStatusStore from '@/store'
import { LOGO_PAGE_GRIDS_CONFIG, LOGO_PAGE_HEIGHT } from './constant'
import { ContainerContext } from './context/container'
import { Grid } from './grid'
import Logo from './logo'
import { getIsLogoPage, getPageFromComicConfig } from './utils'

function Canvas({ scale }: { scale: number }) {
  const containerRef = useRef(null)
  const ContainerContextValue = useMemo(() => ({ container: containerRef, scale }), [containerRef, scale])
  const pageId = useComicStatusStore(state => state.currentPageStatus.id)
  const { getCurrentLayerType } = useComicStatusStore()
  const layerType = getCurrentLayerType()
  const setCurrentPageId = useComicStatusStore(state => state.setCurrentPageId)
  const resetCurrentGridId = useComicStatusStore(state => state.resetCurrentGridId)
  const addHistoryStep = useComicStatusStore(state => state.addHistoryStep)
  const cleanAllHistoryStep = useComicStatusStore(state => state.cleanAllHistoryStep)
  const setCurrentLayerType = useComicStatusStore(state => state.setCurrentLayerType)
  const step = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex])
  const comicConfig = step?.comicConfig
  const page = comicConfig && getPageFromComicConfig(comicConfig, pageId)
  const isLogoPage = page && getIsLogoPage(page) || false
  const logo = page?.logo
  const grids = page && page.grids
  const height = page && page.height
  const extraProp = height ? { style: { height } } : {}

  useEffect(() => {
    addHistoryStep({
      type: 'init',
      comicConfig: {
        pages: [{
          id: 'page0',
          height: LOGO_PAGE_HEIGHT,
          readonly: true,
          logo: {
            url: '/logo.png',
          },
          grids: LOGO_PAGE_GRIDS_CONFIG,
        }],
      },
    })
    setCurrentPageId('page0')
    setCurrentLayerType('logo')
    return () => {
      cleanAllHistoryStep()
    }
  }, [setCurrentPageId, setCurrentLayerType, addHistoryStep, cleanAllHistoryStep])

  const container = containerRef.current
  useEffect(() => {
    if (!grids?.length || !container) {
      return
    }

    const containerElement = containerRef.current

    const handleDocumentClick = () => {
      resetCurrentGridId()
    }

    on(containerElement, 'click', handleDocumentClick)

    return () => {
      if (!grids?.length || !container) {
        return
      }
      off(containerElement, 'click', handleDocumentClick)
    }
  }, [grids?.length, container, resetCurrentGridId])

  return (
    <div
      ref={containerRef}
      className="canvas-content w-[720px] bg-gray-100 relative overflow-hidden border-2 border-gray-400 text-4xl font-bold text-black"
      {...extraProp}
    >
      <ContainerContext value={ContainerContextValue}>
        <div className={cn(layerType !== 'grids' && 'pointer-events-none opacity-30')}>
          {grids && grids.map(grid => (<Grid grid={grid} key={grid.id} />))}
        </div>
        {isLogoPage && <Logo focused={layerType === 'logo'} logo={logo} />}
      </ContainerContext>
    </div>
  )
}

Canvas.displayName = 'Canvas'

export default Canvas
