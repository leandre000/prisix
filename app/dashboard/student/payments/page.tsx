import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, CheckCircle2, XCircle, Clock } from 'lucide-react'
import PaymentForm from '@/components/student/PaymentForm'

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'STUDENT') {
    redirect('/login')
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      roadmap: true,
      payments: {
        orderBy: {
          createdAt: 'desc',
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

  if (student.roadmap.status !== 'APPROVED') {
    redirect('/dashboard/student/roadmap')
  }

  const activePayment = student.payments.find(p => p.isActive && new Date(p.endDate) >= new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your learning subscription</p>
        </div>

        {/* Active Payment Status */}
        {activePayment ? (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Active Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${Number(activePayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span>{new Date(activePayment.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span>{new Date(activePayment.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                No Active Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                You need an active payment to access learning sessions. Make a payment below to start.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Payment Form */}
        {!activePayment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Make Payment
              </CardTitle>
              <CardDescription>
                Monthly subscription: ${Number(student.roadmap.monthlyPrice)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm roadmapId={student.roadmap.id} amount={Number(student.roadmap.monthlyPrice)} />
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        {student.payments.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">${Number(payment.amount)}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.isActive ? 'bg-green-100 text-green-800' :
                        payment.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.isActive ? 'Active' : payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

