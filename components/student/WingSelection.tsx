'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, BookOpen, Users, CheckCircle2 } from 'lucide-react'

interface Wing {
  id: string
  name: string
  slug: string
  description: string | null
  guidanceDocument: string | null
}

interface WingSelectionProps {
  wings: Wing[]
}

export default function WingSelection({ wings }: WingSelectionProps) {
  const router = useRouter()
  const [selectedWingId, setSelectedWingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSelectWing = async (wingId: string) => {
    setSelectedWingId(wingId)
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/student/choose-wing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to select wing')
        setLoading(false)
        return
      }

      // Redirect to guidance document or next step
      if (data.wing.guidanceDocument) {
        router.push(`/dashboard/student/read-guidance?wingId=${wingId}`)
      } else {
        router.push('/dashboard/student')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {wings.map((wing) => (
          <Card
            key={wing.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedWingId === wing.id ? 'ring-2 ring-blue-600' : ''
            }`}
            onClick={() => !loading && setSelectedWingId(wing.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{wing.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {wing.slug}
                    </CardDescription>
                  </div>
                </div>
                {selectedWingId === wing.id && (
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {wing.description || 'No description available.'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Active Learning</span>
                </div>
                {wing.guidanceDocument && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Guidance Available</span>
                  </div>
                )}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectWing(wing.id)
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading && selectedWingId === wing.id
                  ? 'Selecting...'
                  : 'Select This Wing'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {wings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No wings available at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

