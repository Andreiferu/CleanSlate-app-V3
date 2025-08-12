# 🚀 CleanSlate v3 - Production Deployment Guide

## Pre-deployment Checklist

- [ ] All tests pass: `npm run test:ci`
- [ ] Linting passes: `npm run lint`
- [ ] Security audit clean: `npm run security:audit`
- [ ] Bundle analysis acceptable: `npm run analyze`
- [ ] Lighthouse scores > 90: `npm run lighthouse`

## Environment Variables

Create `.env.local` pentru development:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_SECRET_KEY=your-secret-key

# Database
DATABASE_URL=your-database-url

# External Services
OPENAI_API_KEY=your-openai-key (pentru viitoarele features AI)
SENDGRID_API_KEY=your-sendgrid-key (pentru notificări email)

# Analytics
GOOGLE_ANALYTICS_ID=your-ga-id
HOTJAR_ID=your-hotjar-id

# Monitoring
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-key
