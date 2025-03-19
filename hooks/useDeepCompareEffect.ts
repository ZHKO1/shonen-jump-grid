import type { DependencyList, EffectCallback } from 'react'
import { isEqual } from 'lodash-es'
import { useCustomCompareEffect } from './useCustomCompareEffect'

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList,
): void {
  useCustomCompareEffect(effect, deps, isEqual)
}
