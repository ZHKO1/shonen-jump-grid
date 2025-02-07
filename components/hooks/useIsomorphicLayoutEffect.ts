import { useEffect, useLayoutEffect } from 'react'
import { isBrowser } from '../utils/index'

export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect
