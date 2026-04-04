import type { GridId } from '@/components/canvas/types'

interface GridBaseRenderStat { renders: number, commits: number }
type GridBaseRenderStats = Record<string, GridBaseRenderStat>
interface GridBaseRenderStatEntry { gridId: string, renders: number, commits: number }

declare global {
  interface Window {
    __gridBaseRenderStats?: GridBaseRenderStats
    __getGridBaseRenderStats?: () => GridBaseRenderStatEntry[]
    __resetGridBaseRenderStats?: () => void
  }
}

function getGridBaseRenderStats() {
  if (!import.meta.env.DEV || typeof window === 'undefined') {
    return null
  }

  if (!window.__gridBaseRenderStats) {
    window.__gridBaseRenderStats = {}
    window.__getGridBaseRenderStats = () => {
      return Object.entries(window.__gridBaseRenderStats || {})
        .map(([gridId, stats]) => ({ gridId, ...stats }))
    }
    window.__resetGridBaseRenderStats = () => {
      window.__gridBaseRenderStats = {}
    }
  }

  return window.__gridBaseRenderStats
}

function bumpGridBaseRenderStat(gridId: GridId, key: keyof GridBaseRenderStat) {
  const stats = getGridBaseRenderStats()
  if (!stats) {
    return
  }

  const gridKey = String(gridId)
  if (!stats[gridKey]) {
    stats[gridKey] = { renders: 0, commits: 0 }
  }
  stats[gridKey][key] += 1
}

export function trackGridBaseRender(gridId: GridId) {
  bumpGridBaseRenderStat(gridId, 'renders')
}

export function trackGridBaseCommit(gridId: GridId) {
  bumpGridBaseRenderStat(gridId, 'commits')
}
