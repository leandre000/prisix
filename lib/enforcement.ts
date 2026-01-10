/**
 * Business Logic Enforcement Functions
 * These functions enforce non-negotiable system rules at the application level
 */

import { prisma } from './prisma'
import { calculateTrainerCapacity } from './utils'

/**
 * Check if student can start learning
 * Rule: Learning can only begin after roadmap approval and payment
 */
export async function canStudentStartLearning(studentId: string): Promise<boolean> {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      roadmap: true,
      payments: {
        where: {
          isActive: true,
        },
      },
    },
  })

  if (!student) return false

  // Must have chosen wing
  if (!student.hasChosenWing) return false

  // Must have read guidance
  if (!student.hasReadGuidance) return false

  // Must have met trainer
  if (!student.hasMetTrainer) return false

  // Must have approved roadmap
  if (!student.roadmap || student.roadmap.status !== 'APPROVED') return false

  // Must have active payment
  if (student.payments.length === 0 || !student.payments[0].isActive) return false

  return true
}

/**
 * Check if trainer can accept more students
 * Rule: Cannot exceed declared capacity
 */
export async function canTrainerAcceptStudent(trainerId: string): Promise<{
  canAccept: boolean
  currentCount: number
  maxCapacity: number
  reason?: string
}> {
  const trainer = await prisma.trainerProfile.findUnique({
    where: { id: trainerId },
    include: {
      roadmapsCreated: {
        where: {
          status: 'APPROVED',
        },
        include: {
          student: {
            include: {
              payments: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!trainer) {
    return {
      canAccept: false,
      currentCount: 0,
      maxCapacity: 0,
      reason: 'Trainer not found',
    }
  }

  // Count active students (with approved roadmap and active payment)
  const activeStudents = trainer.roadmapsCreated.filter(
    (roadmap) => roadmap.student.payments.length > 0 && roadmap.student.payments[0].isActive
  )

  const currentCount = activeStudents.length
  const maxCapacity = calculateTrainerCapacity(trainer.weeklyHoursAvailable, 4.5)

  return {
    canAccept: currentCount < maxCapacity,
    currentCount,
    maxCapacity,
    reason: currentCount >= maxCapacity ? 'Trainer at capacity' : undefined,
  }
}

/**
 * Check if session counts toward weekly hours
 * Rule: Both trainer and student must confirm
 */
export function doesSessionCountTowardHours(
  trainerConfirmed: string,
  studentConfirmed: string
): boolean {
  return trainerConfirmed === 'CONFIRMED' && studentConfirmed === 'CONFIRMED'
}

/**
 * Calculate automatic payment distribution
 * Rule: 35% to Wing, 65% to Umbrella (immutable)
 */
export function calculatePaymentDistribution(amount: number): {
  wingAmount: number
  umbrellaAmount: number
} {
  const wingAmount = amount * 0.35
  const umbrellaAmount = amount * 0.65

  return {
    wingAmount: Math.round(wingAmount * 100) / 100, // Round to 2 decimals
    umbrellaAmount: Math.round(umbrellaAmount * 100) / 100,
  }
}

/**
 * Check if roadmap can be created
 * Rule: No two students can share the same roadmap
 */
export async function canCreateRoadmap(studentId: string): Promise<{
  canCreate: boolean
  reason?: string
}> {
  const existingRoadmap = await prisma.roadmap.findUnique({
    where: { studentId },
  })

  if (existingRoadmap) {
    return {
      canCreate: false,
      reason: 'Student already has a roadmap',
    }
  }

  return { canCreate: true }
}

/**
 * Check if student can progress to next phase
 * Rule: Only mentor approval unlocks progression
 */
export async function canStudentProgress(
  roadmapId: string,
  targetPhase: number
): Promise<{
  canProgress: boolean
  reason?: string
}> {
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: roadmapId },
    include: {
      progressions: {
        where: {
          toPhase: targetPhase,
          approved: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  })

  if (!roadmap) {
    return {
      canProgress: false,
      reason: 'Roadmap not found',
    }
  }

  if (roadmap.isLocked) {
    return {
      canProgress: false,
      reason: 'Roadmap is locked',
    }
  }

  // Check if there's an approved progression to the target phase
  if (roadmap.progressions.length === 0) {
    return {
      canProgress: false,
      reason: 'No mentor approval for this progression',
    }
  }

  return { canProgress: true }
}

/**
 * Check if wing can withdraw funds
 * Rule: Withdrawals allowed only if learning is active
 */
export async function canWingWithdraw(wingId: string): Promise<{
  canWithdraw: boolean
  reason?: string
}> {
  const wing = await prisma.wing.findUnique({
    where: { id: wingId },
    include: {
      students: {
        include: {
          payments: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  })

  if (!wing) {
    return {
      canWithdraw: false,
      reason: 'Wing not found',
    }
  }

  // Check if there are active students with active payments
  const hasActiveLearning = wing.students.some(
    (student) => student.payments.length > 0 && student.payments[0].isActive
  )

  if (!hasActiveLearning) {
    return {
      canWithdraw: false,
      reason: 'No active learning in this wing',
    }
  }

  return { canWithdraw: true }
}

