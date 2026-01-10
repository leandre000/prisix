import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/audit'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'MASTER_MENTOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roadmapId, mentorId, status, comments } = body

    if (!roadmapId || !mentorId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify mentor
    const mentor = await prisma.mentorProfile.findUnique({
      where: {
        id: mentorId,
        userId: session.user.id,
      },
    })

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor profile not found' },
        { status: 404 }
      )
    }

    // Get roadmap
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    })

    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found' },
        { status: 404 }
      )
    }

    // Check if mentor can approve this roadmap
    if (mentor.wingId && roadmap.wingId !== mentor.wingId) {
      return NextResponse.json(
        { error: 'You can only approve roadmaps from your wing' },
        { status: 403 }
      )
    }

    // Check if roadmap is in correct status
    if (roadmap.status !== 'PENDING_APPROVAL' && roadmap.status !== 'CHANGES_REQUESTED') {
      return NextResponse.json(
        { error: 'Roadmap is not pending approval' },
        { status: 400 }
      )
    }

    // Validate comments for rejection or changes
    if ((status === 'REJECTED' || status === 'CHANGES_REQUESTED') && !comments?.trim()) {
      return NextResponse.json(
        { error: 'Comments are required for rejection or changes request' },
        { status: 400 }
      )
    }

    // Update previous approvals to not be current
    await prisma.roadmapApproval.updateMany({
      where: {
        roadmapId,
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    })

    // Create new approval
    const approval = await prisma.roadmapApproval.create({
      data: {
        roadmapId,
        mentorId,
        status,
        comments: comments?.trim() || null,
        isCurrent: true,
      },
    })

    // Update roadmap status
    const updateData: any = {
      status,
      currentApproval: {
        connect: { id: approval.id },
      },
    }

    if (status === 'APPROVED') {
      updateData.isLocked = false
      updateData.approvedAt = new Date()
    }

    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: updateData,
    })

    // Log activity
    const activityType = status === 'APPROVED' ? 'ROADMAP_APPROVED' :
                        status === 'REJECTED' ? 'ROADMAP_REJECTED' :
                        'ROADMAP_CHANGES_REQUESTED'

    await logActivity(
      session.user.id,
      activityType,
      `${status} roadmap: ${roadmap.title}`,
      {
        roadmapId,
        status,
        studentId: roadmap.studentId,
      }
    )

    return NextResponse.json({
      message: `Roadmap ${status.toLowerCase()} successfully`,
      approval: {
        id: approval.id,
        status: approval.status,
      },
    })
  } catch (error) {
    console.error('Error approving roadmap:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

