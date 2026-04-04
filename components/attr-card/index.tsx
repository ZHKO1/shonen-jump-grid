'use client'
import { getPageFromComicConfig } from '@/components/canvas/utils'
import useComicStatusStore from '@/store'
import PageAttr from './PageAttr'

export default function AttrCard() {
  const showAttrCard = useComicStatusStore(state => state.showAttrCard)
  const currentPageId = useComicStatusStore(state => showAttrCard ? state.currentPageStatus.id : '')
  const comicConfig = useComicStatusStore(state => showAttrCard ? state.historySteps[state.currentHistoryStepIndex]?.comicConfig : null)

  const page = comicConfig && getPageFromComicConfig(comicConfig, currentPageId) || void 0

  if (!showAttrCard) {
    return null
  }

  return (
    <PageAttr page={page} />
  )
}
