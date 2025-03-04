import React, { useCallback } from "react";
import { Plus } from "lucide-react";
import { PageConfig, PageId } from "../canvas/components/grid/types";
import { cn } from "@/lib/utils";

export default function SliderItem({ page, add = false, focused = false, onClick }: { page?: PageConfig, add?: boolean, focused?: boolean, onClick: (id: PageId) => void }) {
    const id = page?.id || "";
    const handleClick = useCallback(() => {
        onClick(id)
    }, []);
    return (
        <div className={cn("group w-[100px] h-32 border-2 mx-auto my-3 p-2 border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400", focused && "border-gray-400")} onClick={handleClick}>
            {
                add ? <Plus className="size-6 text-gray-400 group-hover:text-gray-600" /> : (<div className="font-bold w-full h-full bg-slate-200 flex items-center justify-center group-hover:bg-slate-400 group-hover:text-white">
                    {id}
                </div>)
            }
        </div>
    );
}

