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

    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Verify student belongs to the user
    const student = await prisma.studentProfile.findUnique({
      where: {
        id: studentId,
        userId: session.user.id,
      },
      include: {
        wing: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    if (!student.hasChosenWing) {
      return NextResponse.json(
        { error: 'Please choose a wing first' },
        { status: 400 }
      )
    }

    // Update student profile
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        hasReadGuidance: true,
      },
    })

    // Log activity
    await logActivity(
      session.user.id,
      'ROADMAP_CREATED', // Using closest activity type
      `Student marked guidance as read for wing: ${student.wing.name}`,
      { wingId: student.wingId, wingName: student.wing.name }
    )

    return NextResponse.json({
      message: 'Guidance marked as read successfully',
    })
  } catch (error) {
    console.error('Error marking guidance as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

