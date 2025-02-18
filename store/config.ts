import { create } from 'zustand';
import { combine } from 'zustand/middleware'

const useConfigStore = create(
  combine(
    {
      gridFocusId: "" as string | number,
      isAttrCardShowed: false,
    },
    (set, get) => {
      return {
        setGridFocusId: (id: string | number) => {
          set(() => ({
            gridFocusId: id,
          }))
        },
        cleanGridFocus: () => {
          set(() => ({
            gridFocusId: "",
          }))
        },
        getGridFocusId: () => {
          return get().gridFocusId;
        },

        setIsAttrCardShowed: (val: boolean) => {
          set(() => ({
            isAttrCardShowed: val,
          }))
        },
        getIsAttrCardShowed: () => {
          return get().isAttrCardShowed;
        },
      }
    },
  ),
)

export default useConfigStore;
