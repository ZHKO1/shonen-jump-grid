'use client'
import type { CanvasPageConfig, PageId } from '@/components/canvas/types'
import React from 'react'
import { useAdjustComic } from '@/hooks/custom/useAdjustComic'
import useComicStatusStore from '@/store'
import AddPageDialog from './AddPageDialog'
import SliderItem from './SliderItem'

export default function Slider() {
  const step = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex])
  const comicConfig = step?.comicConfig
  const pages = comicConfig?.pages || []
  const { addPage, deletePage } = useAdjustComic()
  const currentPageId = useComicStatusStore(state => state.currentPageStatus.id)
  const setCurrentPageId = useComicStatusStore(state => state.setCurrentPageId)
  const setCurrentGridId = useComicStatusStore(state => state.setCurrentGridId)

  const handleClick = (e: React.MouseEvent, pageId: PageId) => {
    setCurrentPageId(pageId)
    setCurrentGridId('')
    e.stopPropagation()
  }

  const handleDelete = (e: React.MouseEvent, pageId: PageId) => {
    deletePage(pageId)
    e.stopPropagation()
  }

  const handleSubmit = (page: CanvasPageConfig) => {
    addPage(page)
    setCurrentPageId(page.id)
  }

  return (
    <>
      <div className="w-full h-full border-r-2 border-gray-200 overflow-y-auto no-scrollbar">
        {
          pages.map((page) => {
            return (
              <SliderItem
                key={page.id}
                page={page}
                onClick={e => handleClick(e, page.id)}
                onDelete={e => handleDelete(e, page.id)}
                focused={currentPageId === page.id}
              />
            )
          })
        }
        <AddPageDialog onSubmit={handleSubmit}>
          <SliderItem
            key="add"
            add
            // onClick={handleAdd}
          />
        </AddPageDialog>
      </div>
    </>
  )
}
