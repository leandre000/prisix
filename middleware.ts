import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Role-based route protection
    const role = token.role as string

    // Student routes
    if (path.startsWith('/dashboard/student') && role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Trainer routes
    if (path.startsWith('/dashboard/trainer') && role !== 'TRAINER') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Mentor routes
    if (path.startsWith('/dashboard/mentor') && role !== 'MASTER_MENTOR') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Wing Admin routes
    if (path.startsWith('/dashboard/wing-admin') && role !== 'WING_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Umbrella Admin routes
    if (path.startsWith('/dashboard/umbrella-admin') && role !== 'UMBRELLA_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*',
  ],
}

