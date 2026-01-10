import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/audit'
import { canCreateRoadmap, canTrainerAcceptStudent } from '@/lib/enforcement'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      studentId,
      trainerId,
      wingId,
      title,
      description,
      learningObjectives,
      weeklyHours,
      practiceExpectations,
      weeklySchedule,
      monthlyPrice,
    } = body

    // Validation
    if (!studentId || !trainerId || !wingId || !title || !description || !learningObjectives) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (weeklyHours < 4.5) {
      return NextResponse.json(
        { error: 'Weekly hours must be at least 4.5' },
        { status: 400 }
      )
    }

    if (!monthlyPrice || monthlyPrice <= 0) {
      return NextResponse.json(
        { error: 'Invalid monthly price' },
        { status: 400 }
      )
    }

    // Verify student belongs to user
    const student = await prisma.studentProfile.findUnique({
      where: {
        id: studentId,
        userId: session.user.id,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Check entry flow prerequisites
    if (!student.hasChosenWing || !student.hasReadGuidance) {
      return NextResponse.json(
        { error: 'Please complete the entry flow first' },
        { status: 400 }
      )
    }

    // Check if roadmap can be created
    const roadmapCheck = await canCreateRoadmap(studentId)
    if (!roadmapCheck.canCreate) {
      return NextResponse.json(
        { error: roadmapCheck.reason || 'Cannot create roadmap' },
        { status: 400 }
      )
    }

    // Check trainer capacity
    const capacityCheck = await canTrainerAcceptStudent(trainerId)
    if (!capacityCheck.canAccept) {
      return NextResponse.json(
        { error: capacityCheck.reason || 'Trainer is at full capacity' },
        { status: 400 }
      )
    }

    // Verify trainer exists and belongs to the wing
    const trainer = await prisma.trainerProfile.findUnique({
      where: {
        id: trainerId,
        wingId: wingId,
      },
    })

    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found or does not belong to this wing' },
        { status: 404 }
      )
    }

    // Create roadmap
    const roadmap = await prisma.roadmap.create({
      data: {
        studentId,
        trainerId,
        wingId,
        title,
        description,
        learningObjectives,
        weeklyHours,
        practiceExpectations,
        weeklySchedule: weeklySchedule || {},
        monthlyPrice,
        status: 'PENDING_APPROVAL',
        isLocked: true,
      },
    })

    // Update student profile
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        hasMetTrainer: true,
      },
    })

    // Log activity
    await logActivity(
      session.user.id,
      'ROADMAP_CREATED',
      `Created roadmap: ${title}`,
      {
        roadmapId: roadmap.id,
        trainerId,
        weeklyHours,
        monthlyPrice,
      }
    )

    return NextResponse.json({
      message: 'Roadmap created successfully',
      roadmap: {
        id: roadmap.id,
        status: roadmap.status,
      },
    })
  } catch (error) {
    console.error('Error creating roadmap:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

