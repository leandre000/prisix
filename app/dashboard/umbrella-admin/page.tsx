import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, DollarSign, TrendingUp, Activity } from 'lucide-react'

export default async function UmbrellaAdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'UMBRELLA_ADMIN') {
    redirect('/login')
  }

  // Get all wings
  const wings = await prisma.wing.findMany({
    include: {
      students: {
        include: {
          payments: {
            where: {
              isActive: true,
            },
          },
        },
      },
      trainers: true,
      wallet: true,
    },
  })

  // Get umbrella wallet
  let umbrellaWallet = await prisma.umbrellaWallet.findFirst()
  if (!umbrellaWallet) {
    umbrellaWallet = await prisma.umbrellaWallet.create({
      data: {},
    })
  }

  // Calculate totals
  const totalStudents = wings.reduce((sum, wing) => 
    sum + wing.students.filter(s => s.payments.length > 0 && s.payments[0].isActive).length, 0
  )
  const totalTrainers = wings.reduce((sum, wing) => sum + wing.trainers.length, 0)
  const totalWingRevenue = wings.reduce((sum, wing) => 
    sum + Number(wing.wallet?.totalReceived || 0), 0
  )

  // Get recent activity
  const recentActivity = await prisma.activityLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Umbrella Administration</h1>
          <p className="text-gray-600 mt-2">Global system overview and management</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Wings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{wings.length}</div>
              <p className="text-sm text-gray-600 mt-1">Active wings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalStudents}</div>
              <p className="text-sm text-gray-600 mt-1">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Trainers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalTrainers}</div>
              <p className="text-sm text-gray-600 mt-1">Total trainers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                Umbrella Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${Number(umbrellaWallet.balance).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-1">Available balance</p>
            </CardContent>
          </Card>
        </div>

        {/* Wings Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Wings Overview</CardTitle>
            <CardDescription>All wings under the Umbrella</CardDescription>
          </CardHeader>
          <CardContent>
            {wings.length > 0 ? (
              <div className="space-y-3">
                {wings.map((wing) => {
                  const activeStudents = wing.students.filter(
                    s => s.payments.length > 0 && s.payments[0].isActive
                  )
                  return (
                    <div
                      key={wing.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-lg">{wing.name}</div>
                          <div className="text-sm text-gray-600">{wing.description || 'No description'}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          wing.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {wing.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Students:</span>{' '}
                          <span className="font-semibold">{activeStudents.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Trainers:</span>{' '}
                          <span className="font-semibold">{wing.trainers.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Wallet:</span>{' '}
                          <span className="font-semibold">
                            ${Number(wing.wallet?.balance || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No wings created yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>System-wide activity log</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-3 border border-gray-200 rounded-lg text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{activity.user.name}</span>
                        <span className="text-gray-500 ml-2">({activity.user.role})</span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gray-700 mt-1">{activity.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

