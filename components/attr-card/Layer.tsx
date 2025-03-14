"use client"
import * as React from "react"

import { CanvasPageConfig } from "@/components/canvas/types"
import { Check } from "lucide-react"
// import useComicStatusStore from "@/store";

export default function Layer({ page }: { page?: CanvasPageConfig }) {
    const layers = [
        { name: "logo" },
        { name: "grids" }
    ]
    return (
        <div className="overflow-hidden text-foreground "
            role="presentation">
            {
                layers.map(layer => (
                    <div key={layer.name} role="group" aria-labelledby="radix-:r4kg:">
                        <div className="relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" id="radix-:r4kh:" cmdk-item="" role="option" aria-disabled="false" aria-selected="true" data-disabled="false" data-selected="true" data-value="Calendar">
                            <Check className="" />
                            <span>{layer.name}</span>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}
