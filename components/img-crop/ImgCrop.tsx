'use client'
import type { ReactNode } from 'react'
import type { MaskRef, MaskType } from './Mask'
import type { ActionType } from '@/components/action-bar'
import type { CanvasOriginImgConfig, Point } from '@/components/canvas/types'

import React, { useRef, useState } from 'react'
import ActionBar from '@/components/action-bar'
import { ClearImgIcon, CloseIcon, SubmitIcon, UploadImgIcon } from '@/components/action-bar/Icons'
import Background from '@/components/background'
import { getPolyContainerPoint } from '@/components/canvas/utils'
import { useFileDialog } from '@/hooks'
import { defaultDocument } from '@/lib/utils'
import { useDragZoom } from './hooks/useDragZoom'
import Img from './Img'
import Mask from './Mask'

export interface ImgCropProps {
  originImg: CanvasOriginImgConfig
  maskCropPath: [Point, Point, Point, Point]
  renderContent: (mask: MaskType, onAnimationComplete: () => void) => ReactNode
  onClean: () => void
  onSubmit: (url: string, originImg: CanvasOriginImgConfig) => void
  onClose: () => void
};

const ImgCrop: React.FC<ImgCropProps> = ({ originImg, maskCropPath, renderContent, onClean, onSubmit, onClose }) => {
  const maskRef = useRef<MaskRef>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [maskType, setMaskType] = useState<MaskType>('full')
  const [imgUrl, setImgUrl] = useState<string>(originImg?.url || '')
  const [originImgSize, setOriginImgSize] = useState({
    width: originImg?.width || 0,
    height: originImg?.height || 0,
  })
  const [dragX, dragY, zoom, resetDragZoom] = useDragZoom(containerRef, {
    dragX: originImg?.dragX,
    dragY: originImg?.dragY,
    zoom: originImg?.zoom,
  })
  const [, open, reset] = useFileDialog()

  const lt = getPolyContainerPoint(maskCropPath, 'lt')
  const rb = getPolyContainerPoint(maskCropPath, 'rb')
  const sizeStyle = {
    width: rb.x - lt.x,
    height: rb.y - lt.y,
  }

  const onAnimationComplete = () => {
    setMaskType('grid')
  }

  const handleClearImg = () => {
    reset()
    setImgUrl('')
    setOriginImgSize({
      width: 0,
      height: 0,
    })
    resetDragZoom()
  }

  const handleClose = () => {
    handleClearImg()
    setMaskType('full')
    onClose()
  }

  const handleSubmit = () => {
    const mask = maskRef.current
    if (!mask || !defaultDocument) {
      console.error('handleSubmit canvas and mask is undefined?')
      return
    }

    if (!imgUrl) {
      onClean()
      handleClose()
      return
    }

    const canvas = defaultDocument.createElement('canvas')
    const image = imageRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx || !image) {
      console.error('handleSubmit ctx and image is undefined?')
      return
    }

    const { x, y } = image.getBoundingClientRect()
    const imageWidth = image.offsetWidth
    const imageHeight = image.offsetHeight
    const { left: maskX, top: maskY } = mask.getMaskPosStyle()

    const pixelRatio = window.devicePixelRatio
    const { width: cropWidth, height: cropHeight } = sizeStyle
    canvas.width = Math.floor(cropWidth * pixelRatio)
    canvas.height = Math.floor(cropHeight * pixelRatio)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = (maskX - x)
    const cropY = (maskY - y)
    const centerX = imageWidth * zoom / 2
    const centerY = imageHeight * zoom / 2

    ctx.save()
    ctx.translate(-cropX, -cropY)
    ctx.translate(centerX, centerY)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, imageWidth * zoom, imageHeight * zoom)
    ctx.restore()

    const url = canvas.toDataURL('image/png')

    onSubmit(url, {
      url: imgUrl,
      width: imageWidth,
      height: imageHeight,
      dragX,
      dragY,
      zoom,
    })
    handleClose()
  }

  const handleSelectImg = async () => {
    handleClearImg()
    const files = await open()
    const imgFile = files![0]!
    const dataUrl = URL.createObjectURL(imgFile)
    setImgUrl(dataUrl)
  }

  const actions = [
    {
      Icon: UploadImgIcon,
      onClick: handleSelectImg,
    },
    {
      Icon: ClearImgIcon,
      onClick: handleClearImg,
    },
    {
      Icon: CloseIcon,
      onClick: handleClose,
    },
    {
      Icon: SubmitIcon,
      onClick: handleSubmit,
    },
  ].filter(action => action) as ActionType[]

  return (
    <>
      <Background
        ref={containerRef}
        className="bg-grid"
      >
        {imgUrl && (
          <Img
            ref={imageRef}
            url={imgUrl}
            dragX={dragX}
            dragY={dragY}
            zoom={zoom}
            defaultWidth={originImgSize.width}
            defaultHeight={originImgSize.height}
          />
        )}
      </Background>
      <div
        className="fixed inset-0 grid place-items-center z-[100] pointer-events-none"
      >
        {
          renderContent(maskType, onAnimationComplete)
        }
      </div>
      <Mask
        ref={maskRef}
        gridSize={sizeStyle}
        svgPath={maskCropPath}
        maskType={maskType}
      />
      <ActionBar
        className="fixed top-4 right-4 z-[101]"
        actions={actions}
      />
    </>
  )
}

ImgCrop.displayName = 'ImgCrop'

export default ImgCrop
