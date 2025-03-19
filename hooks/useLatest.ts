import type { MutableRefObject } from 'react'
import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export type UseLatest = <T>(
  value: T
) => MutableRefObject<T>

export const useLatest: UseLatest = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef(value)
  useIsomorphicLayoutEffect(() => {
    ref.current = value
  }, [value])
  return ref
}
