import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/audit'
import { calculateTrainerCapacity } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'TRAINER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { weeklyHoursAvailable } = body

    if (!weeklyHoursAvailable || weeklyHoursAvailable < 0) {
      return NextResponse.json(
        { error: 'Invalid weekly hours' },
        { status: 400 }
      )
    }

    const trainer = await prisma.trainerProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer profile not found' },
        { status: 404 }
      )
    }

    const maxStudents = calculateTrainerCapacity(weeklyHoursAvailable, 4.5)

    // Update trainer capacity
    await prisma.trainerProfile.update({
      where: { id: trainer.id },
      data: {
        weeklyHoursAvailable,
        maxStudents,
      },
    })

    // Log activity
    await logActivity(
      session.user.id,
      'CAPACITY_UPDATED',
      `Updated weekly hours to ${weeklyHoursAvailable}h (max ${maxStudents} students)`,
      {
        trainerId: trainer.id,
        weeklyHoursAvailable,
        maxStudents,
      }
    )

    return NextResponse.json({
      message: 'Capacity updated successfully',
      weeklyHoursAvailable,
      maxStudents,
    })
  } catch (error) {
    console.error('Error updating capacity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

