import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, CheckCircle2, AlertCircle, Video } from 'lucide-react'
import SessionList from '@/components/student/SessionList'

export default async function StudentSessionsPage() {
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
        },
      },
      sessions: {
        include: {
          trainer: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          scheduledAt: 'desc',
        },
      },
    },
  })

  if (!student || !student.roadmap) {
    redirect('/dashboard/student')
  }

  // Calculate weekly hours
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const weeklySessions = student.sessions.filter(s => {
    const sessionDate = new Date(s.scheduledAt)
    return sessionDate >= weekStart && sessionDate < weekEnd && s.countsTowardHours
  })

  const weeklyHours = weeklySessions.reduce((sum, s) => sum + (s.duration / 60), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">View and manage your learning sessions</p>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{weeklyHours.toFixed(1)}h</div>
              <p className="text-sm text-gray-600 mt-1">
                {weeklySessions.length} confirmed sessions
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Required: {student.roadmap.weeklyHours}h/week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{student.sessions.length}</div>
              <p className="text-sm text-gray-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Trainer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900">{student.roadmap.trainer.user.name}</div>
              <p className="text-sm text-gray-600 mt-1">{student.roadmap.trainer.user.email}</p>
            </CardContent>
          </Card>
        </div>

        <SessionList sessions={student.sessions} studentId={student.id} />
      </div>
    </div>
  )
}

