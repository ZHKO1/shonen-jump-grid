import { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react";
import { BasicTarget, getTargetElement, Position } from "../utils";
import { useEventListener } from "./useEventListener";

interface useDraggableOptions {
  preventDefault?: boolean,
  stopPropagation?: boolean,
  draggingElement?: BasicTarget<HTMLElement | SVGElement>,
  containerElement?: BasicTarget<HTMLElement | SVGAElement>,
  handle?: RefObject<HTMLElement | SVGElement>,
  initialValue?: Position,
  onStart?: (position: Position, event: PointerEvent) => void | false,
  onMove?: (position: Position, event: PointerEvent) => void,
  onEnd?: (position: Position, event: PointerEvent) => void
}

function isScrollX(node: Element | null) {
  if (!node) {
    return false
  }

  return (
    getComputedStyle(node).overflowX === 'auto'
    || getComputedStyle(node).overflowX === 'scroll'
  )
}

function isScrollY(node: Element | null) {
  if (!node) {
    return false
  }

  return (
    getComputedStyle(node).overflowY === 'auto'
    || getComputedStyle(node).overflowY === 'scroll'
  )
}

export const useDraggable = (target: BasicTarget<HTMLDivElement | SVGElement>, options: useDraggableOptions = {})
  : readonly [number, number, boolean, Dispatch<SetStateAction<Position>>] => {
  const { draggingElement, containerElement } = options;
  const draggingHandle = options.handle ?? target

  const [position, setPositon] = useState<Position>(
    options.initialValue ?? { x: 0, y: 0 },
  )

  let { x = 0, y = 0 } = options.initialValue || {};

  useEffect(() => {
    setPositon({ x, y })
  }, [x, y])

  const [pressedDelta, setPressedDelta] = useState<Position>();

  const handleEvent = (e: PointerEvent) => {
    if (options.preventDefault) {
      e.preventDefault()
    }
    if (options.stopPropagation) {
      e.stopPropagation()
      // 经测试发现虽然已有stopPropagation了，但那似乎只针对pointerup相关事件的传播，依然还会触发document对click的监听
      // 所以这里补充对于click传播的处理
      // TODO 感觉就很不优雅，但没什么好的办法
      if (e.type === 'pointerup') {
        const clickHandler = (ev: MouseEvent) => {
          ev.stopPropagation();
          document.removeEventListener('click', clickHandler, true);
        };
        document.addEventListener('click', clickHandler, { capture: true, once: true });
      }
    }
  }

  const start = (e: PointerEvent) => {
    const element = getTargetElement(target)
    if (!element) {
      return
    }
    const container = getTargetElement(containerElement)
    const containerRect = container?.getBoundingClientRect?.()
    const targetRect = element.getBoundingClientRect()

    const pos = {
      x:
        e.clientX
        - (container && containerRect
          ? targetRect.left - containerRect?.left + container.scrollLeft
          : targetRect.left),
      y:
        e.clientY
        - (container && containerRect
          ? targetRect.top - containerRect.top + container.scrollTop
          : targetRect.top),
    }
    if (options.onStart?.(pos, e) === false) {
      return
    }
    setPressedDelta(pos)
    handleEvent(e)
  }

  const updatePosition = (e: PointerEvent) => {
    const element = getTargetElement(target)
    if (!element) {
      return false
    }
    if (!pressedDelta) {
      return false
    }
    const container = getTargetElement(containerElement)
    const targetRect = element.getBoundingClientRect()
    let { x, y } = position
    x = e.clientX - pressedDelta.x
    y = e.clientY - pressedDelta.y
    if (container) {
      const containerWidth = isScrollX(container)
        ? container.scrollWidth
        : container.clientWidth
      const containerHeight = isScrollY(container)
        ? container.scrollHeight
        : container.clientHeight
      x = Math.min(Math.max(0, x), containerWidth - targetRect.width)
      y = Math.min(Math.max(0, y), containerHeight - targetRect.height)
    }

    setPositon({
      x,
      y,
    })
    return true;
  }

  const move = (e: PointerEvent) => {
    if (!updatePosition(e)) {
      return
    }
    options.onMove?.(position, e)
    handleEvent(e)
  }

  const end = (e: PointerEvent) => {
    if (!updatePosition(e)) {
      return
    }
    setPressedDelta(undefined)
    options.onEnd?.(position, e)
    handleEvent(e)
  }

  useEventListener('pointerdown', start, draggingHandle, true)
  useEventListener('pointermove', move, draggingElement, true)
  useEventListener('pointerup', end, draggingElement, true)

  return [position.x, position.y, !!pressedDelta, setPositon] as const
}