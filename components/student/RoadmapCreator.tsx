'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Clock, Target, DollarSign, AlertCircle } from 'lucide-react'

interface Trainer {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  weeklyHoursAvailable: number
  maxStudents: number
  currentStudentCount: number
  canAccept: boolean
  maxCapacity: number
}

interface Student {
  id: string
  wing: {
    id: string
    name: string
  }
}

interface RoadmapCreatorProps {
  student: Student
  trainers: Trainer[]
}

export default function RoadmapCreator({ student, trainers }: RoadmapCreatorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    trainerId: '',
    title: '',
    description: '',
    learningObjectives: '',
    weeklyHours: 4.5,
    practiceExpectations: '',
    monthlyPrice: '',
    weeklySchedule: {
      monday: { enabled: false, time: '', duration: 60 },
      tuesday: { enabled: false, time: '', duration: 60 },
      wednesday: { enabled: false, time: '', duration: 60 },
      thursday: { enabled: false, time: '', duration: 60 },
      friday: { enabled: false, time: '', duration: 60 },
      saturday: { enabled: false, time: '', duration: 60 },
      sunday: { enabled: false, time: '', duration: 60 },
    },
  })

  const selectedTrainer = trainers.find(t => t.id === formData.trainerId)
  const totalWeeklyHours = Object.values(formData.weeklySchedule)
    .filter(day => day.enabled)
    .reduce((sum, day) => sum + (day.duration / 60), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.trainerId) {
      setError('Please select a trainer')
      return
    }

    if (!selectedTrainer?.canAccept) {
      setError('Selected trainer is at full capacity')
      return
    }

    if (totalWeeklyHours < 4.5) {
      setError('Weekly learning time must be at least 4.5 hours')
      return
    }

    if (!formData.title || !formData.description || !formData.learningObjectives) {
      setError('Please fill in all required fields')
      return
    }

    if (!formData.monthlyPrice || parseFloat(formData.monthlyPrice) <= 0) {
      setError('Please enter a valid monthly price')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/roadmaps/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          trainerId: formData.trainerId,
          wingId: student.wing.id,
          title: formData.title,
          description: formData.description,
          learningObjectives: formData.learningObjectives,
          practiceExpectations: formData.practiceExpectations,
          weeklySchedule: formData.weeklySchedule,
          weeklyHours: totalWeeklyHours,
          monthlyPrice: parseFloat(formData.monthlyPrice),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create roadmap')
        setLoading(false)
        return
      }

      router.push('/dashboard/student/roadmap')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Learning Roadmap</h1>
        <p className="text-gray-600">
          Work with your trainer to design a personalized learning path. This roadmap is unique to you.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trainer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Your Trainer
            </CardTitle>
            <CardDescription>
              Choose a trainer who will guide your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainers.map((trainer) => (
                <label
                  key={trainer.id}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.trainerId === trainer.id
                      ? 'border-blue-600 bg-blue-50'
                      : trainer.canAccept
                      ? 'border-gray-200 hover:border-blue-300'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <input
                    type="radio"
                    name="trainerId"
                    value={trainer.id}
                    checked={formData.trainerId === trainer.id}
                    onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                    disabled={!trainer.canAccept}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{trainer.user.name}</div>
                    <div className="text-sm text-gray-600">{trainer.user.email}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Available: {trainer.weeklyHoursAvailable}h/week • 
                      Capacity: {trainer.currentStudentCount}/{trainer.maxCapacity} students
                    </div>
                    {!trainer.canAccept && (
                      <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        At full capacity
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Roadmap Details
            </CardTitle>
            <CardDescription>
              Define your learning objectives and expectations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Full-Stack Web Development Roadmap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your learning roadmap..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives *
              </label>
              <textarea
                value={formData.learningObjectives}
                onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What will you learn? List your objectives..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Practice Expectations *
              </label>
              <textarea
                value={formData.practiceExpectations}
                onChange={(e) => setFormData({ ...formData, practiceExpectations: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What practice work is expected? Projects, exercises, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Plan your weekly learning sessions (Minimum 4.5 hours required)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(formData.weeklySchedule).map(([day, schedule]) => (
                <div key={day} className="flex items-center gap-4">
                  <label className="flex items-center gap-2 w-24">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weeklySchedule: {
                            ...formData.weeklySchedule,
                            [day]: { ...schedule, enabled: e.target.checked },
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span className="capitalize font-medium">{day}</span>
                  </label>
                  {schedule.enabled && (
                    <>
                      <input
                        type="time"
                        value={schedule.time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weeklySchedule: {
                              ...formData.weeklySchedule,
                              [day]: { ...schedule, time: e.target.value },
                            },
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={schedule.duration}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weeklySchedule: {
                              ...formData.weeklySchedule,
                              [day]: { ...schedule, duration: parseInt(e.target.value) },
                            },
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="30">30 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                        <option value="120">120 min</option>
                      </select>
                    </>
                  )}
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    Total Weekly Hours:
                  </span>
                  <span className={`text-lg font-bold ${
                    totalWeeklyHours >= 4.5 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {totalWeeklyHours.toFixed(1)}h
                  </span>
                </div>
                {totalWeeklyHours < 4.5 && (
                  <p className="text-xs text-red-600 mt-1">
                    Minimum 4.5 hours required
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Monthly Pricing
            </CardTitle>
            <CardDescription>
              Set the monthly price for this learning roadmap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/student')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? 'Creating...' : 'Create Roadmap'}
          </Button>
        </div>
      </form>
    </div>
  )
}

