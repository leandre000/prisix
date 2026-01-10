# Vercel Deployment - Step by Step Guide

## 🚀 Quick Deployment Steps

### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy from Command Line

```bash
# From the umbrella directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? umbrella-academia (or your choice)
# - Directory? ./
# - Override settings? No
```

### Step 4: Set Environment Variables

After initial deployment, set environment variables:

```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

Or set them in Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add each variable

### Step 5: Production Deployment

```bash
vercel --prod
```

## 📋 Required Environment Variables

### Essential (Required)

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=generate-a-random-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
```

### Optional (For Full Functionality)

```
MINIO_ENDPOINT=your-minio-endpoint
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=umbrella-documents
MINIO_USE_SSL=true

STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

NODE_ENV=production
```

## 🔧 Generate NEXTAUTH_SECRET

```bash
# Generate a secure random secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🗄️ Database Setup Options

### Option 1: Vercel Postgres (Easiest)

1. Go to Vercel Dashboard → Your Project → Storage
2. Click "Create Database" → Select "Postgres"
3. Copy the connection string
4. Add to `DATABASE_URL` environment variable

### Option 2: Supabase (Recommended for Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Add to `DATABASE_URL` environment variable

### Option 3: Neon (Serverless Postgres)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `DATABASE_URL` environment variable

## 📊 Run Database Migrations

After setting up the database:

```bash
# Option 1: Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option 2: Direct connection
DATABASE_URL="your-connection-string" npx prisma migrate deploy
```

## ✅ Post-Deployment Checklist

- [ ] Environment variables set
- [ ] Database connected and migrations run
- [ ] Health check endpoint working: `https://your-app.vercel.app/api/health`
- [ ] Landing page loads: `https://your-app.vercel.app`
- [ ] Can register new users
- [ ] Can login
- [ ] Database queries working

## 🔍 Troubleshooting

### Build Fails

1. Check build logs in Vercel Dashboard
2. Ensure `prisma generate` runs (handled by postinstall script)
3. Check Node.js version (should be 18+)

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check database allows connections from Vercel IPs
3. Ensure SSL is enabled if required

### Authentication Issues

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your Vercel domain
3. Clear browser cookies

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## 📈 Monitoring

- Check Vercel Dashboard for deployment status
- Monitor function logs for errors
- Use `/api/health` endpoint for uptime monitoring

## 🎉 Success!

Once deployed, your app will be live at:
`https://umbrella-academia.vercel.app` (or your custom domain)

