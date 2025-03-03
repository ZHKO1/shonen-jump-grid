import { create } from 'zustand';
import { combine } from 'zustand/middleware'
import { GridId, PageId } from '@/components/canvas/components/grid/types';

const useConfigStore = create(
  combine(
    {
      currentPageId: "" as PageId,
      currentGridId: "" as GridId,
      showAttrCard: true,
      showImgCrop: false,
    },
    (set, get) => {
      return {
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
