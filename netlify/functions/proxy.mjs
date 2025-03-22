import fetch from 'node-fetch'

export async function handler(event, _context) {
  const targetUrl = `https://pnglog.com/${event.path.replace('/proxy/', '')}` // 构建目标 URL

  try {
    const response = await fetch(targetUrl) // 获取目标 URL 的响应
    const body = await response.buffer() // 获取响应体

    // 设置响应头
    const headers = {
      'Content-Type': response.headers.get('Content-Type'), // 保持原始内容类型
      'Cache-Control': 'public, max-age=31536000, must-revalidate', // 设置缓存头
    }
    return {
      statusCode: response.status, // 返回原始状态码
      headers,
      body: body.toString('base64'), // 将响应体转换为 base64
      isBase64Encoded: true, // 指示响应体是 base64 编码
    }
  }
  catch (error) {
    console.error('Error fetching the target URL:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}
