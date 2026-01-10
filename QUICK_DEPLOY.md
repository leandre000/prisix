# 🚀 Quick Vercel Deployment Guide

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"

### Step 2: Import Repository
1. Click "Import Git Repository"
2. Select `leandre000/umbrella-academia`
3. Click "Import"

### Step 3: Configure Project
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### Step 4: Set Environment Variables
Click "Environment Variables" and add:

**Required:**
```
DATABASE_URL=your-postgres-connection-string
NEXTAUTH_SECRET=generate-random-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
```

**To generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)

### Step 6: Run Database Migrations
After deployment, in Vercel Dashboard:
1. Go to your project → Settings → Functions
2. Or use Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

## Option 2: Deploy via CLI (Non-Interactive)

```bash
# Deploy to preview
vercel --yes

# Deploy to production
vercel --prod --yes
```

## 📋 Environment Variables Checklist

Before deploying, make sure you have:

- [ ] PostgreSQL database (Vercel Postgres, Supabase, or Neon)
- [ ] DATABASE_URL connection string
- [ ] NEXTAUTH_SECRET (random 32-byte base64 string)
- [ ] NEXTAUTH_URL (will be your Vercel domain)

## 🗄️ Quick Database Setup

### Using Vercel Postgres (Easiest)
1. In Vercel Dashboard → Your Project → Storage
2. Create Postgres database
3. Copy connection string to DATABASE_URL

### Using Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Settings → Database → Connection string
4. Copy to DATABASE_URL

## ✅ Post-Deployment

1. **Run Migrations:**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. **Test Health Endpoint:**
   Visit: `https://your-app.vercel.app/api/health`

3. **Create Admin User:**
   Use Prisma Studio or SQL to create first admin user

## 🎉 Done!

Your app is now live at: `https://your-app.vercel.app`

