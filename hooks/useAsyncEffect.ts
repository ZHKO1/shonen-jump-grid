import type { DependencyList } from 'react'
import { useEffect } from 'react'
import { useMountedState } from './useMountedState'
import { noop } from '@/lib/utils'

type UseAsyncEffect = <T>(
  effect: () => Promise<T> | T,
  cleanup?: typeof effect,
  deps?: DependencyList
) => void

export const useAsyncEffect: UseAsyncEffect = <T>(
  effect: () => Promise<T> | T,
  cleanup: typeof effect = <any>noop,
  deps?: DependencyList,
) => {
  const mounted = useMountedState()
  useEffect(() => {
    const execute = async () => {
      if (!mounted()) {
        return
      }
      await effect()
    }

    execute()

    return () => {
      cleanup()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
