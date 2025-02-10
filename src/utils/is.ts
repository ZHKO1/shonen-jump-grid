import type { Fn } from "./type"

export function isFunction<T extends Fn>(val: any): val is T {
    return typeof val === "function"
}

export const isBrowser = typeof window !== 'undefined'
export const isNavigator = typeof navigator !== 'undefined'