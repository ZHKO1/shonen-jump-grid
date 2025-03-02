"use client";
import React, { useCallback } from "react";
import { AnimatePresence } from "framer-motion";
// import { useOutsideClick } from "@/hooks/use-outside-click";
import useConfigStore from "@/store/config";
import useStepsStore from "@/store/step";
import { getGridFromComicConfig } from "../canvas/components/grid/utils";
import { defaultDocument } from "@/lib";
import SliderItem from "./SliderItem";

export default function Slider() {
    const { getCurrentStep } = useStepsStore();
    const { getGridFocusId, getShowImgCrop, setShowImgCrop } = useConfigStore();

    const array = [
        {
            id: 1
        },
        {
            id: 2
        }
    ];

    return (
        <div className="w-full h-full border-r-2 border-gray-200 overflow-auto">
            {
                array.map((item) => {
                    return (
                        <SliderItem
                            key={item.id}
                            id={item.id}
                        />
                    );
                })
            }
        </div>
    );
}

