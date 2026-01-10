import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/audit'
import { canStudentStartLearning } from '@/lib/enforcement'
import { generateMeetingLink, isValidMeetingLink } from '@/lib/google-meet'
import { validate, sessionSchema } from '@/lib/validation'
import { handleError, BusinessRuleError, AuthorizationError } from '@/lib/errors'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      throw new AuthorizationError('Unauthorized')
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = validate(sessionSchema, {
      scheduledAt: body.scheduledAt,
      duration: body.duration,
      meetingLink: body.meetingLink || generateMeetingLink({
        title: `Learning Session`,
        startTime: new Date(body.scheduledAt),
        duration: body.duration,
      }),
    })

    const { roadmapId } = body

    if (!roadmapId) {
      throw new BusinessRuleError('Roadmap ID is required')
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
      throw new BusinessRuleError('Roadmap not found')
    }

    // Check if roadmap is approved
    if (roadmap.status !== 'APPROVED') {
      throw new BusinessRuleError('Roadmap must be approved before scheduling sessions')
    }

    // Check if student can start learning
    const canStart = await canStudentStartLearning(roadmap.studentId)
    if (!canStart) {
      throw new BusinessRuleError('Student cannot start learning yet. Complete entry flow and make payment.')
    }

    // Verify user is trainer or student
    const isTrainer = session.user.role === 'TRAINER' && roadmap.trainer.userId === session.user.id
    const isStudent = session.user.role === 'STUDENT' && roadmap.student.userId === session.user.id

    if (!isTrainer && !isStudent) {
      throw new AuthorizationError('Only the trainer or student can schedule sessions')
    }

    // Check for scheduling conflicts (same trainer, overlapping time)
    const scheduledTime = new Date(validatedData.scheduledAt)
    const endTime = new Date(scheduledTime.getTime() + validatedData.duration * 60000)

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
              gte: validatedData.duration,
            },
          },
        ],
      },
    })

    if (conflictingSession) {
      throw new BusinessRuleError('Trainer has a conflicting session at this time')
    }

    // Generate meeting link if not provided or invalid
    let meetingLink = validatedData.meetingLink
    if (!meetingLink || !isValidMeetingLink(meetingLink)) {
      meetingLink = generateMeetingLink({
        title: `Session: ${roadmap.title}`,
        startTime: scheduledTime,
        duration: validatedData.duration,
      })
    }

    // Create session
    const newSession = await prisma.session.create({
      data: {
        roadmapId: roadmap.id,
        trainerId: roadmap.trainerId,
        studentId: roadmap.studentId,
        wingId: roadmap.wingId,
        scheduledAt: scheduledTime,
        duration: validatedData.duration,
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
        scheduledAt: scheduledTime,
        duration: validatedData.duration,
      }
    )

    return NextResponse.json({
      message: 'Session scheduled successfully',
      session: {
        id: newSession.id,
        scheduledAt: newSession.scheduledAt,
        duration: newSession.duration,
        meetingLink: newSession.meetingLink,
      },
    })
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    )
  }
}
