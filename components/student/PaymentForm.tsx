'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CreditCard, Lock } from 'lucide-react'

interface PaymentFormProps {
  roadmapId: string
  amount: number
}

export default function PaymentForm({ roadmapId, amount }: PaymentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // In production, integrate with Stripe Checkout or Payment Element
      // For now, simulate payment processing
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId,
          paymentMethod: 'stripe',
          paymentGatewayId: `pay_${Date.now()}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Payment failed')
        setLoading(false)
        return
      }

      // Redirect to success page or dashboard
      router.push('/dashboard/student')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Monthly Subscription</span>
          <span className="text-2xl font-bold text-gray-900">${amount}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Payment will be processed securely. You'll have access to learning sessions for one month.
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Lock className="w-4 h-4" />
          Secure payment processing
        </div>
      </div>

      {/* In production, integrate Stripe Payment Element here */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a demo payment. In production, integrate with Stripe Checkout or Payment Element
          for secure payment processing.
        </p>
      </div>

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {loading ? (
          'Processing...'
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${amount}
          </>
        )}
      </Button>
    </div>
  )
}

