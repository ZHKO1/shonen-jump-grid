import type { Graphics } from 'pixi.js'
import type { ComicConfig } from './type'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'
import PixiPlugin from 'gsap/PixiPlugin'
import { Application, Assets, Container } from 'pixi.js'
import { deepCopy } from '@/lib/utils'
import { Height, PageBackGround, PageMargin, Width } from './config'
import { getOverlay } from './overlay'
import { LogoPage, Page } from './page'
import { getComicGridImage } from './util'

gsap.registerPlugin(PixiPlugin, CustomEase)
CustomEase.create('logoPageScroll', '.24,.83,.6,1')
CustomEase.create('pageScroll', '.24,.94,.65,.94')

export class Comic {
  private comicConfig: ComicConfig = { pages: [] }
  private comicStage: Container = new Container()
  private timeline: gsap.core.Timeline = gsap.timeline()
  private blackOverlay: Graphics = getOverlay(0x00)
  private whiteOverlay: Graphics = getOverlay(0xFFFFFF)
  private app: Application = new Application()
  private container: HTMLElement = document.createElement('div')
  public async init(comicConfig: ComicConfig, container: HTMLElement) {
    this.comicConfig = deepCopy(comicConfig)
    this.container = container
    await this.app.init(
      {
        width: Width,
        height: Height,
        bezierSmoothness: 1,
        preference: 'webgpu',
        autoDensity: true,
        resolution: 1,
        background: PageBackGround,
      },
    )
    this.app.stage.addChild(this.blackOverlay)
    this.container.appendChild(this.app.canvas)
    this.app.stage.addChild(this.comicStage)

    this.app.stage.addChild(this.whiteOverlay)

    this.blackOverlay.alpha = 1
    this.downloadScreenshot = this.downloadScreenshot.bind(this)
    await this.loadAsset()
    this.initPages()
    this.initTimeline()
    this.handleEvent()
  }

  private async loadAsset() {
    const promiseArray = []
    const pageConfigs = this.comicConfig.pages || []
    for (let i = 0; i < pageConfigs.length; i++) {
      const pageConfig = pageConfigs[i]
      if (pageConfig.logo) {
        promiseArray.push(Assets.load(pageConfig.logo!.url))
      }
      const gridConfigs = pageConfig.grids
      for (let j = 0; j < gridConfigs.length; j++) {
        const gridConfig = gridConfigs[j]
        if (gridConfig.content) {
          const contentCopy = deepCopy(gridConfig.content)
          promiseArray.push((async () => {
            gridConfig.content!.url = await getComicGridImage(contentCopy)
            await Assets.load(gridConfig.content!.url)
            const focus = gridConfig.content?.focus
            if (focus) {
              if (focus.type === 'change-background') {
                focus.focusUrl = await getComicGridImage(contentCopy, [])
                await Assets.load(focus.focusUrl!)
                gridConfig.content!.url = await getComicGridImage(contentCopy, ['gray', 'white-transparent'])
                await Assets.load(gridConfig.content!.url)
              }
            }
          })())
        }
      }
    }
    await Promise.all(promiseArray)
  }

  private initPages() {
    const pageConfigs = this.comicConfig.pages || []
    let prePageY = Height
    for (let i = 0; i < pageConfigs.length; i++) {
      const pageConfig = pageConfigs[i]
      let page
      if (pageConfig.logo) {
        page = new LogoPage(pageConfig)
      }
      else {
        page = new Page(pageConfig)
      }
      page.x = 0
      page.whiteOverlay = this.whiteOverlay
      if (pageConfig.height) {
        page.y = prePageY - pageConfig.height
      }
      else {
        page.y = prePageY - page.pageHeight - PageMargin
      }
      prePageY = page.y
      this.comicStage.addChild(page)
    }
  }

  private initTimeline() {
    const tl = this.timeline
    tl.pause()
    tl.clear()

    tl.to(this.blackOverlay, { duration: 0 })
    tl.to(this.blackOverlay, { duration: 0.3, alpha: 0 })

    const logoPage = this.comicStage.children[0] as LogoPage
    logoPage.initTimeLine()
    tl.add(logoPage.timeline)

    for (let i = 1; i < this.comicStage.children.length; i++) {
      const prePage = this.comicStage.children[i - 1] as Page
      const page = this.comicStage.children[i] as Page
      if (i === 1) {
        tl.to(this.comicStage, { ease: 'logoPageScroll', duration: 0.75, y: -page.y })
      }
      else {
        tl.to(this.comicStage, { duration: 0.5, y: (-prePage.y + 20) }, '-=0.5')
        tl.to(this.comicStage, { ease: 'pageScroll', duration: 0.73, y: -page.y })
      }
      page.initTimeLine()
      tl.add(page.timeline)
    }
  }

  public replay() {
    this.pause()
    this.blackOverlay.alpha = 1
    this.comicStage.y = 0
    this.comicStage.removeChildren()
    this.initPages()
    this.initTimeline()
    this.handleEvent()
    this.play()
  }

  public play() {
    this.timeline.play()
  }

  public pause() {
    this.timeline.pause()
  }

  public setCurrentTime(time: number) {
    this.timeline.seek(time)
    this.timeline.pause()
  }

  public destory() {
    this.removeEvent()
    this.container.removeChild(this.app.canvas)
    this.app.destroy()
  }

  public handleEvent() {
    this.app.canvas.addEventListener('click', this.downloadScreenshot)
  }

  public removeEvent() {
    this.app.canvas.removeEventListener('click', this.downloadScreenshot)
  }

  public downloadScreenshot() {
    const bloburl = this.app.canvas.toDataURL('image/jpeg', 1.0)
    const anchor = document.createElement('a')
    if ('download' in anchor) {
      anchor.style.visibility = 'hidden'
      anchor.href = bloburl
      anchor.download = 'canvas_image.png'
      document.body.appendChild(anchor)
      const evt = document.createEvent('MouseEvents')
      evt.initEvent('click', true, true)
      anchor.dispatchEvent(evt)
      document.body.removeChild(anchor)
    }
    else {
      location.href = bloburl
    }
  }
}
