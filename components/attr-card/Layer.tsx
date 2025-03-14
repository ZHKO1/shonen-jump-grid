"use client"
import { Check } from "lucide-react"
import useComicStatusStore, { LayerType } from "@/store";

const LOGO_PAGE_LAYERS: Record<"name", LayerType>[] = [
    { name: "logo" },
    { name: "grids" }
];

export default function Layer({ onClick }: { onClick: (val: LayerType) => void }) {
    const status = useComicStatusStore(state => state.currentPageStatus);
    const layers = LOGO_PAGE_LAYERS;
    let currentLayerType = "grids";
    if (status.type === "logo-page") {
        currentLayerType = status.layerType;
    }

    const handleClick = (val: LayerType) => {
        onClick(val);
    }

    return (
        <div className="overflow-hidden text-foreground "
            role="presentation">
            {
                layers.map(layer => (
                    <div key={layer.name} role="group" aria-labelledby="radix-:r4kg:" onClick={() => handleClick(layer.name)}>
                        <div className="relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" id="radix-:r4kh:" role="option">
                            {
                                currentLayerType === layer.name ? <Check className="" /> : <span className="w-4 h-4"></span>
                            }
                            <span>{layer.name}</span>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}
