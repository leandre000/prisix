import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/audit'
import { canStudentStartLearning } from '@/lib/enforcement'

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
    const { roadmapId, scheduledAt, duration, meetingLink } = body

    // Validation
    if (!roadmapId || !scheduledAt || !duration || !meetingLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get roadmap with student
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        trainer: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found' },
        { status: 404 }
      )
    }

    // Check if roadmap is approved
    if (roadmap.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Roadmap must be approved before scheduling sessions' },
        { status: 400 }
      )
    }

    // Check if student can start learning
    const canStart = await canStudentStartLearning(roadmap.studentId)
    if (!canStart) {
      return NextResponse.json(
        { error: 'Student cannot start learning yet. Complete entry flow and make payment.' },
        { status: 400 }
      )
    }

    // Verify user is trainer or student
    const isTrainer = session.user.role === 'TRAINER' && roadmap.trainer.userId === session.user.id
    const isStudent = session.user.role === 'STUDENT' && roadmap.student.userId === session.user.id

    if (!isTrainer && !isStudent) {
      return NextResponse.json(
        { error: 'Only the trainer or student can schedule sessions' },
        { status: 403 }
      )
    }

    // Check for scheduling conflicts (same trainer, overlapping time)
    const scheduledTime = new Date(scheduledAt)
    const endTime = new Date(scheduledTime.getTime() + duration * 60000)

    const conflictingSession = await prisma.session.findFirst({
      where: {
        trainerId: roadmap.trainerId,
        status: {
          not: 'CANCELLED',
        },
        scheduledAt: {
          lte: endTime,
        },
        OR: [
          {
            scheduledAt: {
              gte: scheduledTime,
              lte: endTime,
            },
          },
          {
            scheduledAt: {
              lte: scheduledTime,
            },
            duration: {
              gte: duration,
            },
          },
        ],
      },
    })

    if (conflictingSession) {
      return NextResponse.json(
        { error: 'Trainer has a conflicting session at this time' },
        { status: 400 }
      )
    }

    // Create session
    const newSession = await prisma.session.create({
      data: {
        roadmapId: roadmap.id,
        trainerId: roadmap.trainerId,
        studentId: roadmap.studentId,
        wingId: roadmap.wingId,
        scheduledAt: scheduledTime,
        duration,
        meetingLink,
        status: 'SCHEDULED',
      },
    })

    // Log activity
    await logActivity(
      session.user.id,
      'SESSION_SCHEDULED',
      `Scheduled session for ${roadmap.student.user.name}`,
      {
        sessionId: newSession.id,
        roadmapId,
        scheduledAt,
        duration,
      }
    )

    return NextResponse.json({
      message: 'Session scheduled successfully',
      session: {
        id: newSession.id,
        scheduledAt: newSession.scheduledAt,
        duration: newSession.duration,
      },
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

