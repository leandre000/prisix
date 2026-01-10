import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/audit'
import { doesSessionCountTowardHours } from '@/lib/enforcement'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Get session
    const sessionRecord = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        trainer: {
          include: {
            user: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!sessionRecord) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Determine if user is trainer or student
    const isTrainer = session.user.role === 'TRAINER' && sessionRecord.trainer.userId === session.user.id
    const isStudent = session.user.role === 'STUDENT' && sessionRecord.student.userId === session.user.id

    if (!isTrainer && !isStudent) {
      return NextResponse.json(
        { error: 'You can only confirm your own sessions' },
        { status: 403 }
      )
    }

    // Update confirmation
    const updateData: any = {}
    if (isTrainer) {
      updateData.trainerConfirmation = 'CONFIRMED'
      updateData.trainerConfirmedAt = new Date()
    } else {
      updateData.studentConfirmation = 'CONFIRMED'
      updateData.studentConfirmedAt = new Date()
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: updateData,
    })

    // Reload session to check if both confirmed
    const updatedSession = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Session not found after update' },
        { status: 500 }
      )
    }

    // Check if both confirmed
    const countsTowardHours = doesSessionCountTowardHours(
      updatedSession.trainerConfirmation,
      updatedSession.studentConfirmation
    )

    if (countsTowardHours && !updatedSession.countsTowardHours) {
      // Update session to count toward hours
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          countsTowardHours: true,
          status: 'COMPLETED',
        },
      })

      // Update trainer wallet if applicable (earnings based on confirmed sessions)
      // This will be handled in the payment/wallet system
    }

    // Log activity
    await logActivity(
      session.user.id,
      'SESSION_CONFIRMED',
      `${isTrainer ? 'Trainer' : 'Student'} confirmed session`,
      {
        sessionId,
        role: isTrainer ? 'TRAINER' : 'STUDENT',
      }
    )

    return NextResponse.json({
      message: 'Session confirmed successfully',
      bothConfirmed: countsTowardHours,
    })
  } catch (error) {
    console.error('Error confirming session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

