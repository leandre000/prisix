import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RoadmapCreator from '@/components/student/RoadmapCreator'

export default async function CreateRoadmapPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'STUDENT') {
    redirect('/login')
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      wing: true,
      roadmap: true,
    },
  })

  if (!student) {
    redirect('/dashboard/student/choose-wing')
  }

  // Check entry flow prerequisites
  if (!student.hasChosenWing) {
    redirect('/dashboard/student/choose-wing')
  }

  if (!student.hasReadGuidance) {
    redirect('/dashboard/student/read-guidance')
  }

  // Check if roadmap already exists
  if (student.roadmap) {
    redirect('/dashboard/student/roadmap')
  }

  // Get trainers for the wing
  const trainers = await prisma.trainerProfile.findMany({
    where: {
      wingId: student.wingId,
    },
    include: {
      user: true,
    },
  })

  // Get available trainers (with capacity)
  const availableTrainers = await Promise.all(
    trainers.map(async (trainer) => {
      const capacityCheck = await import('@/lib/enforcement').then(m =>
        m.canTrainerAcceptStudent(trainer.id)
      )
      return {
        ...trainer,
        canAccept: capacityCheck.canAccept,
        currentCount: capacityCheck.currentCount,
        maxCapacity: capacityCheck.maxCapacity,
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoadmapCreator
          student={student}
          trainers={availableTrainers}
        />
      </div>
    </div>
  )
}

