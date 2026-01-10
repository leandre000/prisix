'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Video, ExternalLink } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Session {
  id: string
  scheduledAt: Date | string
  duration: number
  meetingLink: string
  status: string
  trainerConfirmation: string
  studentConfirmation: string
  countsTowardHours: boolean
  trainer: {
    user: {
      name: string
      email: string
    }
  }
}

interface SessionListProps {
  sessions: Session[]
  studentId: string
}

export default function SessionList({ sessions, studentId }: SessionListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleConfirm = async (sessionId: string) => {
    setLoading(sessionId)
    setError('')

    try {
      const response = await fetch('/api/sessions/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to confirm session')
        setLoading(null)
        return
      }

      // Reload page to show updated status
      window.location.reload()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(null)
    }
  }

  const getStatusBadge = (session: Session) => {
    if (session.status === 'COMPLETED' && session.countsTowardHours) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Confirmed
        </span>
      )
    }
    if (session.status === 'DISPUTED') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Disputed
        </span>
      )
    }
    if (session.trainerConfirmation === 'CONFIRMED' && session.studentConfirmation === 'PENDING') {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          Awaiting Your Confirmation
        </span>
      )
    }
    if (session.studentConfirmation === 'CONFIRMED' && session.trainerConfirmation === 'PENDING') {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          Awaiting Trainer Confirmation
        </span>
      )
    }
    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
        Scheduled
      </span>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => {
                const sessionDate = new Date(session.scheduledAt)
                const isPast = sessionDate < new Date()
                const needsConfirmation = isPast && 
                  session.status === 'SCHEDULED' && 
                  session.studentConfirmation === 'PENDING'

                return (
                  <div
                    key={session.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            Session with {session.trainer.user.name}
                          </h3>
                          {getStatusBadge(session)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDateTime(session.scheduledAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {session.duration} minutes
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              Join Meeting
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        {session.countsTowardHours && (
                          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Counts toward weekly hours
                          </div>
                        )}
                      </div>
                      {needsConfirmation && (
                        <Button
                          onClick={() => handleConfirm(session.id)}
                          disabled={loading === session.id}
                          className="ml-4 bg-blue-600 hover:bg-blue-700"
                        >
                          {loading === session.id ? 'Confirming...' : 'Confirm Attendance'}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No sessions scheduled yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

