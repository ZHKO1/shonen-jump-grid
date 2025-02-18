import { create } from 'zustand';
import { combine } from 'zustand/middleware'

const useConfigStore = create(
  combine(
    {
      gridFocusId: "" as string | number,
      isAttrCardShowed: true,
      isImgCropShowed: false,
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

        setIsImgCropShowed: (val: boolean) => {
          set(() => ({
            isImgCropShowed: val,
          }))
        },
        getIsImgCropShowed: () => {
          return get().isImgCropShowed;
        },
      }
    },
  ),
)

export default useConfigStore;
