# Deployment Guide: Vercel + Firebase

This document outlines how to deploy the Iten-Tambach Municipality website to Vercel with Firebase as the backend.

## Overview

- **Frontend & API Routes**: Deployed on Vercel (Next.js 15)
- **Backend Services**: Firebase (Firestore, Storage, Authentication)
- **Two Environments**: Development and Production

## Prerequisites

1. [Vercel account](https://vercel.com)
2. [Vercel CLI](https://vercel.com/cli) installed: `npm i -g vercel`
3. Firebase projects already set up:
   - Development: `iten-tambach-dev`
   - Production: `iten-tambach-prod`
4. Node.js >= 20.9.0

## Initial Setup

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Link Your Project to Vercel

From your project root:

```bash
vercel link
```

Follow the prompts to:
- Log in to your Vercel account
- Select or create a new project
- Link it to your local codebase

## Environment Variables Setup

### Required Variables

You need to configure environment variables for both **Development** and **Production** environments in Vercel.

#### Access Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**

#### Variables to Configure

For each environment (Development/Preview and Production), add these variables:

##### Public Firebase Configuration (Client-side)

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

##### Firebase Admin SDK (Server-side) ⚠️ SENSITIVE

```
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
FIREBASE_WEB_API_KEY
```

**Important**: For `FIREBASE_ADMIN_PRIVATE_KEY`, make sure to:
- Include the full key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Preserve newline characters (use `\n` if pasting as a single line)
- Wrap the entire value in quotes

##### Security & Session

```
PRIVACY_HASH_SECRET          # Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_TTL_HOURS=8
MFA_ENFORCEMENT=report       # Options: report | enforce | off
```

##### Email Configuration

```
EMAIL_PROVIDER=resend        # or your chosen provider
EMAIL_API_KEY
EMAIL_FROM
MUNICIPAL_NOTIFICATIONS_EMAIL=[email removed]
```

##### Optional

```
MAX_UPLOAD_BYTES=10485760
UPSTASH_REDIS_REST_URL       # Optional: for distributed rate limiting
UPSTASH_REDIS_REST_TOKEN     # Optional: for distributed rate limiting
```

### Environment Scope in Vercel

- **Production**: Set these to use your `iten-tambach-prod` Firebase project
- **Preview** (Development): Set these to use your `iten-tambach-dev` Firebase project
- **Development**: Local development uses `.env.local` (see below)

## Firebase Service Account Setup

### Get Your Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`iten-tambach-dev` or `iten-tambach-prod`)
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file (keep it secure!)

### Extract Values from Service Account JSON

From the downloaded JSON file, extract:

```json
{
  "project_id": "iten-tambach-dev",           → FIREBASE_ADMIN_PROJECT_ID
  "client_email": "firebase-adminsdk-...",    → FIREBASE_ADMIN_CLIENT_EMAIL
  "private_key": "-----BEGIN PRIVATE KEY..." → FIREBASE_ADMIN_PRIVATE_KEY
}
```

## Local Development

### 1. Create `.env.local`

Copy the example file and fill in your development values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your **development** Firebase credentials.

### 2. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 3. Firebase Emulators (Optional)

For testing Firebase features locally without touching production:

```bash
firebase emulators:start
```

## Deployment

### Deploy to Preview (Development)

```bash
vercel
```

This deploys to a preview URL using your Preview environment variables.

### Deploy to Production

```bash
vercel --prod
```

This deploys to your production domain using Production environment variables.

## Automatic Deployments

Once linked to Vercel:

- **Every push to `main` branch** → Deploys to Production
- **Every push to other branches** → Creates a Preview deployment
- **Every Pull Request** → Creates a Preview deployment with a unique URL

You can customize this behavior in:
- **Vercel Dashboard** → **Settings** → **Git**

## Verification

### After Deployment

1. **Check Health Endpoint**:
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

2. **Verify Firebase Connection**:
   - Try logging in to admin panel
   - Check Firestore reads/writes
   - Test file uploads to Firebase Storage

3. **Check Logs**:
   - Vercel Dashboard → Your Project → **Logs**
   - Firebase Console → Your Project → **Functions** (if using)

### Common Issues

#### "Firebase Admin SDK not initialized"

- Verify `FIREBASE_ADMIN_PRIVATE_KEY` is correctly set in Vercel
- Check that newlines are preserved (`\n` characters)
- Ensure the key includes BEGIN and END markers

#### "CORS Error"

- Check `NEXT_PUBLIC_SITE_URL` matches your deployed domain
- Verify Firebase Authentication settings allow your domain

#### "Environment variable not found"

- Confirm all required variables are set in Vercel
- Check the environment scope (Production vs Preview)
- Redeploy after adding new variables

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (never commit secrets)
- [ ] Service account JSON files are never committed
- [ ] `PRIVACY_HASH_SECRET` is generated and set for production
- [ ] `NEXT_PUBLIC_SITE_URL` uses HTTPS in production
- [ ] Firebase Security Rules are properly configured
- [ ] MFA enforcement policy is reviewed and set appropriately

## Firebase Security Rules

Ensure your Firebase Security Rules are deployed:

```bash
firebase deploy --only firestore:rules,storage:rules --project iten-tambach-prod
```

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Your Project → **Analytics**

### Firebase Monitoring

Monitor usage in Firebase Console:
- **Authentication** → Active users
- **Firestore** → Usage
- **Storage** → Usage

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Firebase Documentation**: https://firebase.google.com/docs
- **Next.js Documentation**: https://nextjs.org/docs

## Quick Reference

```bash
# Link project to Vercel
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# Environment variables
vercel env ls                    # List all
vercel env add VARIABLE_NAME     # Add new
vercel env rm VARIABLE_NAME      # Remove

# Pull environment variables to local
vercel env pull .env.local
```

---

**Last Updated**: 2024
**Maintainer**: Iten-Tambach Municipality Development Team
