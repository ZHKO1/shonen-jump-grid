import { useRef } from "react";
import { useElementBounding } from "./useElementBounding";
import { BasicTarget } from "@/lib/utils";

export type useResizeScale = (
    width: number,
    height: number,
    scaleDom: BasicTarget<Element>,
    callback?: (scale: { width: number; height: number }) => void
) => {
    scaleX: number,
    scaleY: number,
}

export const useResizeScale: useResizeScale = (width, height, scaleDom) => {
    const {
        height: contianerHeight,
        width: contianerWidth,
    } = useElementBounding(scaleDom, {
        windowResize: true,
        immediate: true,
    });

    const baseWidth = width
    const baseHeight = height

    // * 默认缩放值
    const scaleRef = useRef({
        scaleX: 1,
        scaleY: 1
    })

    console.log(scaleRef.current, contianerHeight, contianerWidth);
    const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
    const currentRate = parseFloat(
        (contianerWidth / contianerHeight).toFixed(5)
    )
    if (scaleDom) {
        if (currentRate > baseProportion) {
            // 表示更宽
            scaleRef.current.scaleX = parseFloat(
                ((contianerHeight * baseProportion) / baseWidth).toFixed(5)
            )
            scaleRef.current.scaleY = parseFloat((contianerHeight / baseHeight).toFixed(5))
            // scaleDom.style.transform = `scale(${scaleRef.current.width}, ${scaleRef.current.height})`
        } else {
            // 表示更高
            scaleRef.current.scaleY = parseFloat(
                (contianerWidth / baseProportion / baseHeight).toFixed(5)
            )
            scaleRef.current.scaleX = parseFloat((contianerWidth / baseWidth).toFixed(5))
            // scaleDom.style.transform = `scale(${scaleRef.current.width}, ${scaleRef.current.height})`
        }
    }
    return scaleRef.current
}
