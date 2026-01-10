import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, DollarSign, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { calculateTrainerCapacity } from '@/lib/utils'

export default async function TrainerDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'TRAINER') {
    redirect('/login')
  }

  const trainer = await prisma.trainerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      wing: true,
      roadmapsCreated: {
        where: {
          status: 'APPROVED',
        },
        include: {
          student: {
            include: {
              user: true,
              payments: {
                where: {
                  isActive: true,
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
        take: 10,
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      },
      wallet: true,
    },
  })

  if (!trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trainer Profile Not Found</h1>
          <p className="text-gray-600">Please contact an administrator.</p>
        </div>
      </div>
    )
  }

  // Calculate active students (with approved roadmap and active payment)
  const activeStudents = trainer.roadmapsCreated.filter(
    (roadmap) => roadmap.student.payments.length > 0 && roadmap.student.payments[0].isActive
  )

  const maxCapacity = calculateTrainerCapacity(trainer.weeklyHoursAvailable, 4.5)
  const capacityPercentage = maxCapacity > 0 ? (activeStudents.length / maxCapacity) * 100 : 0

  // Calculate this week's scheduled hours
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const weeklySessions = trainer.sessions.filter(s => {
    const sessionDate = new Date(s.scheduledAt)
    return sessionDate >= weekStart && sessionDate < weekEnd
  })

  const weeklyHours = weeklySessions.reduce((sum, s) => sum + (s.duration / 60), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {session.user.name}!</h1>
          <p className="text-gray-600 mt-2">Trainer Dashboard - {trainer.wing.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{activeStudents.length}</div>
              <p className="text-sm text-gray-600 mt-1">
                of {maxCapacity} max capacity
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    capacityPercentage >= 90 ? 'bg-red-600' :
                    capacityPercentage >= 70 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Weekly Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{weeklyHours.toFixed(1)}h</div>
              <p className="text-sm text-gray-600 mt-1">
                Available: {trainer.weeklyHoursAvailable}h/week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{trainer.sessions.length}</div>
              <p className="text-sm text-gray-600 mt-1">Sessions this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${trainer.wallet ? Number(trainer.wallet.balance).toFixed(2) : '0.00'}
              </div>
              <p className="text-sm text-gray-600 mt-1">Available balance</p>
            </CardContent>
          </Card>
        </div>

        {/* Capacity Warning */}
        {capacityPercentage >= 90 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                Near Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                You are at {Math.round(capacityPercentage)}% capacity. Consider reducing availability or requesting more hours.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Active Students */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Students</CardTitle>
            <CardDescription>
              Students with approved roadmaps and active payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeStudents.length > 0 ? (
              <div className="space-y-3">
                {activeStudents.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{roadmap.student.user.name}</div>
                        <div className="text-sm text-gray-600">{roadmap.student.user.email}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Roadmap: {roadmap.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Weekly: {roadmap.weeklyHours}h | Price: ${roadmap.monthlyPrice}/month
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/trainer/student/${roadmap.studentId}`}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No active students assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled sessions for this week</CardDescription>
          </CardHeader>
          <CardContent>
            {trainer.sessions.length > 0 ? (
              <div className="space-y-3">
                {trainer.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold">{session.student.user.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                          {new Date(session.scheduledAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Duration: {session.duration} minutes
                        </div>
                        <div className="mt-2">
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                          >
                            Join Meeting →
                          </a>
                        </div>
                      </div>
                      <div className="ml-4">
                        {session.trainerConfirmation === 'CONFIRMED' && session.studentConfirmation === 'CONFIRMED' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmed
                          </span>
                        ) : (
                          <Link
                            href={`/dashboard/trainer/sessions/${session.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                          >
                            Confirm
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No upcoming sessions scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

