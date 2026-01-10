/**
 * Create Initial Admin User
 * Run this after database is set up
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@umbrella.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin123!'
  const name = process.env.ADMIN_NAME || 'Umbrella Admin'

  console.log('Creating admin user...')

  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    console.log('Admin user already exists!')
    return
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'UMBRELLA_ADMIN',
      umbrellaAdminProfile: {
        create: {},
      },
    },
  })

  // Create Umbrella Wallet if it doesn't exist
  const umbrellaWallet = await prisma.umbrellaWallet.findFirst()
  if (!umbrellaWallet) {
    await prisma.umbrellaWallet.create({
      data: {},
    })
    console.log('Umbrella wallet created')
  }

  console.log('✅ Admin user created successfully!')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  console.log('\n⚠️  Please change the password after first login!')
}

createAdmin()
  .catch((e) => {
    console.error('Error creating admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

