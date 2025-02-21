import { useCallback, useRef } from 'react'
import { useLatest } from './useLatest'
import { useDeepCompareEffect } from './useDeepCompareEffect'
import { BasicTarget, getTargetElement } from '../lib/domTarget'

type UseResizeObserver = (
    target: BasicTarget<Element>,
    callback: ResizeObserverCallback,
    options?: ResizeObserverOptions
) => () => void

export const useResizeObserver: UseResizeObserver = (
    target,
    callback: ResizeObserverCallback,
    options: ResizeObserverOptions = {},
): () => void => {
    const savedCallback = useLatest(callback)
    const observerRef = useRef<ResizeObserver>(null)

    const stop = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect()
        }
    }, [])
    useDeepCompareEffect(() => {
        const element = getTargetElement(target)
        if (!element) {
            return
        }
        observerRef.current = new ResizeObserver(savedCallback.current)
        observerRef.current.observe(element, options)

        return stop
    }, [savedCallback, stop, target, options])

    return stop
}
