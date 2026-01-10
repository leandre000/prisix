import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const role = session.user.role

  // Redirect to role-specific dashboard
  switch (role) {
    case 'STUDENT':
      redirect('/dashboard/student')
    case 'TRAINER':
      redirect('/dashboard/trainer')
    case 'MASTER_MENTOR':
      redirect('/dashboard/mentor')
    case 'WING_ADMIN':
      redirect('/dashboard/wing-admin')
    case 'UMBRELLA_ADMIN':
      redirect('/dashboard/umbrella-admin')
    default:
      redirect('/login')
  }
}

