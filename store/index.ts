import type { StateCreator } from 'zustand'
import type { CanvasComicConfig, GridId, PageId } from '@/components/canvas/types'
import { create } from 'zustand'
import { getIsLogoPage, getPageFromComicConfig } from '@/components/canvas/utils'

interface PageShareStatus {
  id: PageId
  gridId: GridId
  type: 'custom-page' | 'logo-page'
}

export interface PageStatus extends PageShareStatus {
  id: PageId
  gridId: GridId
  type: 'custom-page'
}

export type LayerType = 'logo' | 'grids'
export interface LogoPageStatus extends PageShareStatus {
  id: PageId
  gridId: GridId
  type: 'logo-page'
  layerType: LayerType
}

interface CurrentStatusSlice {
  currentPageStatus: PageStatus | LogoPageStatus
  setCurrentPageId: (pageId: PageId) => void
  getCurrentPageId: () => PageId
  setCurrentGridId: (id: GridId) => void
  resetCurrentGridId: () => void
  getCurrentGridId: () => GridId
  setCurrentLayerType: (layerType: LayerType) => void
  getCurrentLayerType: () => LayerType
}

interface ShowComponentSlice {
  // AttrCard组件是否显示
  showAttrCard: boolean
  // ImgCrop组件是否显示
  showImgCrop: boolean
  // Comic组件是否显示
  showComic: boolean
  setShowAttrCard: (val: boolean) => void
  getShowAttrCard: () => boolean
  setShowImgCrop: (val: boolean) => void
  getShowImgCrop: () => boolean
  setShowComic: (val: boolean) => void
  getShowComic: () => boolean
}

interface HistoryStep {
  type: 'init' | 'split' | 'adjust-grid' | 'adjust-page'
  comicConfig: CanvasComicConfig
}

interface HistoryStepSlice {
  // 记录用户操作历史
  historySteps: HistoryStep[]
  // 当前用户操作历史条目索引
  currentHistoryStepIndex: number
  // 用户当前操作是否暂缓状态
  isCurrentHistoryStepTmp: boolean
  addHistoryStep: (step: HistoryStep, options?: { tmp?: boolean }) => void
  getCurrentHistoryStep: () => HistoryStep | null
  setCurrentHistoryStep: (val: HistoryStep) => void
  cleanAllHistoryStep: () => void
  nextHistoryStep: () => void
  prevHistoryStep: () => void
}

type ALLStore = CurrentStatusSlice & ShowComponentSlice & HistoryStepSlice

const createCurrentStatusSlice: StateCreator<
  ALLStore,
  [],
  [],
  CurrentStatusSlice
> = (set, get) => ({
  currentPageStatus: {
    id: '',
    gridId: '',
    type: 'custom-page',
  },
  setCurrentPageId: (pageId: PageId) => {
    const currentStep = get().historySteps[get().currentHistoryStepIndex]
    const comicConfig = currentStep?.comicConfig
    const page = comicConfig && getPageFromComicConfig(comicConfig, pageId) || void 0
    const isLogoPage = page && getIsLogoPage(page) || false
    set(() => ({
      currentPageStatus: {
        id: pageId,
        gridId: '',
        type: isLogoPage ? 'logo-page' : 'custom-page',
        ...(isLogoPage ? { layerType: 'grids' } : {}),
      } as PageStatus | LogoPageStatus,
    }))
  },
  getCurrentPageId: () => {
    return get().currentPageStatus.id
  },
  setCurrentGridId: (id: GridId) => {
    set((state) => {
      return {
        currentPageStatus: {
          ...state.currentPageStatus,
          gridId: id,
          ...(state.currentPageStatus.type === 'logo-page'
            ? {
                layerType: 'grids',
              }
            : {}),
        },
      }
    })
  },
  resetCurrentGridId: () => {
    set(state => ({
      currentPageStatus: {
        ...state.currentPageStatus,
        gridId: '',
      },
    }))
  },
  getCurrentGridId: () => {
    return get().currentPageStatus.gridId
  },
  setCurrentLayerType: (layerType: LayerType) => {
    if (get().currentPageStatus.type === 'logo-page') {
      set(state => ({
        currentPageStatus: {
          ...state.currentPageStatus,
          layerType,
        },
      }))
    }
  },
  getCurrentLayerType: () => {
    const status = get().currentPageStatus
    if (status.type === 'logo-page') {
      return status.layerType
    }
    return 'grids'
  },
})

