import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, BookOpen, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'STUDENT') {
    redirect('/login')
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      roadmap: {
        include: {
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
      },
      sessions: {
        where: {
          scheduledAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          scheduledAt: 'asc',
        },
        take: 5,
      },
      payments: {
        where: {
          isActive: true,
        },
        orderBy: {
          endDate: 'desc',
        },
        take: 1,
        include: {
          roadmap: true,
        },
      },
    },
  })

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Student Profile Not Found</h1>
          <p className="text-gray-600 mb-6">Please complete your registration.</p>
        </div>
      </div>
    )
  }

  const hasActivePayment = student.payments.length > 0 && student.payments[0].isActive
  const roadmap = student.roadmap
  const isRoadmapApproved = roadmap?.status === 'APPROVED'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
          <p className="text-gray-600 mt-2">Here's your learning overview</p>
        </div>

        {/* Entry Flow Status */}
        {!student.canStartLearning && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Complete Your Entry Process
              </CardTitle>
              <CardDescription>
                Follow these steps to start learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {student.hasChosenWing ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className={student.hasChosenWing ? 'text-gray-700' : 'text-gray-500'}>
                    Choose a Wing
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {student.hasReadGuidance ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className={student.hasReadGuidance ? 'text-gray-700' : 'text-gray-500'}>
                    Read Wing Guidance Document
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {student.hasMetTrainer ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className={student.hasMetTrainer ? 'text-gray-700' : 'text-gray-500'}>
                    Meet with Trainer to Design Roadmap
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {isRoadmapApproved ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className={isRoadmapApproved ? 'text-gray-700' : 'text-gray-500'}>
                    Roadmap Approved by Mentor
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {hasActivePayment ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className={hasActivePayment ? 'text-gray-700' : 'text-gray-500'}>
                    Active Payment
                  </span>
                </div>
              </div>
              {!student.hasChosenWing && (
                <Link
                  href="/dashboard/student/choose-wing"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose Your Wing
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Roadmap Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                My Roadmap
              </CardTitle>
              <CardDescription>Your personalized learning path</CardDescription>
            </CardHeader>
            <CardContent>
              {roadmap ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2">{roadmap.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{roadmap.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${
                        roadmap.status === 'APPROVED' ? 'text-green-600' :
                        roadmap.status === 'PENDING_APPROVAL' ? 'text-yellow-600' :
                        roadmap.status === 'REJECTED' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {roadmap.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Weekly Hours:</span>
                      <span className="font-semibold">{roadmap.weeklyHours}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Price:</span>
                      <span className="font-semibold">${roadmap.monthlyPrice}</span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/student/roadmap"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    View Full Roadmap →
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">No roadmap created yet.</p>
                  <Link
                    href="/dashboard/student/create-roadmap"
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    Create Roadmap →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your scheduled learning sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {student.sessions.length > 0 ? (
                <div className="space-y-3">
                  {student.sessions.map((session) => (
                    <div key={session.id} className="border-l-4 border-blue-500 pl-3">
                      <div className="font-semibold text-sm">
                        {new Date(session.scheduledAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(session.scheduledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Duration: {session.duration} minutes
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/dashboard/student/sessions"
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    View All Sessions →
                  </Link>
                </div>
              ) : (
                <p className="text-gray-600">No upcoming sessions scheduled.</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Payment Status
              </CardTitle>
              <CardDescription>Your current subscription</CardDescription>
            </CardHeader>
            <CardContent>
              {hasActivePayment ? (
                <div>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600 mb-2">Active</div>
                    <p className="text-sm text-gray-600">
                      Access until {new Date(student.payments[0].endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/student/payments"
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    Manage Payments →
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-red-600 mb-2">Inactive</div>
                    <p className="text-sm text-gray-600">
                      No active payment. Learning access is locked.
                    </p>
                  </div>
                  {isRoadmapApproved && (
                    <Link
                      href="/dashboard/student/payments"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      Make Payment
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

