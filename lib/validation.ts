/**
 * Input Validation Utilities
 * Server-side validation for all inputs
 */

import { z } from 'zod'
import { ValidationError } from './errors'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100)

// User validation
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Roadmap validation
export const roadmapSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  learningObjectives: z.string().min(10, 'Learning objectives are required'),
  weeklyHours: z.number().min(4.5, 'Weekly hours must be at least 4.5'),
  practiceExpectations: z.string().min(10, 'Practice expectations are required'),
  monthlyPrice: z.number().positive('Monthly price must be positive'),
  weeklySchedule: z.record(z.any()),
})

// Session validation
export const sessionSchema = z.object({
  scheduledAt: z.string().datetime(),
  duration: z.number().int().min(15).max(480), // 15 minutes to 8 hours
  meetingLink: z.string().url('Invalid meeting link'),
})

// Payment validation
export const paymentSchema = z.object({
  roadmapId: z.string().min(1, 'Roadmap ID is required'),
  paymentMethod: z.string().optional(),
  paymentGatewayId: z.string().optional(),
})

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fields: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fields[err.path.join('.')] = err.message
        }
      })
      throw new ValidationError('Validation failed', fields)
    }
    throw error
  }
}

