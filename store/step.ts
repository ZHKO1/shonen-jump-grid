import { create } from 'zustand';
import { combine } from 'zustand/middleware'
import { ComicConfig } from '../components/canvas/components/grid/types';

type HistoryStep = {
  type: "init" | "split" | "adjust",
  comicConfig: ComicConfig,
}

const useStepsStore = create(
  combine(
    {
      historySteps: [] as HistoryStep[],
      currentHistoryStepIndex: -1,
      isCurrentHistoryStepTmp: false,
    },
    (set, get) => {
      return {
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
      }
    },
  ),
)

export default useStepsStore;
