import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface GridIconProps
  extends HTMLAttributes<HTMLDivElement> {
  iconType: 'left-to-right' | 'right-to-left' | 'gray-to-color'
}

export function GridIcon({ ref, className, iconType, ...props }: GridIconProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  let bgColor = ''
  let text = ''
  switch (iconType) {
    case 'left-to-right':
      text = 'R'
      bgColor = 'bg-yellow-600'
      break
    case 'right-to-left':
      text = 'L'
      bgColor = 'bg-blue-600'
      break
    case 'gray-to-color':
      text = 'C'
      bgColor = 'bg-red-600'
      break
  }
  return (
    <div
      ref={ref}
      className={cn('text-xl text-white border-gray-300 border-4  w-16 text-center rounded-full', bgColor, className)}
      {...props}
    >
      {text}
    </div>
  )
}

GridIcon.displayName = 'GridIcon'
