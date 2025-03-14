import React, { useCallback } from "react";
import { Lock, Plus, X } from "lucide-react";
import { CanvasPageConfig } from "@/components/canvas/types";
import { cn } from "@/lib/utils";

interface SliderItemProps {
    page?: CanvasPageConfig,
    add?: boolean,
    focused?: boolean,
    onClick?: React.MouseEventHandler<HTMLDivElement>,
    onDelete?: React.MouseEventHandler<HTMLDivElement>
}

const SliderItem: React.FC<SliderItemProps> = ({ page, add = false, focused = false, onClick, onDelete }) => {
    const id = page?.id || "";
    const readonly = page?.readonly || false;
    const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        if (typeof onClick === "function") {
            onClick(e)
        }
    }, [onClick]);
    const handleDelete: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        if (typeof onDelete === "function") {
            onDelete(e)
        }
    }, [onDelete]);

    const handleIconClick = readonly ? () => { } : handleDelete;
    const Icon = readonly ? Lock : X;

    return (
        <div className={cn("group relative select-none w-[100px] h-32 border-2 mx-auto my-3 p-3 border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400")} onClick={handleClick}>
            {
                add ? <Plus className="size-6 text-gray-400 group-hover:text-gray-600" /> : (
                    <>
                        <div className="absolute -top-3 -right-3 hidden group-hover:flex rounded-full w-6 h-6 bg-black"
                            onClick={handleIconClick}>
                            {
                                <Icon className="w-4 h-4 text-white m-auto" />
                            }
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

export default SliderItem;