import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SessionConfirmation from '@/components/trainer/SessionConfirmation'

export default async function SessionConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'TRAINER') {
    redirect('/login')
  }

  const trainer = await prisma.trainerProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!trainer) {
    redirect('/dashboard/trainer')
  }

  const sessionRecord = await prisma.session.findUnique({
    where: { id: params.id },
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
      roadmap: true,
    },
  })

  if (!sessionRecord) {
    redirect('/dashboard/trainer')
  }

  if (sessionRecord.trainerId !== trainer.id) {
    redirect('/dashboard/trainer')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SessionConfirmation session={sessionRecord} trainerId={trainer.id} />
      </div>
    </div>
  )
}

