import { useCallback } from "react";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig } from "../utils";

export function useAdjustGrid(): (id: string | number, params: any) => void {
    const { addStep, getCurrentStep } = useStepsStore();

    const ajustGrid = useCallback((id: string | number, params: any) => {
        const currentStep = getCurrentStep();
        if (currentStep) {
            const comicConfig = currentStep.comicConfig;
            const newComicConfig = JSON.parse(JSON.stringify(comicConfig));
            const newGrid = getGridFromComicConfig(newComicConfig, id);
            if (newGrid) {
                Object.assign(newGrid, params);
                addStep({
                    type: "adjust",
                    comicConfig: newComicConfig,
                });
            }
        }
    }, []);
    return ajustGrid;
}