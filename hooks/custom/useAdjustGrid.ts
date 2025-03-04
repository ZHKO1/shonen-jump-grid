import { useCallback } from "react";
import useComicStatusStore from "@/store";
import { getGridFromComicConfig } from "../../components/canvas/components/grid/utils";
import { GridId } from "../../components/canvas/components/grid/types";


type UseAdjustGrid = (id: GridId, value: any, options?: {
    tmp: boolean,
}) => void

export function useAdjustGrid(): UseAdjustGrid {
    const addHistoryStep = useComicStatusStore(state => state.addHistoryStep);
    const getCurrentHistoryStep = useComicStatusStore(state => state.getCurrentHistoryStep);

    const ajustGrid = useCallback((id: GridId, params: any, { tmp } = {
        tmp: false,
    }) => {
        const currentStep = getCurrentHistoryStep();
        if (currentStep) {
            const comicConfig = currentStep.comicConfig;
            const comicConfigCopy = JSON.parse(JSON.stringify(comicConfig));
            const targetGrid = getGridFromComicConfig(comicConfigCopy, id);
            if (targetGrid) {
                Object.assign(targetGrid, params);
                addHistoryStep({
                    type: "adjust",
                    comicConfig: comicConfigCopy,
                }, {
                    tmp,
                });
            }
        }
    }, []);
    return ajustGrid;
}