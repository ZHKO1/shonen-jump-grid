import { isEqual } from 'lodash-es'
import { DependencyList, EffectCallback, useEffect, useRef } from "react";
import { useCustomCompareEffect } from "./useCustomCompareEffect";

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList,
): void {
  useCustomCompareEffect(effect, deps, isEqual);
}
