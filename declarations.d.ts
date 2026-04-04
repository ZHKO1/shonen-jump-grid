declare module '*.css' {
  const content: string
  export default content
}

declare module 'normalize-wheel' {
  const normalizeWheel: (
    event: WheelEvent
  ) => { spinX: number, spinY: number, pixelX: number, pixelY: number }
  export default normalizeWheel
}

interface Window {
  __gridBaseRenderStats?: Record<string, number>
  __getGridBaseRenderStats?: () => Array<{ gridId: string, renders: number }>
  __resetGridBaseRenderStats?: () => void
}
