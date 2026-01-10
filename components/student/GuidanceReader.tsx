'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle2, ArrowRight, Download } from 'lucide-react'

interface Wing {
  id: string
  name: string
  description: string | null
  guidanceDocument: string | null
}

interface GuidanceReaderProps {
  wing: Wing
  studentId: string
  hasReadGuidance: boolean
}

export default function GuidanceReader({ wing, studentId, hasReadGuidance }: GuidanceReaderProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasRead, setHasRead] = useState(hasReadGuidance)

  const handleMarkAsRead = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/student/mark-guidance-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to mark guidance as read')
        setLoading(false)
        return
      }

      setHasRead(true)
      router.push('/dashboard/student/create-roadmap')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {wing.name} - Guidance Document
        </h1>
        <p className="text-gray-600">
          Please read this document carefully before proceeding with your learning journey.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            About {wing.name}
          </CardTitle>
          <CardDescription>{wing.description || 'No description available.'}</CardDescription>
        </CardHeader>
        <CardContent>
          {wing.guidanceDocument ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold">Guidance Document</div>
                    <div className="text-sm text-gray-600">PDF Document</div>
                  </div>
                </div>
                <a
                  href={wing.guidanceDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Please read the entire guidance document before proceeding.
                  This document contains important information about the wing's learning approach,
                  expectations, and culture.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Guidance document is not yet available. Please contact your wing administrator.
              </p>
            </div>
          )}

          {hasRead && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                You have marked this guidance as read.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/student')}
        >
          Back to Dashboard
        </Button>
        {wing.guidanceDocument && (
          <Button
            onClick={handleMarkAsRead}
            disabled={loading || hasRead}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              'Processing...'
            ) : hasRead ? (
              <>
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                I Have Read the Guidance
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

