import type { Fn } from './types'
import { dataUrlReg } from './reg'

export function isFunction<T extends Fn>(val: any): val is T {
  return typeof val === 'function'
}

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null
}

export function isDataUrl(dataUrl: string): boolean {
  return !!dataUrl.match(dataUrlReg)
}

export function noop() { }
export const emptyObject = {}

export const isBrowser = typeof window !== 'undefined'
export const isNavigator = typeof navigator !== 'undefined'
