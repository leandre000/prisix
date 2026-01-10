import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RoadmapApprovalForm from '@/components/mentor/RoadmapApprovalForm'

export default async function RoadmapApprovalPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'MASTER_MENTOR') {
    redirect('/login')
  }

  const mentor = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!mentor) {
    redirect('/dashboard/mentor')
  }

  const roadmap = await prisma.roadmap.findUnique({
    where: { id: params.id },
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
      currentApproval: {
        include: {
          mentor: {
            include: {
              user: true,
            },
          },
        },
      },
      approvals: {
        include: {
          mentor: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!roadmap) {
    redirect('/dashboard/mentor')
  }

  // Check if mentor can approve this roadmap
  if (mentor.wingId && roadmap.wingId !== mentor.wingId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You can only approve roadmaps from your wing.</p>
        </div>
      </div>
    )
  }

  if (roadmap.status !== 'PENDING_APPROVAL' && roadmap.status !== 'CHANGES_REQUESTED') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Roadmap Already Processed</h1>
          <p className="text-gray-600">This roadmap has already been {roadmap.status.toLowerCase()}.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoadmapApprovalForm roadmap={roadmap} mentorId={mentor.id} />
      </div>
    </div>
  )
}

