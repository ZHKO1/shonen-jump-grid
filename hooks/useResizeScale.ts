import type { BasicTarget } from '@/lib/utils'
import { useRef } from 'react'
import { useElementBounding } from './useElementBounding'

export type UseResizeScale = (
  width: number,
  height: number,
  scaleDom: BasicTarget<Element>,
  callback?: (scale: { width: number, height: number }) => void
) => {
  scaleX: number
  scaleY: number
}

export const useResizeScale: UseResizeScale = (width, height, scaleDom) => {
  const {
    height: containerHeight,
    width: containerWidth,
  } = useElementBounding(scaleDom, {
    windowResize: true,
    immediate: true,
  })

  const baseWidth = width
  const baseHeight = height

  // * 默认缩放值
  const scaleRef = useRef({
    scaleX: 1,
    scaleY: 1,
  })

  const baseProportion = Number.parseFloat((baseWidth / baseHeight).toFixed(5))
  const currentRate = Number.parseFloat(
    (containerWidth / containerHeight).toFixed(5),
  )
  if (scaleDom) {
    if (currentRate > baseProportion) {
      // 表示更宽
      scaleRef.current.scaleX = Number.parseFloat(
        ((containerHeight * baseProportion) / baseWidth).toFixed(5),
      )
      scaleRef.current.scaleY = Number.parseFloat((containerHeight / baseHeight).toFixed(5))
      // scaleDom.style.transform = `scale(${scaleRef.current.width}, ${scaleRef.current.height})`
    }
    else {
      // 表示更高
      scaleRef.current.scaleY = Number.parseFloat(
        (containerWidth / baseProportion / baseHeight).toFixed(5),
      )
      scaleRef.current.scaleX = Number.parseFloat((containerWidth / baseWidth).toFixed(5))
      // scaleDom.style.transform = `scale(${scaleRef.current.width}, ${scaleRef.current.height})`
    }
  }

  return scaleRef.current
}
