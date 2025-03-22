export async function uploadImage(blob: Blob): Promise<string> {
  const form = new FormData()
  form.append('file', blob, 'i.png')
  const req = await fetch(`${import.meta.env.PUBLIC_API_UPLOAD}/api/v1/upload`, {
    method: 'post',
    body: form,
  })
  const data = await req.json()
  if (data?.data?.links?.url) {
    return data.data.links.url
  }
  else {
    throw new Error('cannot get url from pnglog')
  }
}
