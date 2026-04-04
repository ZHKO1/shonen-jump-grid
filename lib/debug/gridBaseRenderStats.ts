import type { GridId } from '@/components/canvas/types'

declare global {
  interface Window {
    __gridBaseRenderStats?: Record<string, number>
    __getGridBaseRenderStats?: () => Array<{ gridId: string, renders: number }>
    __resetGridBaseRenderStats?: () => void
  }
}

function ensureGridBaseRenderStats() {
  if (!import.meta.env.DEV || typeof window === 'undefined') {
    return null
  }

  if (!window.__gridBaseRenderStats) {
    window.__gridBaseRenderStats = {}
  }

  if (!window.__getGridBaseRenderStats) {
    window.__getGridBaseRenderStats = () => {
      return Object.entries(window.__gridBaseRenderStats || {})
        .map(([gridId, renders]) => ({ gridId, renders }))
        .sort((a, b) => b.renders - a.renders || a.gridId.localeCompare(b.gridId))
    }
  }

  if (!window.__resetGridBaseRenderStats) {
    window.__resetGridBaseRenderStats = () => {
      window.__gridBaseRenderStats = {}
    }
  }

  return window.__gridBaseRenderStats
}

export function trackGridBaseRender(gridId: GridId) {
  const stats = ensureGridBaseRenderStats()
  if (!stats) {
    return
  }

  const key = String(gridId)
  stats[key] = (stats[key] || 0) + 1
}
