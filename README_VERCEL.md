# Vercel + Firebase Deployment Setup ✅

Your Iten-Tambach Municipality project is now **fully configured** for deployment to Vercel with Firebase backend!

## 📦 What Was Created

### Configuration Files
- ✅ `vercel.json` - Vercel platform configuration
- ✅ `.vercelignore` - Deployment exclusions
- ✅ `.env.vercel.example` - Vercel environment variables template
- ✅ `.github/workflows/vercel-deploy.yml` - CI/CD pipeline

### Documentation Files
- ✅ `VERCEL_QUICKSTART.md` - **START HERE** - 5-minute deployment guide
- ✅ `DEPLOYMENT.md` - Complete deployment documentation
- ✅ `PRE_DEPLOYMENT_CHECKLIST.md` - Production readiness checklist
- ✅ `docs/VERCEL_README.md` - Documentation index and reference
- ✅ `docs/ENVIRONMENT_COMPARISON.md` - Local vs Vercel comparison

### Helper Scripts
- ✅ `scripts/setup-vercel.mjs` - Environment variable setup helper
- ✅ Added `npm run setup:vercel` to package.json

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Link Your Project
```bash
vercel link
```

### Step 3: Set Environment Variables
```bash
# Use the helper script
npm run setup:vercel

# Then follow the generated commands
```

### Step 4: Deploy!
```bash
# Preview deployment
vercel

# Production deployment (when ready)
vercel --prod
```

## 📚 Documentation Guide

| **Read This** | **When** |
|---------------|----------|
| **VERCEL_QUICKSTART.md** | You want to deploy NOW (5 min guide) |
| **DEPLOYMENT.md** | You need detailed setup instructions |
| **PRE_DEPLOYMENT_CHECKLIST.md** | Before deploying to production |
| **docs/ENVIRONMENT_COMPARISON.md** | Understanding local vs Vercel differences |
| **docs/VERCEL_README.md** | Reference for common tasks |

## 🎯 Next Steps

1. **Read the Quick Start Guide**
   ```bash
   # Open: VERCEL_QUICKSTART.md
   ```

2. **Prepare Your Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

3. **Run the Setup Helper**
   ```bash
   npm run setup:vercel
   ```

4. **Deploy to Preview**
   ```bash
   vercel
   ```

5. **Test Thoroughly**
   - Visit your preview URL
   - Test admin login
   - Test file uploads
   - Test forms

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│           Vercel Platform               │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Next.js 15 Application          │ │
│  │   • Pages & Routes                │ │
│  │   • API Routes                    │ │
│  │   • Server Components             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│        Firebase Backend                 │
│                                         │
│  • Firestore (Database)                │
│  • Storage (Files)                     │
│  • Authentication (Admin)              │
└─────────────────────────────────────────┘
```

See full diagrams in the artifacts or documentation.

## 🔑 Environment Variables Needed

### Public (Browser-side)
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Private (Server-side)
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY` ⚠️
- `FIREBASE_WEB_API_KEY`
- `PRIVACY_HASH_SECRET` ⚠️
- `EMAIL_API_KEY` ⚠️
- `EMAIL_FROM`
- `EMAIL_PROVIDER`
- `MUNICIPAL_NOTIFICATIONS_EMAIL`

⚠️ = Highly sensitive

Get these values from:
- Firebase Console → Project Settings
- Firebase Console → Service Accounts (for admin SDK)

## 🌍 Two Environments

### Preview (Development/Staging)
- **Firebase Project**: `iten-tambach-dev`
- **Deployed on**: `vercel` command
- **URL**: `https://your-project-*.vercel.app`

### Production
- **Firebase Project**: `iten-tambach-prod`
- **Deployed on**: `vercel --prod` command
- **URL**: Your custom domain or production Vercel URL

## 🔄 Deployment Options

### Option 1: Manual CLI (Recommended to start)
```bash
vercel          # Preview
vercel --prod   # Production
```

### Option 2: Automatic GitHub
1. Push code to GitHub
2. Connect repo in Vercel Dashboard
3. Auto-deploys on every push

### Option 3: CI/CD Pipeline
- GitHub Actions workflow already configured
- Runs tests before deployment
- Requires GitHub secrets setup

## ✅ Verification Checklist

After deploying, verify:

- [ ] Site loads: `https://your-domain.vercel.app`
- [ ] Health endpoint works: `/api/health`
- [ ] Admin login works: `/admin/login`
- [ ] Firebase operations work (test in admin)
- [ ] File uploads work
- [ ] Forms submit successfully
- [ ] No errors in logs: `vercel logs`

## 🚨 Common Issues & Solutions

### "Firebase Admin not initialized"
**Fix**: Check `FIREBASE_ADMIN_PRIVATE_KEY` is set correctly in Vercel with newlines preserved

### CORS errors
**Fix**: Verify `NEXT_PUBLIC_SITE_URL` matches your deployed domain and domain is authorized in Firebase

### Environment variables not found
**Fix**: Ensure variables are set for the correct environment scope (Production/Preview) in Vercel

### Build fails
**Fix**: Run `npm run build` locally first to catch errors early

## 📞 Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Your Project Docs
- Start: `VERCEL_QUICKSTART.md`
- Detailed: `DEPLOYMENT.md`
- Reference: `docs/VERCEL_README.md`

### Dashboards
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com)

## 🎉 You're Ready!

Everything is configured and ready for deployment. Follow the **VERCEL_QUICKSTART.md** guide to get your site live in 5 minutes!

## 📝 Quick Command Reference

```bash
# Setup
npm install -g vercel          # Install Vercel CLI
vercel link                    # Link project to Vercel
npm run setup:vercel           # Generate env var commands

# Deployment
vercel                         # Deploy to preview
vercel --prod                  # Deploy to production

# Management
vercel logs                    # View logs
vercel env ls                  # List environment variables
vercel env add VAR production  # Add environment variable
vercel ls                      # List deployments
vercel promote [url]           # Rollback to previous deployment

# Testing
npm run verify:all             # Run all tests
npm run build                  # Test production build
```

---

**Questions?** Check the documentation files or visit [Vercel Support](https://vercel.com/support)

**Ready to deploy?** Open `VERCEL_QUICKSTART.md` and get started! 🚀
