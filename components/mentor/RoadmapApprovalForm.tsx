'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle, Clock, Target, DollarSign, Users, Calendar } from 'lucide-react'

interface RoadmapApprovalFormProps {
  roadmap: any
  mentorId: string
}

export default function RoadmapApprovalForm({ roadmap, mentorId }: RoadmapApprovalFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | 'request-changes' | null>(null)
  const [comments, setComments] = useState('')

  const handleApprove = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/roadmaps/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: roadmap.id,
          mentorId,
          status: 'APPROVED',
          comments: comments || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to approve roadmap')
        setLoading(false)
        return
      }

      router.push('/dashboard/mentor')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!comments.trim()) {
      setError('Please provide a reason for rejection')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/roadmaps/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: roadmap.id,
          mentorId,
          status: 'REJECTED',
          comments,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to reject roadmap')
        setLoading(false)
        return
      }

      router.push('/dashboard/mentor')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleRequestChanges = async () => {
    if (!comments.trim()) {
      setError('Please provide details about required changes')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/roadmaps/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: roadmap.id,
          mentorId,
          status: 'CHANGES_REQUESTED',
          comments,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to request changes')
        setLoading(false)
        return
      }

      router.push('/dashboard/mentor')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Roadmap</h1>
        <p className="text-gray-600 mt-2">Approve, reject, or request changes to this learning roadmap</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Roadmap Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Title</div>
              <div className="text-lg font-semibold text-gray-900">{roadmap.title}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Description</div>
              <div className="text-gray-700">{roadmap.description}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Learning Objectives</div>
              <div className="text-gray-700 whitespace-pre-line">{roadmap.learningObjectives}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Practice Expectations</div>
              <div className="text-gray-700 whitespace-pre-line">{roadmap.practiceExpectations}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Student</div>
              <div className="text-gray-900">{roadmap.student.user.name}</div>
              <div className="text-sm text-gray-600">{roadmap.student.user.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Trainer</div>
              <div className="text-gray-900">{roadmap.trainer.user.name}</div>
              <div className="text-sm text-gray-600">{roadmap.trainer.user.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Weekly Hours</div>
              <div className="text-lg font-semibold text-gray-900">{roadmap.weeklyHours}h</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Monthly Price</div>
              <div className="text-lg font-semibold text-gray-900">${roadmap.monthlyPrice}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      {roadmap.weeklySchedule && typeof roadmap.weeklySchedule === 'object' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(roadmap.weeklySchedule as Record<string, any>).map(([day, schedule]) => {
                if (!schedule?.enabled) return null
                return (
                  <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="capitalize font-medium">{day}</span>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {schedule.time && <span>{schedule.time}</span>}
                      {schedule.duration && <span>{schedule.duration} min</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval History */}
      {roadmap.approvals && roadmap.approvals.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roadmap.approvals.map((approval: any) => (
                <div key={approval.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{approval.mentor.user.name}</div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      approval.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      approval.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {approval.status.replace('_', ' ')}
                    </span>
                  </div>
                  {approval.comments && (
                    <p className="text-sm text-gray-600">{approval.comments}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(approval.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Decision</CardTitle>
          <CardDescription>
            Review the roadmap and make your decision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Required for rejection or changes)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add your comments here..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={handleRequestChanges}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Request Changes
            </Button>
            <Button
              onClick={handleReject}
              disabled={loading}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/mentor')}
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

