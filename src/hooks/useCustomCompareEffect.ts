import { DependencyList, EffectCallback, useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { useUpdate } from "./useUpdate";

type DepsEqualFnType<TDeps extends DependencyList> = (prevDeps: TDeps, nextDeps: TDeps) => boolean

export function useCustomCompareEffect<TDeps extends DependencyList>(
  effect: EffectCallback,
  deps: TDeps,
  depsEqual: DepsEqualFnType<TDeps>
) {
  const depsRef = useRef<TDeps>(deps);
  const forceUpdate = useUpdate();

  useIsomorphicLayoutEffect(() => {
    if (!depsEqual(depsRef.current, deps)) {
      depsRef.current = deps;
      forceUpdate();
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, depsRef.current);
}
