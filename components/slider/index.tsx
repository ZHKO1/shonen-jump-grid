"use client";
import React from "react";
import useComicStatusStore from "@/store";
import useStepsStore from "@/store/step";
import SliderItem from "./SliderItem";

export default function Slider() {

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

