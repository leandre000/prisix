import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Umbrella Academy - Personalized Learning Management System',
  description: 'Production-ready LMS with enforcement-based learning, guaranteed trainer-student time, and mentor-driven progression. Join the future of personalized education.',
  keywords: ['LMS', 'Learning Management System', 'Personalized Learning', 'Online Education', 'Training Platform'],
  authors: [{ name: 'Umbrella Academy' }],
  creator: 'Umbrella Academy',
  publisher: 'Umbrella Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://umbrella-academy.com'),
  openGraph: {
    title: 'Umbrella Academy - Personalized Learning Management System',
    description: 'Production-ready LMS with enforcement-based learning and guaranteed trainer-student time.',
    url: 'https://umbrella-academy.com',
    siteName: 'Umbrella Academy',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Umbrella Academy - Personalized Learning Management System',
    description: 'Production-ready LMS with enforcement-based learning and guaranteed trainer-student time.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

