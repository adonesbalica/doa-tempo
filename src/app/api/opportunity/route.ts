import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organization = await prisma.organization.findFirst({
      where: { userId: user.id },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'User has no registered organization' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, description, requirements } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        description,
        requirements,
        organizationId: organization.id,
      },
    })

    return NextResponse.json(opportunity, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
