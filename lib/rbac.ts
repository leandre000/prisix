import { UserRole } from '@prisma/client'

export type Role = UserRole

export const ROLES = {
  STUDENT: 'STUDENT' as const,
  TRAINER: 'TRAINER' as const,
  MASTER_MENTOR: 'MASTER_MENTOR' as const,
  WING_ADMIN: 'WING_ADMIN' as const,
  UMBRELLA_ADMIN: 'UMBRELLA_ADMIN' as const,
}

export function hasRole(userRole: string | undefined, requiredRole: Role): boolean {
  if (!userRole) return false
  return userRole === requiredRole
}

export function hasAnyRole(userRole: string | undefined, requiredRoles: Role[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole as Role)
}

export function canAccessWing(userWingId: string | null | undefined, targetWingId: string): boolean {
  // Umbrella admins can access all wings
  // Wing admins can only access their own wing
  return userWingId === targetWingId
}

export function requireRole(userRole: string | undefined, requiredRole: Role): void {
  if (!hasRole(userRole, requiredRole)) {
    throw new Error(`Access denied. Required role: ${requiredRole}`)
  }
}

export function requireAnyRole(userRole: string | undefined, requiredRoles: Role[]): void {
  if (!hasAnyRole(userRole, requiredRoles)) {
    throw new Error(`Access denied. Required one of: ${requiredRoles.join(', ')}`)
  }
}

