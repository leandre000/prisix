import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function MentorDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'MASTER_MENTOR') {
    redirect('/login')
  }

  const mentor = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      wing: true,
    },
  })

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mentor Profile Not Found</h1>
          <p className="text-gray-600">Please contact an administrator.</p>
        </div>
      </div>
    )
  }

  // Get pending roadmaps for approval
  const pendingRoadmaps = await prisma.roadmap.findMany({
    where: {
      status: 'PENDING_APPROVAL',
      ...(mentor.wingId ? { wingId: mentor.wingId } : {}), // Wing mentors see only their wing, umbrella mentors see all
    },
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
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })

  // Get recent approvals
  const recentApprovals = await prisma.roadmapApproval.findMany({
    where: {
      mentorId: mentor.id,
    },
    include: {
      roadmap: {
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {session.user.name}!</h1>
          <p className="text-gray-600 mt-2">Master Mentor Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{pendingRoadmaps.length}</div>
              <p className="text-sm text-gray-600 mt-1">Roadmaps awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Recent Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{recentApprovals.length}</div>
              <p className="text-sm text-gray-600 mt-1">In the last 5 actions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900">
                {mentor.wingId ? 'Wing Level' : 'Umbrella Level'}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {mentor.wingId ? mentor.wing?.name : 'All Wings'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pending Roadmap Approvals</CardTitle>
            <CardDescription>
              Review and approve roadmaps for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRoadmaps.length > 0 ? (
              <div className="space-y-4">
                {pendingRoadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{roadmap.title}</h3>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            PENDING
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Student:</strong> {roadmap.student.user.name} ({roadmap.student.user.email})
                          </p>
                          <p>
                            <strong>Trainer:</strong> {roadmap.trainer.user.name}
                          </p>
                          <p>
                            <strong>Weekly Hours:</strong> {roadmap.weeklyHours}h | 
                            <strong> Monthly Price:</strong> ${roadmap.monthlyPrice}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {roadmap.description}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/mentor/roadmap/${roadmap.id}`}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No pending approvals</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Approvals</CardTitle>
            <CardDescription>Your recent roadmap approval actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentApprovals.length > 0 ? (
              <div className="space-y-3">
                {recentApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {approval.roadmap.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {approval.roadmap.student.user.name} • {new Date(approval.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        approval.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        approval.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {approval.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No recent approvals</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

