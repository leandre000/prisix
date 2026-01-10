# Database Setup Guide

## Quick Setup Options

### Option 1: Supabase (Recommended - Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Fill in:
   - Project Name: `umbrella-academia`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Wait for project to be created (~2 minutes)
6. Go to Settings → Database
7. Copy the "Connection string" under "Connection pooling"
8. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Option 2: Vercel Postgres

1. Go to Vercel Dashboard → Your Project
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose plan (Hobby is free)
6. Copy the connection string

### Option 3: Neon (Serverless Postgres)

1. Go to [neon.tech](https://neon.tech)
2. Sign up/Login
3. Click "Create Project"
4. Copy the connection string

## After Getting Connection String

1. Add to Vercel Environment Variables:
   - Go to: https://vercel.com/leandre000s-projects/umbrella/settings/environment-variables
   - Add `DATABASE_URL` with your connection string

2. Run Migrations:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

3. Create Admin User (see below)

