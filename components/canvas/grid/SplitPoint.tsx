import { useContext, useRef } from "react";
import { useDraggable } from "@/hooks";
import { ContainerContext } from "../context/container";
import { Point } from "../types";

export default function SplitPoint({
    point,
    onChange,
    draggable = false
}: {
    point: Point,
    onChange: (val: Point, isDrawing: boolean) => void,
    draggable?: boolean
}) {
    const pointRef = useRef<HTMLDivElement>(null);
    const gridRef = useContext(ContainerContext).container;

    const [, ,] = useDraggable(pointRef, {
        initialValue: { x: point.x - 5, y: point.y - 5 },
        containerElement: gridRef,
        preventDefault: true,
        stopPropagation: true,
        onMove(position) {
            onChange({
                x: position.x + 5,
                y: position.y + 5,
            }, true);
        },
        onEnd(position) {
            onChange({
                x: position.x + 5,
                y: position.y + 5,
            }, false);
        },
        enabled: draggable
    });

    return (
        <div
            ref={pointRef}
            className='absolute size-[10px] rounded-full bg-black cursor-pointer'
            style={{ left: point.x - 5, top: point.y - 5 }}
        ></div>
    );
}