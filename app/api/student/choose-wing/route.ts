import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/audit'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { wingId } = await request.json()

    if (!wingId) {
      return NextResponse.json(
        { error: 'Wing ID is required' },
        { status: 400 }
      )
    }

    // Verify wing exists and is active
    const wing = await prisma.wing.findUnique({
      where: { id: wingId },
    })

    if (!wing || !wing.isActive) {
      return NextResponse.json(
        { error: 'Invalid or inactive wing' },
        { status: 400 }
      )
    }

    // Update student profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Update user's wing
    await prisma.user.update({
      where: { id: session.user.id },
      data: { wingId },
    })

    // Update student profile
    await prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        wingId,
        hasChosenWing: true,
      },
    })

    // Log activity
    await logActivity(
      session.user.id,
      'ROADMAP_CREATED', // Using closest activity type
      `Student chose wing: ${wing.name}`,
      { wingId, wingName: wing.name }
    )

    return NextResponse.json({
      message: 'Wing selected successfully',
      wing: {
        id: wing.id,
        name: wing.name,
        guidanceDocument: wing.guidanceDocument,
      },
    })
  } catch (error) {
    console.error('Error choosing wing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

