export function getImageSize(url: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = function () {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }
    image.onerror = function () {
      reject(new Error('getImageSize error'))
    }
    image.src = url
  })
}
