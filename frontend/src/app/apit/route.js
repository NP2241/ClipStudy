import { NextResponse } from 'next/server'

export async function GET() {
  const response = await fetch('https://baconipsum.com/api/?type=all-meat&paras=3&start-with-lorem=1&format=json')
  const data = await response.json()
  const text = data.join(' ')

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(' ')
      for (let word of words) {
        const chunk = encoder.encode(word + ' ')
        controller.enqueue(chunk)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      controller.close()
    }
  })

  return new NextResponse(stream)
}