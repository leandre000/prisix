# Umbrella SR - Deployment Guide

## Pre-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Payment gateway configured
- [ ] File storage (MinIO/S3) configured
- [ ] Email service configured
- [ ] Domain name configured
- [ ] SSL certificate active

## Vercel Deployment

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `leandre000/umbrella-academia`
4. Select the repository

### 2. Configure Project Settings

**Framework Preset:** Next.js

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Root Directory:** `./` (root of repository)

### 3. Environment Variables

Add the following environment variables in Vercel:

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.com
MINIO_ENDPOINT=your-minio-endpoint
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=umbrella-documents
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Database Setup

#### Option A: Vercel Postgres

1. In Vercel dashboard, go to Storage
2. Create a Postgres database
3. Copy the connection string to `DATABASE_URL`

#### Option B: External Database

Use a managed PostgreSQL service:
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)
- [AWS RDS](https://aws.amazon.com/rds/)

### 5. Run Migrations

After deployment, run migrations:

```bash
# Via Vercel CLI
vercel env pull
npx prisma migrate deploy

# Or via direct connection
DATABASE_URL="your-connection-string" npx prisma migrate deploy
```

### 6. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployment URL

## Post-Deployment

### 1. Verify Database Connection

Check that the application can connect to the database.

### 2. Create Initial Admin User

Run the seed script or create manually:

```sql
-- Create Umbrella Admin
INSERT INTO "User" (id, email, name, "passwordHash", role, "createdAt", "updatedAt")
VALUES (
  'admin-id',
  'admin@umbrella.com',
  'Umbrella Admin',
  '$2a$10$hashedpassword',
  'UMBRELLA_ADMIN',
  NOW(),
  NOW()
);
```

### 3. Configure Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### 4. Set Up Monitoring

- Enable Vercel Analytics
- Set up error tracking (Sentry, etc.)
- Configure uptime monitoring

### 5. Configure Webhooks

For payment processing:
- Stripe webhook URL: `https://your-domain.com/api/webhooks/stripe`
- Configure in Stripe dashboard

## Database Migrations

### Production Migrations

```bash
# Generate migration
npx prisma migrate dev --name migration-name

# Deploy to production
npx prisma migrate deploy
```

### Schema Changes

1. Update `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name change-name`
3. Test locally
4. Deploy: `npx prisma migrate deploy`

## Environment Variables Reference

### Required

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for session encryption
- `NEXTAUTH_URL` - Your application URL

### Optional

- `MINIO_*` - Object storage configuration
- `STRIPE_*` - Payment gateway configuration
- `SMTP_*` - Email service configuration

## Troubleshooting

### Build Failures

- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel
- Verify SSL settings if required

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies

## Scaling Considerations

### Database

- Use connection pooling (PgBouncer)
- Set up read replicas for heavy read workloads
- Monitor query performance

### Application

- Vercel automatically scales
- Consider Edge Functions for high-traffic endpoints
- Use caching where appropriate

### Storage

- Use CDN for static assets
- Optimize images
- Use object storage for large files

## Security Checklist

- [ ] All environment variables are secure
- [ ] Database has proper access controls
- [ ] SSL/TLS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Regular security updates

## Backup Strategy

1. **Database Backups**
   - Automated daily backups
   - Retention: 30 days
   - Test restore procedures

2. **Code Backups**
   - Git repository (GitHub)
   - Regular commits

3. **File Storage**
   - MinIO/S3 versioning enabled
   - Cross-region replication

## Monitoring & Alerts

Set up monitoring for:
- Application uptime
- Database performance
- Error rates
- Payment processing
- User activity

## Support

For deployment issues:
- Check Vercel logs
- Review application logs
- Contact support team

