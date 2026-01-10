import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react'

export default async function WingAdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'WING_ADMIN') {
    redirect('/login')
  }

  const wingAdmin = await prisma.wingAdminProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      wing: {
        include: {
          students: {
            include: {
              user: true,
              payments: {
                where: {
                  isActive: true,
                },
              },
            },
          },
          trainers: {
            include: {
              user: true,
            },
          },
          wallet: true,
        },
      },
    },
  })

  if (!wingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Wing Admin Profile Not Found</h1>
          <p className="text-gray-600">Please contact an administrator.</p>
        </div>
      </div>
    )
  }

  const wing = wingAdmin.wing
  const activeStudents = wing.students.filter(
    (student) => student.payments.length > 0 && student.payments[0].isActive
  )

  // Get wallet or create it
  let wallet = wing.wallet
  if (!wallet) {
    wallet = await prisma.wingWallet.create({
      data: {
        wingId: wing.id,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wing Administration</h1>
          <p className="text-gray-600 mt-2">{wing.name} - Management Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Active Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{activeStudents.length}</div>
              <p className="text-sm text-gray-600 mt-1">With active payments</p>
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
              <div className="text-3xl font-bold text-gray-900">{wing.trainers.length}</div>
              <p className="text-sm text-gray-600 mt-1">Active trainers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Wing Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${Number(wallet.balance).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-1">Available balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                Total Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${Number(wallet.totalReceived).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-1">All-time revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Students */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Students</CardTitle>
            <CardDescription>Students with active learning subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            {activeStudents.length > 0 ? (
              <div className="space-y-3">
                {activeStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">{student.user.name}</div>
                      <div className="text-sm text-gray-600">{student.user.email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Payment active until {new Date(student.payments[0].endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No active students</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trainers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trainers</CardTitle>
            <CardDescription>Manage your wing's trainers</CardDescription>
          </CardHeader>
          <CardContent>
            {wing.trainers.length > 0 ? (
              <div className="space-y-3">
                {wing.trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">{trainer.user.name}</div>
                      <div className="text-sm text-gray-600">{trainer.user.email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Available: {trainer.weeklyHoursAvailable}h/week • 
                        Capacity: {trainer.currentStudentCount}/{trainer.maxStudents} students
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {trainer.currentStudentCount >= trainer.maxStudents && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Full
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No trainers assigned</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wallet Management */}
        <Card>
          <CardHeader>
            <CardTitle>Wing Wallet</CardTitle>
            <CardDescription>Manage wing finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${Number(wallet.balance).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Total Received</span>
                  <span className="text-gray-700">${Number(wallet.totalReceived).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Total Withdrawn</span>
                  <span className="text-gray-700">${Number(wallet.totalWithdrawn).toFixed(2)}</span>
                </div>
              </div>
              {wallet.canWithdraw && Number(wallet.balance) > 0 ? (
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Request Withdrawal
                </button>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  {!wallet.canWithdraw 
                    ? 'Withdrawals are only allowed when learning is active in the wing.'
                    : 'No funds available for withdrawal.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

