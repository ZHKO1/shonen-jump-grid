import { create } from 'zustand';
import { combine } from 'zustand/middleware'

const useAttrStore = create(
  combine(
    {
      show: true as boolean,
    },
    (set, get) => {
      return {
        setShow: (val: boolean) => {
          set(() => ({
            show: val,
          }))
        },
        getShow: () => {
          return get().show;
        },
      }
    },
  ),
)

export default useAttrStore;
