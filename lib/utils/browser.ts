import type { Fn } from './types'
import { isBrowser } from './is'

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null | undefined,
  ...args: Parameters<T['addEventListener']> | [string, Fn | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>))
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null | undefined,
  ...args: Parameters<T['removeEventListener']> | [string, Fn | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>))
  }
}

export const defaultWindow = isBrowser ? window : undefined
export const defaultDocument = isBrowser ? document : undefined
