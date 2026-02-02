import type { CanvasComicConfig, CanvasGridConfig, CanvasPageConfig, PageId } from './types'
import type { ComicConfig, GridConfig, PageConfig, PolyGridConfig, RectGridConfig } from '@/components/comic/core/type'
import { uploadImage } from '@/api'
import { dataURLtoBlob, deepCopy, isDataUrl } from '@/lib/utils'
import { getAutoFlushedGridConfig, isGridSplited } from './grid'

/**
 * 从配置里获取指定的page
 * @param {CanvasComicConfig} comicConfig
 * @param {PageId} targetId
 * @returns {CanvasPageConfig | null}
 */
export function getPageFromComicConfig(comicConfig: CanvasComicConfig, targetId: PageId): CanvasPageConfig | null {
  if (!comicConfig || !comicConfig.pages) {
    return null
  }
  for (let i = 0; i < comicConfig.pages.length; i++) {
    const page = comicConfig.pages[i]
    if (page.id === targetId) {
      return page
    }
  }
  return null
}

/**
 * 将canvas的配置转化为comic的配置
 * @param {CanvasComicConfig} canvasComicConfig
 * @returns {ComicConfig | null}
 */
export function getComicConfigFromCanvas(canvasComicConfig: CanvasComicConfig): ComicConfig | null {
  if (!canvasComicConfig) {
    return null
  }
  const result = {
    pages: [],
  } as ComicConfig
  for (let i = 0; i < canvasComicConfig.pages.length; i++) {
    const canvasPageConfig = canvasComicConfig.pages[i]
    const pageConfig = {
      height: canvasPageConfig.height,
      logo: canvasPageConfig.logo,
      grids: [],
    } as PageConfig
    pageConfig.logo = canvasPageConfig.logo
    for (let j = 0; j < canvasPageConfig.grids.length; j++) {
      const canvasGrid = canvasPageConfig.grids[j]
      getAllGridConfig(canvasGrid, pageConfig.grids)
    }
    result.pages.push(pageConfig)
  }
  return result

  function getAllGridConfig(canvasGrid: CanvasGridConfig, allGrids: GridConfig[]) {
    if (isGridSplited(canvasGrid)) {
      for (let i = 0; i < canvasGrid.splitResult!.length; i++) {
        const grid_ = canvasGrid.splitResult![i]
        getAllGridConfig(grid_, allGrids)
      }
    }
    else {
      let grid = {} as GridConfig
      const config = getAutoFlushedGridConfig(canvasGrid)
      if (config.type === 'rect') {
        grid = {
          type: 'rect',
          lt_x: config.lt_x,
          lt_y: config.lt_y,
          rb_x: config.rb_x,
          rb_y: config.rb_y,
        } as RectGridConfig
      }
      else {
        grid = {
          type: 'poly',
          path: config.path,
        } as PolyGridConfig
      }
      if (config.content) {
        grid.content = {
          url: config.content.url,
          focus: config.content.focus,
        }
      }
      allGrids.push(grid)
    }
  }
}

/**
 * 将canvas的配置转化为可分享的canvas配置
 * 1. 如果content.url是dataUrl，就上传到图床并更新content.url字段
 * 2. 删去无关字段，比如originImg
 * @param {CanvasComicConfig} canvasComicConfig
 * @returns {CanvasComicConfig}
 */
export async function getShareCanvasConfig(canvasComicConfig: CanvasComicConfig): Promise<CanvasComicConfig> {
  if (!canvasComicConfig) {
    throw new Error('canvasComicConfig is null')
  }
  const promiseArray = []
  const result = deepCopy(canvasComicConfig)
  for (let i = 0; i < result.pages.length; i++) {
    const canvasPageConfig = result.pages[i]
    if (canvasPageConfig.logo) {
      if (isDataUrl(canvasPageConfig.logo.url)) {
        promiseArray.push(dataUrlToProxy(canvasPageConfig.logo.url).then((url) => {
          canvasPageConfig.logo!.url = url
        }))
      }
      if (canvasPageConfig?.logo?.originImg) {
        delete canvasPageConfig?.logo?.originImg
      }
    }
    for (let j = 0; j < canvasPageConfig.grids.length; j++) {
      const canvasGrid = canvasPageConfig.grids[j]
      checkGridConfig(canvasGrid)
    }
  }
  await Promise.all(promiseArray)
  return result

  function checkGridConfig(canvasGrid: CanvasGridConfig) {
    if (isGridSplited(canvasGrid)) {
      for (let i = 0; i < canvasGrid.splitResult!.length; i++) {
        const grid_ = canvasGrid.splitResult![i]
        checkGridConfig(grid_)
      }
    }
    else {
      if (canvasGrid?.content?.url) {
        if (isDataUrl(canvasGrid?.content?.url)) {
          promiseArray.push(dataUrlToProxy(canvasGrid.content.url).then((url) => {
            canvasGrid.content!.url = url
          }))
        }
        if (canvasGrid?.content?.originImg) {
          delete canvasGrid.content.originImg
        }
      }
    }
  }

  async function dataUrlToProxy(dataUrl: string) {
    const blob = dataURLtoBlob(dataUrl)
    const url = await uploadImage(blob)
    return url.replace(import.meta.env.PUBLIC_API_UPLOAD, '/proxy')
  }
}

/**
 * 判断是否logo-page
 * @param {CanvasPageConfig} page
 * @returns {boolean}
 */
export function getIsLogoPage(page: CanvasPageConfig) {
  return page.id === 'page0' && page?.logo
}
