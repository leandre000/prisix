import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import GuidanceReader from '@/components/student/GuidanceReader'

export default async function ReadGuidancePage({
  searchParams,
}: {
  searchParams: { wingId?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'STUDENT') {
    redirect('/login')
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      wing: true,
    },
  })

  if (!student) {
    redirect('/dashboard/student/choose-wing')
  }

  const wingId = searchParams.wingId || student.wingId

  if (!wingId) {
    redirect('/dashboard/student/choose-wing')
  }

  const wing = await prisma.wing.findUnique({
    where: { id: wingId },
  })

  if (!wing) {
    redirect('/dashboard/student/choose-wing')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GuidanceReader
          wing={wing}
          studentId={student.id}
          hasReadGuidance={student.hasReadGuidance}
        />
      </div>
    </div>
  )
}

