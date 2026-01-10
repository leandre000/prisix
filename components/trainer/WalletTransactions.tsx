'use client'

import { DollarSign, TrendingUp, Download } from 'lucide-react'
import { formatDateTime, formatCurrency } from '@/lib/utils'

interface Transaction {
  id: string
  type: string
  amount: number | string
  description: string | null
  createdAt: Date | string
}

interface WalletTransactionsProps {
  transactions: Transaction[]
}

export default function WalletTransactions({ transactions }: WalletTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const isEarning = transaction.type === 'PAYMENT'
        const isWithdrawal = transaction.type === 'WITHDRAWAL'

        return (
          <div
            key={transaction.id}
            className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isEarning ? 'bg-green-100 text-green-600' :
                isWithdrawal ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {isEarning ? (
                  <TrendingUp className="w-5 h-5" />
                ) : isWithdrawal ? (
                  <Download className="w-5 h-5" />
                ) : (
                  <DollarSign className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="font-semibold">
                  {transaction.description || transaction.type}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDateTime(transaction.createdAt)}
                </div>
              </div>
            </div>
            <div className={`text-lg font-bold ${
              isEarning ? 'text-green-600' :
              isWithdrawal ? 'text-red-600' :
              'text-gray-900'
            }`}>
              {isEarning ? '+' : isWithdrawal ? '-' : ''}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

