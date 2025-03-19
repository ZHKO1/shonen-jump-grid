import { Graphics } from 'pixi.js'
import { Height, Width } from './config'

export function getOverlay(color: number | string) {
  const overlay = new Graphics()
  overlay.rect(0, 0, Width, Height)
  overlay.fill({ color })
  overlay.alpha = 0
  overlay.zIndex = 10
  return overlay
}
