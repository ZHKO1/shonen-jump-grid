import type { HTMLMotionProps } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import type { CanvasGridConfig } from '../types'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface GridContentProps
  extends HTMLMotionProps<'div'> {
  gridId: CanvasGridConfig['id']
  imgStyle: CSSProperties
  disableMotion?: boolean
  clipPath?: string
  url?: string
  children?: ReactNode
}

export function GridContent({ ref, className, gridId, imgStyle, disableMotion = false, clipPath = '', url = '', ...props }: GridContentProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  // 有时候motion.div会给自己加上opacity:0，原因不明，因此只在必要时（也就是焦点状态）才使用motion.div
  const Comp = (disableMotion ? 'div' : motion.div) as (typeof motion.div)
  const extraProps = (disableMotion ? {} : { layoutId: `grid-content-${gridId}` })
  return (
    <Comp
      className={cn(
        'bg-slate-400 absolute flex flex-wrap content-center justify-center',
        className,
      )}
      ref={ref}
      {
        ...extraProps
      }
      {...props}
      style={{
        ...props.style,
        ...clipPath ? { clipPath } : {},
      }}
    >
      {url
        && (
          <div
            className="absolute"
            style={imgStyle}
          >
            <img
              className="absolute w-full h-full select-none"
              width={500}
              height={500}
              src={url}
              alt="background"
            />
          </div>
        )}
      {
        props.children
      }
    </Comp>
  )
}

GridContent.displayName = 'GridContent'
