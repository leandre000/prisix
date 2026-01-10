import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Target, DollarSign, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function RoadmapPage() {
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
    },
  })

  if (!student) {
    redirect('/dashboard/student/choose-wing')
  }

  if (!student.roadmap) {
    redirect('/dashboard/student/create-roadmap')
  }

  const roadmap = student.roadmap

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning Roadmap</h1>
          <p className="text-gray-600 mt-2">Your personalized learning path</p>
        </div>

        {/* Status Card */}
        <Card className={`mb-6 ${
          roadmap.status === 'APPROVED' ? 'border-green-200 bg-green-50' :
          roadmap.status === 'PENDING_APPROVAL' ? 'border-yellow-200 bg-yellow-50' :
          roadmap.status === 'REJECTED' ? 'border-red-200 bg-red-50' :
          'border-gray-200'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {roadmap.status === 'APPROVED' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {roadmap.status === 'PENDING_APPROVAL' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
              {roadmap.status === 'REJECTED' && <XCircle className="w-5 h-5 text-red-600" />}
              Roadmap Status: {roadmap.status.replace('_', ' ')}
            </CardTitle>
            <CardDescription>
              {roadmap.status === 'APPROVED' && 'Your roadmap has been approved! You can now proceed with payment.'}
              {roadmap.status === 'PENDING_APPROVAL' && 'Your roadmap is awaiting mentor approval.'}
              {roadmap.status === 'REJECTED' && 'Your roadmap was rejected. Please contact your mentor for details.'}
              {roadmap.status === 'CHANGES_REQUESTED' && 'Your roadmap needs changes. Please review mentor comments.'}
            </CardDescription>
          </CardHeader>
          {roadmap.currentApproval && (
            <CardContent>
              {roadmap.currentApproval.comments && (
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-700">{roadmap.currentApproval.comments}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    - {roadmap.currentApproval.mentor.user.name}
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Roadmap Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Title</div>
                <div className="text-lg font-semibold text-gray-900">{roadmap.title}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Description</div>
                <div className="text-gray-700">{roadmap.description}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Learning Objectives</div>
                <div className="text-gray-700 whitespace-pre-line">{roadmap.learningObjectives}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Schedule & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Weekly Hours</div>
                <div className="text-lg font-semibold text-gray-900">{roadmap.weeklyHours}h/week</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Monthly Price</div>
                <div className="text-lg font-semibold text-gray-900">${roadmap.monthlyPrice}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Trainer</div>
                <div className="text-gray-700">{roadmap.trainer.user.name}</div>
                <div className="text-sm text-gray-500">{roadmap.trainer.user.email}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Practice Expectations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Practice Expectations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700 whitespace-pre-line">{roadmap.practiceExpectations}</div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        {roadmap.weeklySchedule && typeof roadmap.weeklySchedule === 'object' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(roadmap.weeklySchedule as Record<string, any>).map(([day, schedule]) => {
                  if (!schedule?.enabled) return null
                  return (
                    <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="capitalize font-medium">{day}</span>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {schedule.time && <span>{schedule.time}</span>}
                        {schedule.duration && <span>{schedule.duration} min</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {roadmap.status === 'APPROVED' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-green-800 font-semibold mb-4">
                  Your roadmap has been approved! Make a payment to start learning.
                </p>
                <Link
                  href="/dashboard/student/payments"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Make Payment
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6">
          <Link
            href="/dashboard/student"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

