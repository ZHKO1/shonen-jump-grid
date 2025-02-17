import { create } from 'zustand';
import { combine } from 'zustand/middleware'
import { ComicConfig } from '../components/canvas/components/grid/types';

type Step = {
  type: "init" | "split" | "adjust",
  comicConfig: ComicConfig,
}

const useStepsStore = create(
  combine(
    {
      steps: [] as Step[],
      currentIndex: -1,
      isCurrentTmp: false,
    },
    (set, get) => {
      return {
        addStep: (step: Step, isTmp?: boolean) => {
          set((state) => {
            if (isTmp) {
              // 说明要添加的step是tmp
              if (!state.isCurrentTmp) {
                // 正常添加，修改isCurrentTmp
                return {
                  steps: [...state.steps.slice(0), step],
                  currentIndex: state.currentIndex + 1,
                  isCurrentTmp: true,
                }
              } else {
                // 替换currentStep（tmp）
                return {
                  steps: [...state.steps.slice(0, state.currentIndex), step],
                }
              }
            } else {
              if (!state.isCurrentTmp) {
                // 正常添加step
                return {
                  steps: [...state.steps.slice(0), step],
                  currentIndex: state.currentIndex + 1,
                }
              } else {
                // 替换currentStep（tmp），isCurrentTmp赋予false
                return {
                  steps: [...state.steps.slice(0, state.currentIndex), step],
                  isCurrentTmp: false,
                }
              }
            }
          })
        },
        getCurrentStep: () => {
          const currentIndex = get().currentIndex;
          if (currentIndex < 0) return null;
          const step = get().steps[currentIndex];
          return step;
        },
        setCurrentStep: (step: Step, createTmp: boolean) => {
          const currentIndex = get().currentIndex;
          if (currentIndex < 0) return null;
          set((state) => ({
            steps: [...state.steps.slice(0, state.currentIndex), step],
          }))
        },
        nextStep: () => {
          set((state) => ({
            currentIndex: Math.min(state.currentIndex + 1, state.steps.length - 1),
          }))
        },
        prevStep: () => {
          set((state) => ({
            currentIndex: Math.max(state.currentIndex - 1, 0),
          }))
        },
      }
    },
  ),
)

export default useStepsStore;
