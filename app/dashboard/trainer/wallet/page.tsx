import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Download, Clock } from 'lucide-react'
import WalletTransactions from '@/components/trainer/WalletTransactions'

export default async function TrainerWalletPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'TRAINER') {
    redirect('/login')
  }

  const trainer = await prisma.trainerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      wallet: {
        include: {
          transactions: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 50,
          },
        },
      },
    },
  })

  if (!trainer) {
    redirect('/dashboard/trainer')
  }

  // Create wallet if it doesn't exist
  let wallet = trainer.wallet
  if (!wallet) {
    wallet = await prisma.trainerWallet.create({
      data: {
        trainerId: trainer.id,
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-2">Manage your earnings and withdrawals</p>
        </div>

        {/* Wallet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                ${Number(wallet.balance).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-2">Ready to withdraw</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                ${Number(wallet.totalEarned).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-2">All-time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-600" />
                Total Withdrawn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                ${Number(wallet.totalWithdrawn).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-2">Withdrawal history</p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Status */}
        {wallet.isPaused && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Clock className="w-5 h-5" />
                Earnings Paused
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                Your earnings are currently paused due to disputed sessions. Please contact an administrator.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Withdrawal Section */}
        {Number(wallet.balance) > 0 && !wallet.isPaused && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>
                Withdraw your earnings to your bank account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Available balance: <span className="font-semibold">${Number(wallet.balance).toFixed(2)}</span>
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Request Withdrawal
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Withdrawals are processed within 3-5 business days
              </p>
            </CardContent>
          </Card>
        )}

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your earnings and withdrawal history</CardDescription>
          </CardHeader>
          <CardContent>
            <WalletTransactions transactions={wallet.transactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

