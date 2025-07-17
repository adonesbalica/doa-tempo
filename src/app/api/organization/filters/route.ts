import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface OrganizationFilters {
  city?: string
  state?: string
  tags?: {
    hasSome: string[]
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const state = searchParams.get('state')
  const city = searchParams.get('city')
  const tags = searchParams
    .get('tags')
    ?.split(',')
    .map((tag) => tag.trim())

  const filters: any = {}
  if (state) filters.state = state
  if (city) filters.city = city
  if (tags?.length) filters.tags = { hasSome: tags }

  const organizations = await prisma.organization.findMany({
    where: filters,
  })

  return NextResponse.json({ organizations })
}
