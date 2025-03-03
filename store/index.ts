import { create } from 'zustand';
import { combine } from 'zustand/middleware'
import { GridId, PageId } from '@/components/canvas/components/grid/types';

const useComicStatusStore = create(
  combine(
    {
      // 焦点页
      currentPageId: "" as PageId,
      // 焦点Grid
      currentGridId: "" as GridId,
      // AttrCard组件是否显示
      showAttrCard: true,
      // ImgCrop组件是否显示
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

export default useComicStatusStore;
