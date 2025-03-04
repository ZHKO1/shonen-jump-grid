import { useCallback } from "react";
import useComicStatusStore from "@/store";
import { getGridFromComicConfig } from "../../components/canvas/components/grid/utils";
import { ComicConfig, GridId, PageConfig } from "../../components/canvas/components/grid/types";

export function useAdjustComic() {
    const addHistoryStep = useComicStatusStore(state => state.addHistoryStep);
    const getCurrentHistoryStep = useComicStatusStore(state => state.getCurrentHistoryStep);

    const adjustGrid = useCallback((id: GridId, params: any, { tmp } = {
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
                    type: "adjust-grid",
                    comicConfig: comicConfigCopy,
                }, {
                    tmp,
                });
            }
        }
    }, []);

    const addPage = useCallback((page: PageConfig) => {
        const currentStep = getCurrentHistoryStep();
        if (currentStep) {
            const comicConfig = currentStep.comicConfig;
            const comicConfigCopy = JSON.parse(JSON.stringify(comicConfig)) as ComicConfig;
            comicConfigCopy.pages.push(page);
            addHistoryStep({
                type: "add-page",
                comicConfig: comicConfigCopy,
            });
        }
    }, []);

    return { adjustGrid, addPage };
}