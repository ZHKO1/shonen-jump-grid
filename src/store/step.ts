import { create } from 'zustand';
import { combine } from 'zustand/middleware'
import { ComicConfig } from '../components/canvas/components/grid/types';

type Step = {
  type: "init" | "split" | "adjust-space",
  comicConfig: ComicConfig,
}

const useStepsStore = create(
  combine(
    {
      steps: [] as Step[],
      currentIndex: -1,
    },
    (set, get) => {
      return {
        addStep: (step: Step) => {
          set((state) => ({
            steps: [...state.steps.slice(0, state.currentIndex + 1), step],
            currentIndex: state.currentIndex + 1,
          }))
        },
        getCurrentStep: () => {
          const currentIndex = get().currentIndex;
          if (currentIndex < 0) return null;
          const step = get().steps[currentIndex];
          return step;
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
