import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const posts = await payload.find({ collection: 'posts' })
    
    return NextResponse.json({
      message: 'Payload работает!',
      posts: posts.docs
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Ошибка Payload',
      details: String(error) 
    }, { status: 500 })
  }
}