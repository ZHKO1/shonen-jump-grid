import type { FocusChangeBackgroundType, FocusMoveType, GridConfig, PageConfig } from './type'
import gsap from 'gsap'
import { Container, Graphics } from 'pixi.js'
import { GridBackground, GridFocusedBackground, GridLineWidth, LogoDefaultCenterX, LogoDefaultCenterY, LogoDefaultHeight, LogoDefaultWidth, Width } from './config'
import { Grid } from './grid'
import { Logo } from './logo'

export class Page extends Container {
  config: PageConfig
  focus?: {
    grid: Grid
    type: FocusMoveType | FocusChangeBackgroundType
  }

  timeline: gsap.core.Timeline = gsap.timeline()
  pageHeight: number = 0
  whiteOverlay: Graphics = new Graphics()
  constructor(pageConfig: PageConfig) {
    super()
    this.config = pageConfig
    this.init()
  }

  init() {
    const gridConfigs = this.config.grids
    for (let j = 0; j < gridConfigs.length; j++) {
      const gridConfig = gridConfigs[j]
      this.addGrid(gridConfig, gridConfig.content && gridConfig.content.focus)
    }
  }

  addGrid(config: GridConfig, focus?: FocusMoveType | FocusChangeBackgroundType) {
    const grid = new Grid(config)
    this.addChild(grid)
    this.pageHeight = Math.max(this.pageHeight, grid.getMaxY())
    if (focus) {
      this.focus = { grid, type: focus }
      this.focus.grid.zIndex = 2
      switch (this.focus.type.type) {
        case 'move':
          this.focus.grid.updateBackground(GridFocusedBackground)
          break
        default:
          break
      }
    }
  }

  initTimeLine() {
    const timeline = this.timeline
    timeline.addLabel('pagestart')
    timeline.addLabel('pageshock', 0.2)

    // 焦点格移动
    if (this.focus) {
      if (this.focus.type.type === 'move') {
        let x = 0
        if (this.focus.type.direction === 'left-to-right') {
          x = -1 * (this.focus.grid.getWidth() + GridLineWidth)
        }
        else if (this.focus.type.direction === 'right-to-left') {
          x = Width
        }
        timeline.from(this.focus.grid, { duration: 0.2, x }, 'pagestart')
      }
    }

    timeline.to(this.whiteOverlay, { duration: 0.1, alpha: 1 }, 'pagestart')
    timeline.to(this.whiteOverlay, { duration: 0.1, alpha: 0 }, 'pagestart+=0.15')
    timeline.to(this, { duration: 1.07 })

    // 震屏效果
    const origin_x = this.x
    const origin_y = this.y
    timeline.to(this, { duration: 0.03, x: origin_x + -8 }, 'pageshock-=0.03')
    timeline.to(this, { duration: 0.03, y: origin_y + 7 }, 'pageshock-=0.03')
    timeline.to(this, { duration: 0.03, x: origin_x + 12 }, 'pageshock')
    timeline.to(this, { duration: 0.03, y: origin_y + -10 }, 'pageshock')
    timeline.to(this, { duration: 0.05, x: origin_x, y: origin_y }, 'pageshock+=0.03')

    // 取消焦点Gird的背景颜色
    if (this.focus && (this.focus.type.type === 'move')) {
      timeline.call(() => {
        this.focus!.grid.updateBackground(GridBackground)
      })
    }

    // 最终页面焦点格子 颜色变成彩色
    if (this.focus) {
      if (this.focus.type.type === 'change-background') {
        const focusUrl = this.focus.type.focusUrl
        if (focusUrl) {
          timeline.call(() => {
            this.focus!.grid.updateContent(focusUrl)
          }, [], 'pagestart+=0.15')
        }
      }
    }
  }
}

export class LogoPage extends Page {
  logo: Logo
  constructor(pageConfig: PageConfig) {
    super(pageConfig)
    const { url, centerX = LogoDefaultCenterX, centerY = LogoDefaultCenterY, width = LogoDefaultWidth, height = LogoDefaultHeight } = pageConfig.logo!
    this.logo = new Logo(url, width, height)
    this.logo.x = centerX
    this.logo.y = centerY
    this.logo.alpha = 0
    this.logo.zIndex = 2
    this.addChild(this.logo)
  }

  addGrid(config: GridConfig) {
    const grid = new Grid(config)
    this.addChild(grid)
    this.pageHeight = Math.max(this.pageHeight, grid.getMaxY())
  }

  initTimeLine() {
    const timeline = this.timeline
    timeline.to(this.logo, { duration: 1.2 })
    timeline.set(this.logo, { alpha: 1 })
    timeline.set(this.logo.scale, { x: 2, y: 2 })
    timeline.to(this.logo.scale, { duration: 0.3, x: 1, y: 1 })
    timeline.to(this.logo, { duration: 1 })
    timeline.to(this.logo.scale, { duration: 0.1, x: 3, y: 3 })
    timeline.set(this.logo, { alpha: 0 })
  }
}
