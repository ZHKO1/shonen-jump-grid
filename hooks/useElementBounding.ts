import type { BasicTarget } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { getTargetElement } from '@/lib/utils'
import { useEvent } from './useEvent'
import { useResizeObserver } from './useResizeObserver'

export type UseElementBounding = (
  target: BasicTarget<Element>,
  options?: UseElementBoundingOptions
) => UseElementBoundingReturn

export interface UseElementBoundingOptions {
  reset?: boolean
  windowResize?: boolean
  windowScroll?: boolean
  immediate?: boolean
}

export interface UseElementBoundingReturn {
  readonly height: number
  readonly bottom: number
  readonly left: number
  readonly right: number
  readonly top: number
  readonly width: number
  readonly x: number
  readonly y: number
  readonly update: () => void
}

export const useElementBounding: UseElementBounding = (
  target,
  options: UseElementBoundingOptions = {},
): UseElementBoundingReturn => {
  const {
    reset = true,
    windowResize = true,
    windowScroll = true,
    immediate = true,
  } = options

  const [height, setHeight] = useState(0)
  const [bottom, setBottom] = useState(0)
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [top, setTop] = useState(0)
  const [width, setWidth] = useState(0)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const update = useEvent(() => {
    const element = getTargetElement(target)

    if (!element) {
      if (reset) {
        setHeight(0)
        setBottom(0)
        setLeft(0)
        setRight(0)
        setTop(0)
        setWidth(0)
        setX(0)
        setY(0)
      }
      return
    }

    const rect = element.getBoundingClientRect()
    setHeight(rect.height)
    setBottom(rect.bottom)
    setLeft(rect.left)
    setRight(rect.right)
    setTop(rect.top)
    setWidth(rect.width)
    setX(rect.x)
    setY(rect.y)
  })

  useResizeObserver(target, update)

  useEffect(() => {
    if (immediate) {
      update()
    }
  }, [immediate, update])

  useEffect(() => {
    if (windowScroll) {
      window.addEventListener('scroll', update, { passive: true })
    }
    if (windowResize) {
      window.addEventListener('resize', update, { passive: true })
    }

    return () => {
      if (windowScroll) {
        window.removeEventListener('scroll', update)
      }
      if (windowResize) {
        window.removeEventListener('resize', update)
      }
    }
  }, [update, windowResize, windowScroll])

  return {
    height,
    bottom,
    left,
    right,
    top,
    width,
    x,
    y,
    update,
  } as const
}
