# Environment Comparison: Local vs Vercel

This document explains the differences between local development and Vercel deployment configurations.

## Overview

| Aspect | Local Development | Vercel Deployment |
|--------|------------------|-------------------|
| **Node.js Runtime** | Your local Node version | Vercel's Node.js runtime |
| **Environment Variables** | `.env.local` file | Vercel Dashboard/CLI |
| **Firebase Project** | `iten-tambach-dev` | `iten-tambach-dev` (Preview) or `iten-tambach-prod` (Production) |
| **Domain** | `localhost:3000` | `*.vercel.app` or custom domain |
| **HTTPS** | HTTP (optional HTTPS) | HTTPS (always) |
| **Build Process** | `npm run dev` (hot reload) | `npm run build` (production build) |
| **File Storage** | Local filesystem or Firebase Storage | Firebase Storage only |
| **Database** | Firebase Firestore or Emulators | Firebase Firestore |

## Environment Files

### Local Development

```
.env.local                    # Your actual credentials (gitignored)
.env.example                  # Template for others
```

**To set up locally:**
```bash
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

### Vercel Deployment

```
Vercel Dashboard → Settings → Environment Variables
```

**Environment scopes:**
- **Production**: Used for `vercel --prod` deployments
- **Preview**: Used for `vercel` and branch deployments
- **Development**: Used for local `vercel dev` (optional)

## Firebase Projects

### Local Development
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iten-tambach-dev
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-dev
```

### Vercel Preview
```bash
# Vercel Environment Variables (Preview scope)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iten-tambach-dev
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-dev
```

### Vercel Production
```bash
# Vercel Environment Variables (Production scope)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iten-tambach-prod
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-prod
```

## URL Configuration

### Local Development
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Vercel Preview
```bash
NEXT_PUBLIC_SITE_URL=https://your-project-git-branch.vercel.app
```

### Vercel Production
```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
# or your custom domain
NEXT_PUBLIC_SITE_URL=https://iten-tambach.go.ke
```

## Security Considerations

### Development
- ✅ Can use weaker `PRIVACY_HASH_SECRET` (but still use a real one!)
- ✅ Can use development service accounts with limited permissions
- ✅ MFA can be set to `report` or `off`
- ⚠️ NEVER commit `.env.local`

### Production
- ⚠️ MUST use strong, unique `PRIVACY_HASH_SECRET`
- ⚠️ MUST use production service accounts
- ⚠️ Consider setting MFA to `enforce`
- ⚠️ MUST use HTTPS (automatic with Vercel)
- ⚠️ Review all Firebase Security Rules

## Database & Storage

### Local Development Options

**Option 1: Use Development Firebase Project**
```bash
# .env.local
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-dev
# Uses real Firestore and Storage
```

**Option 2: Use Firebase Emulators** (Recommended for isolated testing)
```bash
# Start emulators
firebase emulators:start

# Your app automatically connects to emulators
# when FIRESTORE_EMULATOR_HOST is set
```

### Vercel Deployment
- Always uses real Firebase projects (dev or prod)
- No emulators available
- Data persists across deployments

## Build & Deployment

### Local Development
```bash
# Development mode (hot reload, source maps, verbose errors)
npm run dev

# Runs on port 3000
# Fast refresh on file changes
# Detailed error messages
```

### Vercel Deployment
```bash
# Production build (optimized, minified)
npm run build

# Deployed to Vercel's edge network
# Optimized for performance
# Limited error details (for security)
```

## API Routes Behavior

### Local Development
- Runs in Node.js process
- Can use Node.js debugging tools
- Full access to filesystem
- Longer timeout (no limit)

### Vercel Deployment
- Runs as serverless functions
- Limited filesystem access (read-only)
- 10-second timeout (Hobby plan) or 60s (Pro)
- Cold start possible on first request

## Testing

### Local Testing
```bash
# Run all tests
npm run test

# Test Firebase rules with emulators
npm run test:rules

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Pre-Deployment Testing
```bash
# Build locally first
npm run build

# Run production build locally
npm start

# Verify everything works before deploying
```

## Debugging

### Local Development
```javascript
// Console logs appear in terminal
console.log('Debug info');

// Can use Node.js debugger
// Can use React DevTools
```

### Vercel Deployment
```bash
# View logs via CLI
vercel logs

# View logs in dashboard
# Vercel Dashboard → Your Project → Logs

# Limited console.log output (use sparingly)
```

## Common Pitfalls

### ❌ Wrong: Using same secret across environments
```bash
# Development
PRIVACY_HASH_SECRET=abc123

# Production
PRIVACY_HASH_SECRET=abc123  # WRONG! Use different value
```

### ✅ Correct: Different secrets per environment
```bash
# Development
PRIVACY_HASH_SECRET=dev_5f8c2e1a7b3d9c4f...

# Production
PRIVACY_HASH_SECRET=prod_9a2b7c4e1f3d8g5h...
```

### ❌ Wrong: Using production Firebase in development
```bash
# .env.local (local dev)
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-prod  # WRONG!
```

### ✅ Correct: Use dev project locally
```bash
# .env.local (local dev)
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-dev  # Correct!
```

### ❌ Wrong: Using localhost URL in Vercel
```bash
# Vercel Production
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # WRONG!
```

### ✅ Correct: Use actual deployed URL
```bash
# Vercel Production
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app  # Correct!
```

## Environment-Specific Features

### Available Everywhere
- ✅ Firebase Firestore
- ✅ Firebase Storage
- ✅ Firebase Authentication
- ✅ Email notifications
- ✅ API routes
- ✅ Server-side rendering

### Local Development Only
- Firebase Emulators
- Hot module replacement
- Detailed error stack traces
- Unrestricted filesystem access

### Vercel Only
- Edge network distribution
- Automatic HTTPS
- Preview deployments per branch
- Analytics (if enabled)
- Vercel-specific headers

## Migration Path

### From Local to Preview
```bash
# 1. Verify everything works locally
npm run dev
npm run verify:all

# 2. Deploy to preview
vercel

# 3. Test preview deployment thoroughly
# Visit: https://your-project-xxx.vercel.app
```

### From Preview to Production
```bash
# 1. Verify preview works perfectly
# 2. Double-check PRE_DEPLOYMENT_CHECKLIST.md
# 3. Deploy to production
vercel --prod

# 4. Verify production deployment
# Visit: https://your-domain.vercel.app
```

## Quick Reference

| Task | Local | Vercel |
|------|-------|--------|
| **Set environment variable** | Edit `.env.local` | `vercel env add VAR production` |
| **Start server** | `npm run dev` | Automatic on deploy |
| **View logs** | Terminal | `vercel logs` or Dashboard |
| **Test changes** | Save file (hot reload) | `vercel` (new deployment) |
| **Debug** | Node debugger, console | `vercel logs`, limited console |
| **Database** | Dev project or emulators | Dev (preview) or Prod (production) |

---

**Tip**: Always test locally first, then preview deployment, then production. Never skip straight to production!