const createShowComponentSlice: StateCreator<
  ALLStore,
  [],
  [],
  ShowComponentSlice
> = (set, get) => ({
  showAttrCard: true,
  showImgCrop: false,
  showComic: false,
  setShowAttrCard: (val: boolean) => {
    set(() => ({
      showAttrCard: val,
    }))
  },
  getShowAttrCard: () => {
    return get().showAttrCard
  },
  setShowImgCrop: (val: boolean) => {
    set(() => ({
      showImgCrop: val,
    }))
  },
  getShowImgCrop: () => {
    return get().showImgCrop
  },
  setShowComic: (val: boolean) => {
    set(() => ({
      showComic: val,
    }))
  },
  getShowComic: () => {
    return get().showComic
  },
})

const createHistoryStepSlice: StateCreator<
  ALLStore,
  [],
  [],
  HistoryStepSlice
> = (set, get) => ({
  historySteps: [],
  currentHistoryStepIndex: -1,
  isCurrentHistoryStepTmp: false,
  addHistoryStep: (step: HistoryStep, options?: { tmp?: boolean }) => {
    set((state) => {
      if (options && options.tmp) {
        // 说明要添加的step是tmp
        if (!state.isCurrentHistoryStepTmp) {
          // 正常添加，修改isCurrentTmp
          return {
            historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex + 1), step],
            currentHistoryStepIndex: state.currentHistoryStepIndex + 1,
            isCurrentHistoryStepTmp: true,
          }
        }
        else {
          // 替换currentStep（tmp）
          return {
            historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex), step],
          }
        }
      }
      else {
        if (!state.isCurrentHistoryStepTmp) {
          // 正常添加step
          return {
            historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex + 1), step],
            currentHistoryStepIndex: state.currentHistoryStepIndex + 1,
          }
        }
        else {
          // 替换currentStep（tmp），isCurrentTmp赋予false
          return {
            historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex), step],
            isCurrentHistoryStepTmp: false,
          }
        }
      }
    })
  },
  cleanAllHistoryStep: () => {
    set(() => ({
      currentHistoryStepIndex: -1,
      isCurrentHistoryStepTmp: false,
      historySteps: [],
    }))
  },
  getCurrentHistoryStep: () => {
    const currentHistoryStepIndex = get().currentHistoryStepIndex
    if (currentHistoryStepIndex < 0)
      return null
    const step = get().historySteps[currentHistoryStepIndex]
    return step
  },
  setCurrentHistoryStep: (step: HistoryStep) => {
    const currentHistoryStepIndex = get().currentHistoryStepIndex
    if (currentHistoryStepIndex < 0)
      return null
    set(state => ({
      historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex), step],
    }))
  },
  nextHistoryStep: () => {
    set(state => ({
      currentHistoryStepIndex: Math.min(state.currentHistoryStepIndex + 1, state.historySteps.length - 1),
    }))
  },
  prevHistoryStep: () => {
    set(state => ({
      currentHistoryStepIndex: Math.max(state.currentHistoryStepIndex - 1, 0),
    }))
  },
})

const useComicStatusStore = create<ALLStore>()((...arg) => ({
  ...createCurrentStatusSlice(...arg),
  ...createShowComponentSlice(...arg),
  ...createHistoryStepSlice(...arg),
}))

// const unsub1 = useComicStatusStore.subscribe((state, prevstate) => {
//   console.log("-------------------------");
//   console.log(state)
//   console.log(prevstate)
// })

export default useComicStatusStore
