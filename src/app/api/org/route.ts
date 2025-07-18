import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface OrganizationFilters {
  city?: string
  state?: string
  tags?: {
    hasSome: string[]
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const state = searchParams.get('state')
  const city = searchParams.get('city')
  const tags = searchParams
    .get('tags')
    ?.split(',')
    .map((tag) => tag.trim())

  const filters: OrganizationFilters = {}
  if (state) filters.state = state
  if (city) filters.city = city
  if (tags?.length) filters.tags = { hasSome: tags }

  try {
    const organizations = await prisma.organization.findMany({
      where: filters,
      include: {
        user: {
          select: {
            name: true,
            city: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json({ organizations }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Internval server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const user = getUserFromToken(req)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, city, state, tags, contact, photos } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required!' },
        { status: 400 }
      )
    }

    const existingOrg = await prisma.organization.findUnique({
      where: { name },
    })

    if (existingOrg) {
      return NextResponse.json(
        { error: 'An organization with this name already exists.' },
        { status: 409 }
      )
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        city,
        state,
        tags,
        contact,
        photos: photos || [],
        userId: user.id,
      },
    })

    return NextResponse.json(
      { message: 'Organization created!', organization },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
