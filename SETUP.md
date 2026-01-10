# Umbrella SR - Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/leandre000/umbrella-academia.git
cd umbrella-academia

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/umbrella_sr?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# MinIO / S3 (optional for development)
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="umbrella-documents"
MINIO_USE_SSL=false

# Payment Gateway (Stripe - optional for development)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Seed Initial Data (Optional)

Create a seed script to populate initial data:

```bash
# Create prisma/seed.ts (see example below)
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

## Database Seeding

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Umbrella Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@umbrella.com',
      name: 'Umbrella Admin',
      passwordHash: adminPassword,
      role: 'UMBRELLA_ADMIN',
      umbrellaAdminProfile: {
        create: {},
      },
    },
  })

  // Create a Wing
  const wing = await prisma.wing.create({
    data: {
      name: 'Tech Wing',
      slug: 'tech-wing',
      description: 'Technology-focused learning wing',
      guidanceDocument: '/guidance/tech-wing.pdf',
      isActive: true,
    },
  })

  // Create Wing Admin
  const wingAdminPassword = await bcrypt.hash('admin123', 10)
  const wingAdmin = await prisma.user.create({
    data: {
      email: 'wingadmin@umbrella.com',
      name: 'Wing Admin',
      passwordHash: wingAdminPassword,
      role: 'WING_ADMIN',
      wingId: wing.id,
      wingAdminProfile: {
        create: {
          wingId: wing.id,
        },
      },
    },
  })

  // Create Master Mentor
  const mentorPassword = await bcrypt.hash('mentor123', 10)
  const mentor = await prisma.user.create({
    data: {
      email: 'mentor@umbrella.com',
      name: 'Master Mentor',
      passwordHash: mentorPassword,
      role: 'MASTER_MENTOR',
      wingId: wing.id,
      mentorProfile: {
        create: {
          wingId: wing.id,
        },
      },
    },
  })

  // Create Trainer
  const trainerPassword = await bcrypt.hash('trainer123', 10)
  const trainer = await prisma.user.create({
    data: {
      email: 'trainer@umbrella.com',
      name: 'Trainer',
      passwordHash: trainerPassword,
      role: 'TRAINER',
      wingId: wing.id,
      trainerProfile: {
        create: {
          wingId: wing.id,
          weeklyHoursAvailable: 20,
          maxStudents: 4,
        },
      },
    },
  })

  // Create Umbrella Wallet
  await prisma.umbrellaWallet.create({
    data: {},
  })

  // Create Wing Wallet
  await prisma.wingWallet.create({
    data: {
      wingId: wing.id,
    },
  })

  console.log('Seed data created successfully!')
  console.log('Admin: admin@umbrella.com / admin123')
  console.log('Wing Admin: wingadmin@umbrella.com / admin123')
  console.log('Mentor: mentor@umbrella.com / mentor123')
  console.log('Trainer: trainer@umbrella.com / trainer123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Database Migration

```bash
# Run migrations in production
npm run db:migrate
```

### Environment Variables

Set all required environment variables in your hosting platform:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- Payment gateway credentials
- MinIO/S3 credentials

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Ensure database exists
- Check firewall/network settings

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies
- Check session configuration

### Prisma Issues

```bash
# Reset Prisma client
npm run db:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Next Steps

1. Complete student entry flow
2. Set up payment gateway
3. Configure MinIO/S3 storage
4. Set up email notifications
5. Configure monitoring and logging

