import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import React from 'react'
import { cn } from '@/lib/utils'

function Background({ ref, className, children, ...props }: HTMLMotionProps<'div'> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 h-full w-full z-[100]',
        className,
      )}
      ref={ref}
      {...props}
    >
      {
        children
      }
    </motion.div>
  )
}

Background.displayName = 'Background'

export default Background
