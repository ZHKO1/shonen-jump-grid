import { Graphics, Container, Sprite, type ColorSource } from "pixi.js";
import { GridLineWidth, GridLineColor, GridBackground } from './config'
import { GridConfig } from "./type";

export class Grid extends Container {
  config: GridConfig;
  mask: Graphics = new Graphics();
  content: Container = new Container();
  constructor(config: GridConfig) {
    super();
    this.config = config;
    this.init();
    this.rendBackground();
    this.rendContent();
    this.rendBorder();
  }
  init() {
    const config = this.config;
    if (config.type == 'rect') {
      this.x = config.lt_x;
      this.y = config.lt_y;
    } else {
      this.x = config.path[0].x;
      this.y = config.path[0].y;
    }
  }
  rendBackground() {
    const bgColor = GridBackground;
    this.updateBackground(bgColor);
    this.addChild(this.mask);
  }
  updateBackground(bgColor: ColorSource) {
    this.mask.clear();
    this.drawGraphics(this.mask).fill({ color: bgColor });
  }
  rendContent() {
    const config = this.config;
    if (!config.content) {
      return;
    }
    this.updateContent(config.content.url);
  }
  updateContent(url: string) {
    const config = this.config;
    if (!config.content) {
      return;
    }
    this.content.removeFromParent();
    const container = new Container();
    this.addChild(container);
    const image = Sprite.from(url);
    const gridWidth = this.getWidth();
    image.scale = (gridWidth / image.width);
    image.x = 0;
    image.y = 0;
    if (config.type == 'poly') {
      image.x = Math.min.apply(null, config.path.map((item) => item.x - this.x));
      image.y = Math.min.apply(null, config.path.map((item) => item.y - this.y));
    }
    container.addChild(image);
    image.anchor.set(0);
    const mask = new Graphics();
    this.drawGraphics(mask).fill();
    container.addChild(mask);
    container.mask = mask;
    this.content = container;
  }
  rendBorder() {
    const boder = new Graphics();
    boder.zIndex = 2;
    this.addChild(boder);
    this.drawGraphics(boder);
    boder.stroke({ width: GridLineWidth, color: GridLineColor });
  }
  drawGraphics(context: Graphics) {
    const config = this.config;
    if (config.type == 'rect') {
      const width = config.rb_x - config.lt_x;
      const height = config.rb_y - config.lt_y;
      context.rect(0, 0, width, height)
    } else {
      context.poly(config.path.map((item) => {
        return {
          x: item.x - this.x,
          y: item.y - this.y,
        };
      }))
    }
    return context;
  }
  getWidth() {
    const config = this.config;
    if (config.type == 'rect') {
      const width = config.rb_x - config.lt_x;
      return width;
    } else {
      let width = 0;
      const firstx = config.path[0].x;
      for (let i = 0; i < config.path.length; i++) {
        const point = config.path[i];
        width = Math.max(width, Math.abs(point.x - firstx));
      }
      return width;
    }
  }
  getMaxY() {
    const config = this.config;
    if (config.type == 'rect') {
      return config.rb_y;
    } else {
      let maxY = config.path[0].y;
      for (let i = 0; i < config.path.length; i++) {
        const y = config.path[i].y;
        maxY = Math.max(y, maxY);
      }
      return maxY;
    }
  }
}




