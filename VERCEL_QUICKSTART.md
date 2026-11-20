# Vercel + Firebase Quick Start Guide

Get your Iten-Tambach Municipality website deployed to Vercel in minutes.

## Prerequisites

- Node.js >= 20.9.0 installed
- Firebase project already set up (`iten-tambach-dev` and `iten-tambach-prod`)
- Vercel account (sign up at https://vercel.com)

## 5-Minute Setup

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Prepare Environment Variables

Create your local environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Firebase credentials. Get these from:
- Firebase Console → Project Settings → General (for public config)
- Firebase Console → Project Settings → Service Accounts (for admin SDK)

### Step 3: Link to Vercel

```bash
vercel link
```

This will:
1. Log you into Vercel (opens browser)
2. Ask you to create/select a project
3. Link your local code to that project

### Step 4: Set Environment Variables

#### Option A: Use the Helper Script (Recommended)

```bash
npm run setup:vercel
```

This will show you exactly which commands to run to set all environment variables.

#### Option B: Manual Setup via Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable from `.env.local`
5. Set the scope:
   - **Production** for production deployments
   - **Preview** for development/staging

#### Option C: CLI One-Liner

For non-sensitive values:

```bash
vercel env add VARIABLE_NAME production
```

Then paste the value when prompted.

### Step 5: Deploy!

#### Deploy to Preview (Staging)

```bash
vercel
```

Your site is now live at a preview URL like `your-project-xxx.vercel.app`

#### Deploy to Production

```bash
vercel --prod
```

Your site is now live at your production domain! 🎉

## Automatic Deployments (Optional)

### Connect to GitHub

1. Push your code to GitHub
2. In Vercel Dashboard → Your Project → **Settings** → **Git**
3. Connect your GitHub repository

Now every commit triggers an automatic deployment:
- Pushes to `main` → Production
- Pushes to other branches → Preview
- Pull requests → Preview with unique URL

### GitHub Actions (Optional)

The `.github/workflows/vercel-deploy.yml` file is already configured. To use it:

1. Go to GitHub → Your Repository → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `VERCEL_TOKEN`: Get from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID`: Get from `.vercel/project.json` after running `vercel link`
   - `VERCEL_PROJECT_ID`: Get from `.vercel/project.json` after running `vercel link`

## Verification Checklist

After deployment, verify everything works:

- [ ] Site loads: `https://your-domain.vercel.app`
- [ ] Health check passes: `https://your-domain.vercel.app/api/health`
- [ ] Admin login works: `https://your-domain.vercel.app/admin/login`
- [ ] Firebase reads/writes work (test by creating something)
- [ ] File uploads work (test in admin panel)
- [ ] No errors in Vercel logs (check dashboard)

## Common Issues & Fixes

### "Firebase Admin not initialized"

**Problem**: Server-side Firebase operations fail

**Fix**: 
```bash
# Make sure FIREBASE_ADMIN_PRIVATE_KEY is set correctly
# The private key should include \n for newlines and be wrapped in quotes
vercel env add FIREBASE_ADMIN_PRIVATE_KEY production
# Then paste: "-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### "CORS Error" in Browser

**Problem**: Browser can't connect to Firebase

**Fix**: 
1. Check that `NEXT_PUBLIC_SITE_URL` matches your deployed domain
2. Add your Vercel domain to Firebase Console → Authentication → Settings → Authorized domains

### "Environment variable not found"

**Problem**: Code references undefined environment variable

**Fix**: 
```bash
# List all current environment variables
vercel env ls

# Add missing variable
vercel env add MISSING_VAR_NAME production
```

## Domain Setup

### Add Custom Domain

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `iten-tambach.go.ke`)
4. Follow DNS setup instructions
5. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
6. Add your custom domain to Firebase → Authentication → Authorized domains

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List environment variables
vercel env ls

# Add environment variable
vercel env add VAR_NAME production

# Remove environment variable
vercel env rm VAR_NAME production

# Pull environment variables locally
vercel env pull

# Open project in dashboard
vercel inspect
```

## Support & Documentation

- **Full Deployment Guide**: See `DEPLOYMENT.md`
- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Project Structure

```
.
├── .github/workflows/
│   └── vercel-deploy.yml      # GitHub Actions CI/CD
├── app/                        # Next.js 15 app directory
├── lib/                        # Shared utilities
├── scripts/
│   └── setup-vercel.mjs       # Vercel setup helper
├── .env.example               # Environment template
├── .env.local                 # Your local environment (not committed)
├── .vercelignore              # Files to exclude from deployment
├── vercel.json                # Vercel configuration
├── DEPLOYMENT.md              # Full deployment documentation
└── VERCEL_QUICKSTART.md       # This file
```

## Security Reminders

- ✅ Never commit `.env.local` or service account JSON files
- ✅ Use different Firebase projects for dev and production
- ✅ Generate a strong `PRIVACY_HASH_SECRET` for production
- ✅ Review Firebase Security Rules before going live
- ✅ Enable MFA for admin accounts in production
- ✅ Use HTTPS in production (automatic with Vercel)

---

**Need Help?** Check the full `DEPLOYMENT.md` guide or Vercel support.
