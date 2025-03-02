import { create } from 'zustand';
import { combine } from 'zustand/middleware'

const useConfigStore = create(
  combine(
    {
      currentPage: -1,
      gridFocusId: "" as string | number,
      showAttrCard: true,
      showImgCrop: false,
    },
    (set, get) => {
      return {
        setCurrentPage: (page: number) => {
          set(() => ({
            currentPage: page,
          }))
        },
        getCurrentPage: () => {
          return get().currentPage;
        },
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
      }
    },
  ),
)

export default useConfigStore;
