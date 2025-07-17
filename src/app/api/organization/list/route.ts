import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const organizations = await prisma.organization.findMany({
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
