import { useEffect, useLayoutEffect } from 'react'
import { isBrowser } from '../lib/index'

export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect
