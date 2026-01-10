# 🚀 Quick Setup Guide

## Your Generated NEXTAUTH_SECRET

```
nEjtAGPZIQE/67yz6Hjh58r6/mTddCvM2Me03gwDQj8=
```

**Save this!** You'll need it for Vercel environment variables.

## Step-by-Step Setup

### 1️⃣ Set Up Database (Choose One)

#### Option A: Supabase (Recommended - Free)

1. Visit: https://supabase.com
2. Sign up/Login
3. Click "New Project"
4. Project Name: `umbrella-academia`
5. Set a strong database password (save it!)
6. Choose region closest to you
7. Click "Create new project"
8. Wait ~2 minutes for setup
9. Go to: Settings → Database
10. Under "Connection string" → "URI", copy the connection string
11. It looks like: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

#### Option B: Vercel Postgres

1. Go to: https://vercel.com/leandre000s-projects/umbrella/storage
2. Click "Create Database" → "Postgres"
3. Choose "Hobby" (free tier)
4. Copy the connection string

### 2️⃣ Set Environment Variables in Vercel

1. Go to: https://vercel.com/leandre000s-projects/umbrella/settings/environment-variables
2. Click "Add New"
3. Add these variables:

**DATABASE_URL**
- Key: `DATABASE_URL`
- Value: Your database connection string from Step 1
- Environment: Production, Preview, Development (select all)

**NEXTAUTH_SECRET**
- Key: `NEXTAUTH_SECRET`
- Value: `nEjtAGPZIQE/67yz6Hjh58r6/mTddCvM2Me03gwDQj8=`
- Environment: Production, Preview, Development (select all)

**NEXTAUTH_URL**
- Key: `NEXTAUTH_URL`
- Value: `https://umbrella-33q4pul01-leandre000s-projects.vercel.app`
- Environment: Production, Preview, Development (select all)

4. Click "Save" for each variable

### 3️⃣ Redeploy with Environment Variables

After adding environment variables, Vercel will automatically redeploy, or:

1. Go to: https://vercel.com/leandre000s-projects/umbrella/deployments
2. Click the three dots on latest deployment
3. Click "Redeploy"

### 4️⃣ Run Database Migrations

```bash
# Pull environment variables locally
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

### 5️⃣ Create Initial Admin User

```bash
# Set admin credentials (optional, defaults shown)
$env:ADMIN_EMAIL="admin@umbrella.com"
$env:ADMIN_PASSWORD="Admin123!"
$env:ADMIN_NAME="Umbrella Admin"

# Create admin
npm run create-admin
```

Or set environment variables in Vercel and run:
```bash
vercel env pull .env.local
npm run create-admin
```

### 6️⃣ Test Your Deployment

1. Visit: https://umbrella-33q4pul01-leandre000s-projects.vercel.app
2. Health check: https://umbrella-33q4pul01-leandre000s-projects.vercel.app/api/health
3. Try registering a new user
4. Login with admin credentials

## ✅ Success Checklist

- [ ] Database created and connection string obtained
- [ ] Environment variables set in Vercel
- [ ] Application redeployed
- [ ] Database migrations run successfully
- [ ] Admin user created
- [ ] Can access landing page
- [ ] Can register/login
- [ ] Health endpoint returns "healthy"

## 🆘 Troubleshooting

### Database Connection Issues
- Verify connection string is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is enabled (add `?sslmode=require` to connection string)

### Migration Errors
- Make sure DATABASE_URL is set correctly
- Check database permissions
- Try: `npx prisma db push` instead of migrate

### Build Errors
- Check Vercel build logs
- Ensure all environment variables are set
- Verify Prisma client is generated

## 🎉 You're Done!

Your Umbrella SR LMS is now fully deployed and ready to use!

