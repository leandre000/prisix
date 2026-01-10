import Link from 'next/link'
import { Shield } from 'lucide-react'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Register - Umbrella Academy',
  description: 'Create your Umbrella Academy account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Umbrella Academy
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600">Join the future of personalized learning</p>
        </div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

