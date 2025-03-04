"use client";
import React from "react";
import useComicStatusStore from "@/store";
import SliderItem from "./SliderItem";
import { GridConfig, PageId } from "../canvas/components/grid/types";
import { useAdjustComic } from "@/hooks/custom/useAdjustComic";

let GlobalPageId = 1;

const NewGridConfig: GridConfig = {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 18,
    "rb_x": 703,
    "rb_y": 1063,
    "id": 0,
}

export default function Slider() {
    const step = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex]);
    const comicConfig = step?.comicConfig;
    const pages = comicConfig?.pages || [];
    const { addPage } = useAdjustComic();
    const currentPageId = useComicStatusStore(state => state.currentPageId);
    const setCurrentPageId = useComicStatusStore(state => state.setCurrentPageId);

    const handleClick = (pageId: PageId) => {
        setCurrentPageId(pageId);
    }

    const handleAdd = () => {
        let pageId = "page" + GlobalPageId++;
        const page = {
            id: pageId,
            grids: [
                {
                    ...NewGridConfig,
                    id: pageId + ":" + 0
                }
            ]
        }
        addPage(page);
        setCurrentPageId(pageId);
    }

    return (
        <div className="w-full h-full border-r-2 border-gray-200 overflow-y-auto">
            {
                pages.map((page) => {
                    return (
                        <SliderItem
                            key={page.id}
                            page={page}
                            onClick={handleClick}
                            focused={currentPageId == page.id}
                        />
                    );
                })
            }
            <SliderItem
                key={"add"}
                add
                onClick={handleAdd}
            />
        </div>
    );
}

