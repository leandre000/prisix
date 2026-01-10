'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Video, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface SessionConfirmationProps {
  session: any
  trainerId: string
}

export default function SessionConfirmation({ session, trainerId }: SessionConfirmationProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(session.trainerConfirmation === 'CONFIRMED')

  const handleConfirm = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/sessions/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to confirm session')
        setLoading(false)
        return
      }

      setConfirmed(true)
      if (data.bothConfirmed) {
        // Both confirmed, redirect after a moment
        setTimeout(() => {
          router.push('/dashboard/trainer')
        }, 2000)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Confirm Session</h1>
        <p className="text-gray-600 mt-2">Confirm that this session took place</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {confirmed && session.studentConfirmation === 'CONFIRMED' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Both you and the student have confirmed. This session counts toward weekly hours.</span>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-semibold">Student</div>
              <div className="text-sm text-gray-600">{session.student.user.name}</div>
              <div className="text-xs text-gray-500">{session.student.user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-semibold">Scheduled Time</div>
              <div className="text-sm text-gray-600">{formatDateTime(session.scheduledAt)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-semibold">Duration</div>
              <div className="text-sm text-gray-600">{session.duration} minutes</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-semibold">Meeting Link</div>
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {session.meetingLink}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Confirmation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Your Confirmation</span>
              {confirmed ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Confirmed
                </span>
              ) : (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Pending
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Student Confirmation</span>
              {session.studentConfirmation === 'CONFIRMED' ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Confirmed
                </span>
              ) : (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Pending
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {!confirmed && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Important
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">
              Please confirm that this session took place. The session will only count toward weekly hours
              if both you and the student confirm attendance.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/trainer')}
        >
          Back to Dashboard
        </Button>
        {!confirmed && (
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Confirming...' : 'Confirm Session'}
          </Button>
        )}
      </div>
    </div>
  )
}

