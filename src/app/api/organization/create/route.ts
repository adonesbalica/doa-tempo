import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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
