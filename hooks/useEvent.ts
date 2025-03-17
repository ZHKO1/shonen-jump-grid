import { useCallback, useRef } from 'react'
import type { Fn } from '../lib/utils'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

type UseEvent = <T extends Fn>(
  fn: T
) => T

type PickFunction<T extends Fn> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>

/**
 * keep function reference immutable
 */
export const useEvent: UseEvent = <T extends Fn>(fn: T) => {
  const handlerRef = useRef(fn)
  useIsomorphicLayoutEffect(() => {
    handlerRef.current = fn
  }, [fn])
  return useCallback<PickFunction<T>>((...args) => {
    const fn = handlerRef.current
    return fn(...args)
  }, []) as T
}
