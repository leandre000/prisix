import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AuthorizationError, handleError } from '@/lib/errors'

// File upload handler for guidance documents
// In production, integrate with MinIO/S3 or similar service

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      throw new AuthorizationError('Authentication required')
    }

    // Only Wing Admins and Umbrella Admins can upload guidance documents
    if (session.user.role !== 'WING_ADMIN' && session.user.role !== 'UMBRELLA_ADMIN') {
      throw new AuthorizationError('Only administrators can upload files')
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (PDF only for guidance documents)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // TODO: Upload to MinIO/S3
    // For now, return a mock URL
    const fileName = `guidance-${Date.now()}-${file.name}`
    const fileUrl = `/uploads/${fileName}`

    // In production:
    // const fileUrl = await uploadToS3(file, fileName)

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      fileName,
      size: file.size,
    })
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    )
  }
}

