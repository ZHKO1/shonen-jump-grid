'use client'
import { useEffect, useMemo, useRef } from 'react'
import { cn, off, on } from '@/lib/utils'
import useComicStatusStore from '@/store'
// import { LOGO_PAGE_GRIDS_CONFIG, LOGO_PAGE_HEIGHT } from './constant'
import { ContainerContext } from './context/container'
import { Grid } from './grid'
import Logo from './logo'
import { getIsLogoPage, getPageFromComicConfig } from './utils'

function Canvas({ scale }: { scale: number }) {
  const containerRef = useRef(null)
  const ContainerContextValue = useMemo(() => ({ container: containerRef, scale }), [containerRef, scale])
  const pageId = useComicStatusStore(state => state.currentPageStatus.id)
  const layerType = useComicStatusStore((state) => {
    return state.currentPageStatus.type === 'logo-page'
      ? state.currentPageStatus.layerType
      : 'grids'
  })
  const initializeComic = useComicStatusStore(state => state.initializeComic)
  const resetCurrentGridId = useComicStatusStore(state => state.resetCurrentGridId)
  const cleanAllHistoryStep = useComicStatusStore(state => state.cleanAllHistoryStep)
  const step = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex])
  const comicConfig = step?.comicConfig
  const page = comicConfig && getPageFromComicConfig(comicConfig, pageId)
  const isLogoPage = page && getIsLogoPage(page) || false
  const logo = page?.logo
  const refer = page?.refer
  const grids = page && page.grids
  const height = page && page.height
  const extraProp = height
    ? {
        style: {
          height,
          ...(refer && {
            backgroundImage: `url('${refer}')`,
            backgroundSize: `100% auto`,
            backgroundRepeat: `no-repeat`,
          } || {}),
        },
      }
    : {}

  useEffect(() => {
    const controller = new AbortController()
    let disposed = false

    fetch('./demo/onepiece/grid.json', { signal: controller.signal })
      .then(res => res.json())
      .then((comicConfig) => {
        if (disposed) {
          return
        }

        const firstPage = Array.isArray(comicConfig.pages) ? comicConfig.pages[0] : undefined
        const firstPageId = firstPage?.id ?? ''
        const layerType = firstPage && getIsLogoPage(firstPage) ? 'logo' : 'grids'
        initializeComic(comicConfig, firstPageId, { layerType })
      })
      .catch((error) => {
        if (disposed || error.name === 'AbortError') {
          return
        }

        console.error('load demo config failed', error)
      })

    return () => {
      disposed = true
      controller.abort()
      cleanAllHistoryStep()
    }
  }, [initializeComic, cleanAllHistoryStep])

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
        <div className={cn(layerType !== 'grids' && 'pointer-events-none opacity-30', refer && 'opacity-80')}>
          {grids && grids.map(grid => (<Grid grid={grid} key={grid.id} />))}
        </div>
        {isLogoPage && layerType === 'logo' && <Logo logo={logo} />}
      </ContainerContext>
    </div>
  )
}

Canvas.displayName = 'Canvas'

export default Canvas
