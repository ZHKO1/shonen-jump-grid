import { useCallback } from "react";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig } from "../utils";
import useConfigStore from "@/store/config";


type Fun = (id: string | number, value: any, options?: {
    tmp: boolean,
}) => void

export function useAdjustGrid(): Fun {
    const { addStep, getCurrentStep } = useStepsStore();
    const { getCurrentPage } = useConfigStore();

    const ajustGrid = useCallback((id: string | number, params: any, { tmp } = {
        tmp: false,
    }) => {
        const currentStep = getCurrentStep();
        const currentPage = getCurrentPage();
        if (currentStep) {
            const comicConfig = currentStep.comicConfig;
            const comicConfigCopy = JSON.parse(JSON.stringify(comicConfig));
            const targetGrid = getGridFromComicConfig(comicConfigCopy, currentPage, id);
            if (targetGrid) {
                Object.assign(targetGrid, params);
                addStep({
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