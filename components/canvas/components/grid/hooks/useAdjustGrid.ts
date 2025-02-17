import { useCallback } from "react";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig } from "../utils";


type Fun = (id: string | number, value: any, options?: {
    preview: boolean
}) => void

export function useAdjustGrid(): Fun {
    const { addStep, getCurrentStep, setCurrentStep } = useStepsStore();

    const ajustGrid = useCallback((id: string | number, params: any, { preview } = {
        preview: false
    }) => {
        const currentStep = getCurrentStep();
        if (currentStep) {
            const comicConfig = currentStep.comicConfig;
            const newComicConfig = JSON.parse(JSON.stringify(comicConfig));
            if (preview) {
                const oldGrid = getGridFromComicConfig(newComicConfig, id);
                if (oldGrid) {
                    Object.assign(oldGrid, params);
                    addStep({
                        type: "adjust",
                        comicConfig: newComicConfig,
                    }, true);
                }
            } else {
                const newGrid = getGridFromComicConfig(newComicConfig, id);
                if (newGrid) {
                    Object.assign(newGrid, params);
                    addStep({
                        type: "adjust",
                        comicConfig: newComicConfig,
                    });
                }
            }
        }
    }, []);
    return ajustGrid;
}