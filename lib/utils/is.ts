import type { Fn } from './types'

export function isFunction<T extends Fn>(val: any): val is T {
  return typeof val === 'function'
}

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null
}

export function noop() { }
export const emptyObject = {}

export const isBrowser = typeof window !== 'undefined'
export const isNavigator = typeof navigator !== 'undefined'
