import { create, StateCreator } from 'zustand';
import { ComicConfig, GridId, PageId } from '@/components/canvas/components/grid/types';

interface CurrentStatusSlice {
  // 焦点页
  currentPageId: PageId
  // 焦点Grid
  currentGridId: GridId
  setCurrentPageId: (pageId: PageId) => void
  getCurrentPageId: () => PageId
  setCurrentGridId: (id: GridId) => void
  resetCurrentGridId: () => void
  getCurrentGridId: () => GridId
}

interface ShowComponentSlice {
  // AttrCard组件是否显示
  showAttrCard: boolean,
  // ImgCrop组件是否显示
  showImgCrop: boolean,
  setShowAttrCard: (val: boolean) => void
  getShowAttrCard: () => boolean
  setShowImgCrop: (val: boolean) => void
  getShowImgCrop: () => boolean
}

type HistoryStep = {
  type: "init" | "split" | "adjust-grid" | "add-page",
  comicConfig: ComicConfig,
}

interface HistoryStepSlice {
  // 记录用户操作历史
  historySteps: HistoryStep[],
  // 当前用户操作历史条目索引
  currentHistoryStepIndex: number,
  // 用户当前操作是否暂缓状态
  isCurrentHistoryStepTmp: boolean,
  addHistoryStep: (step: HistoryStep, options?: { tmp?: boolean }) => void
  getCurrentHistoryStep: () => HistoryStep | null
  setCurrentHistoryStep: (val: HistoryStep) => void
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
  currentPageId: "",
  currentGridId: "",
  setCurrentPageId: (pageId: PageId) => {
    set(() => ({
      currentPageId: pageId,
    }))
  },
  getCurrentPageId: () => {
    return get().currentPageId;
  },
  setCurrentGridId: (id: GridId) => {
    set(() => ({
      currentGridId: id,
    }))
  },
  resetCurrentGridId: () => {
    set(() => ({
      currentGridId: "",
    }))
  },
  getCurrentGridId: () => {
    return get().currentGridId;
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
  setShowAttrCard: (val: boolean) => {
    set(() => ({
      showAttrCard: val,
    }))
  },
  getShowAttrCard: () => {
    return get().showAttrCard;
  },
  setShowImgCrop: (val: boolean) => {
    set(() => ({
      showImgCrop: val,
    }))
  },
  getShowImgCrop: () => {
    return get().showImgCrop;
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
        } else {
          // 替换currentStep（tmp）
          return {
            historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex), step],
          }
        }
      } else {
        if (!state.isCurrentHistoryStepTmp) {
          // 正常添加step
          return {
            historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex + 1), step],
            currentHistoryStepIndex: state.currentHistoryStepIndex + 1,
          }
        } else {
          // 替换currentStep（tmp），isCurrentTmp赋予false
          return {
            historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex), step],
            isCurrentHistoryStepTmp: false,
          }
        }
      }
    })
  },
  getCurrentHistoryStep: () => {
    const currentHistoryStepIndex = get().currentHistoryStepIndex;
    if (currentHistoryStepIndex < 0) return null;
    const step = get().historySteps[currentHistoryStepIndex];
    return step;
  },
  setCurrentHistoryStep: (step: HistoryStep) => {
    const currentHistoryStepIndex = get().currentHistoryStepIndex;
    if (currentHistoryStepIndex < 0) return null;
    set((state) => ({
      historySteps: [...state.historySteps.slice(0, state.currentHistoryStepIndex), step],
    }))
  },
  nextHistoryStep: () => {
    set((state) => ({
      currentHistoryStepIndex: Math.min(state.currentHistoryStepIndex + 1, state.historySteps.length - 1),
    }))
  },
  prevHistoryStep: () => {
    set((state) => ({
      currentHistoryStepIndex: Math.max(state.currentHistoryStepIndex - 1, 0),
    }))
  },
})

const useComicStatusStore = create<ALLStore>()((...arg) => ({
  ...createCurrentStatusSlice(...arg),
  ...createShowComponentSlice(...arg),
  ...createHistoryStepSlice(...arg),
}))

export default useComicStatusStore;
