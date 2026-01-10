import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import WingSelection from '@/components/student/WingSelection'

export default async function ChooseWingPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'STUDENT') {
    redirect('/login')
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (student?.hasChosenWing) {
    redirect('/dashboard/student')
  }

  // Fetch all active wings
  const wings = await prisma.wing.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Wing</h1>
          <p className="text-gray-600">
            Select the wing that best matches your learning goals. Each wing has its own culture and focus.
          </p>
        </div>
        <WingSelection wings={wings} />
      </div>
    </div>
  )
}

