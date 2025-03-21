'use client'
import type { HTMLMotionProps } from 'framer-motion'
import type { CanvasPageConfig } from '../types'
import { getLogoStyle } from '../utils'
import LogoContent from './LogoContent'

export interface LogoProps extends HTMLMotionProps<'div'> {
  logo: CanvasPageConfig['logo']
};

const Logo: React.FC<LogoProps> = ({ logo }) => {
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
      style={logoStyle}
      url={logo?.url}
    />
  )
}

export default Logo
