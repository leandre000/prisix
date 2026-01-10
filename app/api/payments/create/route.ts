import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/audit'
import { calculatePaymentDistribution } from '@/lib/enforcement'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roadmapId, paymentMethod, paymentGatewayId } = body

    if (!roadmapId) {
      return NextResponse.json(
        { error: 'Roadmap ID is required' },
        { status: 400 }
      )
    }

    // Get roadmap
    const roadmap = await prisma.roadmap.findUnique({
      where: {
        id: roadmapId,
        studentId: (await prisma.studentProfile.findUnique({
          where: { userId: session.user.id },
        }))?.id,
      },
      include: {
        student: true,
        wing: true,
      },
    })

    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found' },
        { status: 404 }
      )
    }

    // Check if roadmap is approved
    if (roadmap.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Roadmap must be approved before payment' },
        { status: 400 }
      )
    }

    // Check if student already has active payment
    const activePayment = await prisma.payment.findFirst({
      where: {
        studentId: roadmap.studentId,
        isActive: true,
        endDate: {
          gte: new Date(),
        },
      },
    })

    if (activePayment) {
      return NextResponse.json(
        { error: 'Student already has an active payment' },
        { status: 400 }
      )
    }

    // Calculate payment period (monthly)
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    const amount = Number(roadmap.monthlyPrice)

    // Calculate automatic distribution
    const distribution = calculatePaymentDistribution(amount)
    const wingAmount = distribution.wingAmount
    const umbrellaAmount = distribution.umbrellaAmount

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        studentId: roadmap.studentId,
        roadmapId: roadmap.id,
        amount,
        status: 'COMPLETED', // Assuming payment gateway handles this
        paymentMethod: paymentMethod || 'stripe',
        paymentGatewayId: paymentGatewayId || `pay_${Date.now()}`,
        startDate,
        endDate,
        isActive: true,
        wingAmount,
        umbrellaAmount,
      },
    })

    // Create transactions for wallet distribution
    // Get or create wallets
    let wingWallet = await prisma.wingWallet.findUnique({
      where: { wingId: roadmap.wingId },
    })

    if (!wingWallet) {
      wingWallet = await prisma.wingWallet.create({
        data: {
          wingId: roadmap.wingId,
        },
      })
    }

    let umbrellaWallet = await prisma.umbrellaWallet.findFirst()

    if (!umbrellaWallet) {
      umbrellaWallet = await prisma.umbrellaWallet.create({
        data: {},
      })
    }

    // Update wing wallet
    await prisma.wingWallet.update({
      where: { id: wingWallet.id },
      data: {
        balance: {
          increment: wingAmount,
        },
        totalReceived: {
          increment: wingAmount,
        },
        canWithdraw: true, // Allow withdrawal if learning is active
      },
    })

    // Update umbrella wallet
    await prisma.umbrellaWallet.update({
      where: { id: umbrellaWallet.id },
      data: {
        balance: {
          increment: umbrellaAmount,
        },
        totalReceived: {
          increment: umbrellaAmount,
        },
      },
    })

    // Create transactions
    await prisma.transaction.createMany({
      data: [
        {
          type: 'PAYMENT',
          paymentId: payment.id,
          wingWalletId: wingWallet.id,
          amount: wingAmount,
          description: `Payment distribution - Wing (35%)`,
        },
        {
          type: 'PAYMENT',
          paymentId: payment.id,
          umbrellaWalletId: umbrellaWallet.id,
          amount: umbrellaAmount,
          description: `Payment distribution - Umbrella (65%)`,
        },
      ],
    })

    // Update student profile
    await prisma.studentProfile.update({
      where: { id: roadmap.studentId },
      data: {
        canStartLearning: true,
      },
    })

    // Log activity
    await logActivity(
      session.user.id,
      'PAYMENT_RECEIVED',
      `Payment received: $${amount} for roadmap ${roadmap.title}`,
      {
        paymentId: payment.id,
        amount,
        wingAmount,
        umbrellaAmount,
      }
    )

    return NextResponse.json({
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        amount: payment.amount,
        startDate: payment.startDate,
        endDate: payment.endDate,
      },
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

