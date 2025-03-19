'use client'
import type { HTMLMotionProps } from 'framer-motion'
import type { CanvasPageConfig } from '../types'
import { cn } from '@/lib/utils'
import { getLogoStyle } from '../utils'
import LogoContent from './LogoContent'

export interface LogoProps extends HTMLMotionProps<'div'> {
  logo: CanvasPageConfig['logo']
  focused?: boolean
};

const Logo: React.FC<LogoProps> = ({ logo, focused = false }) => {
  const {
    sizeStyle,
    posStyle,
  } = getLogoStyle(logo)
  const logoStyle = {
    ...posStyle,
    ...sizeStyle,
  }

  return (
    <LogoContent
      className={cn(!focused && 'pointer-events-none opacity-30')}
      style={logoStyle}
      disableMotion={!focused}
      url={logo?.url}
    />
  )
}

export default Logo
