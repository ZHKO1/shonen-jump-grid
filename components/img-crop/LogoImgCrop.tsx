'use client'
import type { MaskType } from './Mask'
import type { CanvasOriginImgConfig, CanvasPageConfig } from '@/components/canvas/types'
import { getLogoStyle } from '@/components/canvas/utils'
import { useAdjustComic } from '@/hooks/custom/useAdjustComic'
import { cn } from '@/lib/utils'
import LogoContent from '../canvas/logo/LogoContent'
import ImgCrop from './ImgCrop'

export default function LogoImgCrop({ logo, onClose }: { logo: CanvasPageConfig['logo'], onClose: () => void }) {
  const {
    sizeStyle,
    svgPath,
  } = getLogoStyle(logo)
  const originImg = logo?.originImg
    ? logo?.originImg
    : logo?.url
      ? {
          url: logo?.url || '',
          ...sizeStyle,
          dragX: 0,
          dragY: 0,
          zoom: 1,
        }
      : {
          url: '',
          width: 0,
          height: 0,
          dragX: 0,
          dragY: 0,
          zoom: 1,
        }

  const { adjustPage } = useAdjustComic()

  const onSubmit = (url: string, originImg: CanvasOriginImgConfig) => {
    adjustPage('page0', {
      logo: {
        url,
        originImg,
      },
    })
  }

  const onClean = () => {
    adjustPage('page0', {
      logo: {
        url: '',
      },
    })
  }

  const renderContent = (maskType: MaskType, onAnimationComplete: () => void) => (
    <>
      <LogoContent
        className={
          cn(maskType === 'grid' ? 'bg-transparent' : '')
        }
        style={sizeStyle}
        url={maskType === 'grid' ? '' : logo?.url}
        onLayoutAnimationComplete={onAnimationComplete}
      />
    </>
  )

  return (
    <ImgCrop
      originImg={originImg}
      maskCropPath={svgPath}
      renderContent={renderContent}
      onClean={onClean}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  )
}
