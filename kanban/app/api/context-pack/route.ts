import { NextRequest, NextResponse } from 'next/server'
import { contextPack } from '@/lib/context-pack'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('id')
    const query = searchParams.get('q')

    // Get specific resource content
    if (resourceId) {
      const resource = await contextPack.getResource(resourceId)
      if (!resource) {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(resource)
    }

    // Search resources
    if (query) {
      const results = await contextPack.searchResources(query)
      return NextResponse.json({ resources: results })
    }

    // Get all resources
    const resources = await contextPack.getResources()
    return NextResponse.json({ resources })

  } catch (error) {
    console.error('Context pack API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch context pack resources' },
      { status: 500 }
    )
  }
} 