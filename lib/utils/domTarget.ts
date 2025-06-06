import type { RefObject } from 'react'
import { isBrowser, isFunction } from './is'

type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document | EventTarget

export type BasicTarget<T extends TargetType = Element> =
    | (() => TargetValue<T>)
    | TargetValue<T>
    | RefObject<TargetValue<T>>

export function getTargetElement<T extends TargetType>(
  target: BasicTarget<T>,
  defaultElement?: T,
) {
  if (!isBrowser) {
    return undefined
  }
  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (isFunction(target)) {
    targetElement = target()
  }
  else if ('current' in target) {
    targetElement = target.current
  }
  else {
    targetElement = target
  }

  return targetElement
}
