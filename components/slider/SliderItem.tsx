import React, { useCallback } from "react";

export default function SliderItem({ id }: { id?: number | string }) {
    return (
        <div className="w-3/4 h-32 border-2 mx-auto my-3 p-2 border-gray-200 flex items-center justify-center cursor-pointer">
            <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                {id}
            </div>
        </div>
    );
}

