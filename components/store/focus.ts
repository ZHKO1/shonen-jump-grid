import { create } from 'zustand';
import { combine } from 'zustand/middleware'

const useFocusStore = create(
  combine(
    {
      focusId: "" as string | number,
    },
    (set, get) => {
      return {
        setFocusId: (id: string | number) => {
          set((state) => ({
            focusId: id,
          }))
        },
        clean: () => {
          set((state) => ({
            focusId: "",
          }))
        },
        getFocusId: () => {
          return get().focusId;
        },

      }
    },
  ),
)

export default useFocusStore;
