/**
 * Audit Logging System
 * Logs all critical actions for compliance and dispute resolution
 */

import { prisma } from './prisma'
import { ActivityType } from '@prisma/client'

export async function logActivity(
  userId: string,
  type: ActivityType,
  description: string,
  metadata?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        type,
        description,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    // Don't throw - audit logging should never break the main flow
    console.error('Failed to log activity:', error)
  }
}

export async function getActivityLogs(
  userId?: string,
  type?: ActivityType,
  limit: number = 100
) {
  return prisma.activityLog.findMany({
    where: {
      ...(userId && { userId }),
      ...(type && { type }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })
}

