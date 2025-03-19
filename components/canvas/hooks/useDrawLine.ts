import type { Point } from '../types'
import { useContext, useEffect, useRef, useState } from 'react'
import { ContainerContext } from '@/components/canvas/context/container'
import { useLatest } from '@/hooks/useLatest'
import { defaultDocument, off, on } from '@/lib/utils'
import { getAdjustedPoint } from '../utils'
import { useMouse } from './useMouse'

interface DrawState {
  isDrawing: boolean
  start: Point | null
  end: Point | null
}

export function useDrawLine(isFocused: boolean) {
  const { current: container } = useContext(ContainerContext).container
  const mouseStateRef = useMouse()
  const mouseDownTimeRef = useRef<number>(0)
  const [drawState, setDrawState] = useState<DrawState>({
    isDrawing: false,
    start: null,
    end: null,
  })
  const latestDrawState = useLatest(drawState)

  const checkTimeElapsed = () => {
    if (mouseDownTimeRef.current) {
      if (Date.now() - mouseDownTimeRef.current > 150) {
        return true
      }
    }
    return false
  }

  useEffect(() => {
    if (!isFocused) {
      mouseDownTimeRef.current = 0
      setDrawState({ isDrawing: false, start: null, end: null })
      return
    }

    const handleMouseMove = () => {
      const { start, isDrawing } = latestDrawState.current
      if (!isDrawing || !start)
        return

      if (!checkTimeElapsed()) {
        return
      }

      const newEnd = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY,
      }

      setDrawState(prev => ({
        ...prev,
        end: getAdjustedPoint(prev.start!, newEnd, { direction: 'end' }),
      }))
    }

    const handleMouseUp = () => {
      const { start, isDrawing } = latestDrawState.current
      if (!isDrawing || !start)
        return

      if (!checkTimeElapsed()) {
        mouseDownTimeRef.current = 0
        setDrawState({ isDrawing: false, start: null, end: null })
        return
      }

      const newEnd = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY,
      }

      // 检查是否为无效线（起点终点相同）
      if (start.x === newEnd.x
        && start.y === newEnd.y) {
        setDrawState({ isDrawing: false, start: null, end: null })
      }
      else {
        setDrawState(prev => ({
          ...prev,
          end: getAdjustedPoint(prev.start!, newEnd, { direction: 'end' }),
          isDrawing: false,
        }))
      }
      mouseDownTimeRef.current = 0
      off(defaultDocument, 'mousemove', handleMouseMove)
      off(defaultDocument, 'mouseup', handleMouseUp)
    }

    const handleMouseDown = () => {
      mouseDownTimeRef.current = Date.now()
      const start = {
        x: mouseStateRef.current.elementX,
        y: mouseStateRef.current.elementY,
      }
      setDrawState({ isDrawing: true, start, end: null })

      on(defaultDocument, 'mousemove', handleMouseMove)
      on(defaultDocument, 'mouseup', handleMouseUp)
    }

    on(container, 'mousedown', handleMouseDown)

    return () => {
      off(container, 'mousedown', handleMouseDown)
      // off(defaultDocument, "mousemove", handleMouseMove); // 不确定这样是否合适，所以先注释
      // off(defaultDocument, "mouseup", handleMouseUp); // 不确定这样是否合适，所以先注释
    }
  }, [isFocused, container, latestDrawState, mouseStateRef])

  return [drawState.start, drawState.end, drawState.isDrawing] as const
}
