import { BasicTarget, getTargetElement } from "../lib";
import { defaultDocument, /*defaultWindow,*/ off, on } from "../lib/browser";
import { useDeepCompareEffect } from "./useDeepCompareEffect";
import { useLatest } from "./useLatest";

export type Target = BasicTarget<HTMLElement | Element | Window | Document | EventTarget>

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window,
  options?: boolean | AddEventListenerOptions
): void

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions
): void

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: T,
  options?: boolean | AddEventListenerOptions
): void

export function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (event: ElementEventMap[K]) => void,
  element: Element,
  options?: boolean | AddEventListenerOptions
): void

export function useEventListener<K = Event>(
  eventName: string,
  handler: (event: K) => void,
  element: EventTarget | null | undefined,
  options?:
    | AddEventListenerOptions
): void

export function useEventListener(
  eventName: string,
  handler: (...p: any) => void,
  element: Target,
  options?: boolean | AddEventListenerOptions
): void

export function useEventListener(
  eventName: string,
  handler: (...p: any) => void,
  element: Target,
  options: boolean | AddEventListenerOptions = {}
): void {
  const savedHandler = useLatest(handler);

  useDeepCompareEffect(() => {
    const targetElement = getTargetElement(element);
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const eventListener: typeof handler = event =>
      savedHandler.current(event)

    on(targetElement, eventName, eventListener, options)

    return () => {
      if (!(targetElement && targetElement.removeEventListener)) {
        return
      }
      off(targetElement, eventName, eventListener, options)
    }

  }, [eventName, element, options]);
}
