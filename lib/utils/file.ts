import { dataUrlReg } from './reg'

export function dataURLtoBlob(dataurl: string) {
  const matchRes = dataurl.match(dataUrlReg)

  if (!matchRes) {
    throw new Error('Invalid data URL')
  }

  const mimeType = matchRes[1]
  const base64Data = matchRes[2]

  const bstr = atob(base64Data)
  const n = bstr.length
  const u8arr = new Uint8Array(n)

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i)
  }

  return new Blob([u8arr], { type: mimeType })
}

export function downloadText(filename: string, text: string) {
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
