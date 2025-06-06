import type { FC, RefObject } from 'react'
import type { Point } from '@/components/canvas/types'
import { motion } from 'framer-motion'
import { useImperativeHandle, useRef } from 'react'
import { getSvgPoints } from '@/components/canvas/utils'
import { useWindowSize } from '@/hooks'

export type MaskType = 'full' | 'grid'
export interface MaskRef {
  getMaskPosStyle: () => { left: number, top: number }
}

interface MaskProps {
  ref: RefObject<MaskRef | null>
  gridSize: { width: number, height: number }
  svgPath: [Point, Point, Point, Point]
  maskType: MaskType
}

const Mask: FC<MaskProps> = ({ ref, gridSize, svgPath, maskType }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const {
    width: gridWidth = 0,
    height: gridHeight = 0,
  } = gridSize
  const maskSvgPosStyle = {
    left: (windowWidth - gridWidth) / 2,
    top: (windowHeight - gridHeight) / 2,
  }
  const maskSvgPoints = getSvgPoints(svgPath.map(({ x, y }) => ({
    x: x + maskSvgPosStyle.left,
    y: y + maskSvgPosStyle.top,
  })) as [Point, Point, Point, Point])

  useImperativeHandle(ref, () => ({
    getMaskPosStyle: () => {
      return maskSvgPosStyle
    },
  }))

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0,
        },
      }}
      className="fixed inset-0 h-full w-full z-[100] pointer-events-none"
      ref={containerRef}
    >
      {
        maskType === 'grid'
          ? (
              <svg
                className="absolute top-0 right-0 bottom-0 left-0"
                width="100%"
                height="100%"
              >
                <defs>
                  <mask id="hole-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <polygon
                      points={maskSvgPoints}
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect fill="black" fillOpacity={0.2} width="100%" height="100%" mask="url(#hole-mask)" />
              </svg>
            )
          : (
              <div
                className="fixed inset-0 flex items-center justify-center h-full w-full z-10 bg-black/20"
              />
            )
      }
    </motion.div>
  )
}

Mask.displayName = 'Mask'

export default Mask
