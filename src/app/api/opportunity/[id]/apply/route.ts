import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(req)

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const opportunityId = params.id
    const body = await req.json()
    const { message } = body

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    })

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      )
    }

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        opportunityId,
        message,
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
