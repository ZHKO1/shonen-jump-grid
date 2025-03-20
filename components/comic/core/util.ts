type HandleType = 'white-transparent' | 'gray'

interface options {
  url: string
  x?: number
  y?: number
  width?: number
  height?: number
}

/**
 * 对图片进行裁剪，默认进行白色背景透明化工作
 * TODO 这里需要思考优化，看看能不能跳过裁剪
 * @param {{url: string, x: number, y: number, width: number, height: number}} options
 * @param {HandleType[]} handles
 * @returns {Promise<string>}
 */
export function getComicGridImage({ url, x = 0, y = 0, width = 0, height = 0 }: options, handles: HandleType[] = ['white-transparent']): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const image = new Image()
    image.src = url
    image.onload = function () {
      if (!width) {
        width = image.width
      }
      if (!height) {
        height = image.height
      }
      canvas.width = width
      canvas.height = height
      draw()
    }
    function draw() {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height)
      const imgData = ctx.getImageData(0, 0, width, height)
      handles.forEach((type) => {
        handle(imgData, type)
      })

      ctx.putImageData(imgData, 0, 0)
      resolve(fixAssetsUrl(canvas.toDataURL()))
    }
  })
}

function handle(imgData: ImageData, type: HandleType) {
  for (let i = 0, len = imgData.data.length; i < len; i += 4) {
    const r = imgData.data[i]
    const g = imgData.data[i + 1]
    const b = imgData.data[i + 2]
    switch (type) {
      case 'white-transparent':
        if ([r, g, b].every(v => v < 256 && v > 230)) {
          imgData.data[i + 3] = 0
        }
        break
      case 'gray': {
        const average = (r + g + b) / 3
        imgData.data[i] = average
        imgData.data[i + 1] = average
        imgData.data[i + 2] = average
        break
      }
    }
  }
}

function fixAssetsUrl(url: string) {
  const base64Reg = /data:image\/png;base64,.*/g
  const matchRes = url.match(base64Reg)
  // 匹配base64的部分
  if (matchRes) {
    return matchRes[0]
  }
  return ''
}
