#!/bin/bash
# Vercel Deployment Script

echo "🚀 Deploying Umbrella SR to Vercel..."

# Deploy to preview
vercel

# Deploy to production
echo "📦 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set environment variables in Vercel Dashboard"
echo "   2. Run database migrations"
echo "   3. Create initial admin user"

