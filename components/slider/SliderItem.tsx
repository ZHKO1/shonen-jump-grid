import React, { useCallback } from "react";
import { Plus, X } from "lucide-react";
import { PageConfig, PageId } from "../canvas/components/grid/types";
import { cn } from "@/lib/utils";

export default function SliderItem({ page, add = false, focused = false, onClick, onDelete }: { page?: PageConfig, add?: boolean, focused?: boolean, onClick: React.MouseEventHandler<HTMLDivElement>, onDelete?: React.MouseEventHandler<HTMLDivElement> }) {
    const id = page?.id || "";
    const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        onClick(e)
    }, [onClick]);
    const handleDelete: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        onDelete && onDelete(e)
    }, [onDelete]);
    return (
        <div className={cn("group relative select-none w-[100px] h-32 border-2 mx-auto my-3 p-3 border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400")} onClick={handleClick}>
            {
                add ? <Plus className="size-6 text-gray-400 group-hover:text-gray-600" /> : (
                    <>
                        <div className="absolute -top-3 -right-3 hidden group-hover:flex rounded-full w-6 h-6 bg-black"
                            onClick={handleDelete}>
                            <X className="w-4 h-4 text-white m-auto" />
                        </div>
                        <div className={cn("font-bold w-full h-full bg-slate-200 flex items-center justify-center", focused && "bg-slate-400 text-white")}>
                            {id}
                        </div>
                    </>
                )
            }
        </div>
    );
}

