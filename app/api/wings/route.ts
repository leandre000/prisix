import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const wings = await prisma.wing.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        guidanceDocument: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(wings)
  } catch (error) {
    console.error('Error fetching wings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wings' },
      { status: 500 }
    )
  }
}

