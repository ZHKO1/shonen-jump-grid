'use client'
import type { RefObject } from 'react'
import { createContext } from 'react'

export const ContainerContext = createContext<{ container: RefObject<HTMLDivElement | null>, scale: number }>({ container: { current: null }, scale: 1 })
