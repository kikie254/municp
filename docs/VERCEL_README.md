# Vercel Deployment Documentation

Complete guide for deploying Iten-Tambach Municipality to Vercel with Firebase backend.

## 📚 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| **[VERCEL_QUICKSTART.md](../VERCEL_QUICKSTART.md)** | Get deployed in 5 minutes | Developers (Quick start) |
| **[DEPLOYMENT.md](../DEPLOYMENT.md)** | Detailed deployment instructions | Developers (Full guide) |
| **[PRE_DEPLOYMENT_CHECKLIST.md](../PRE_DEPLOYMENT_CHECKLIST.md)** | Pre-production verification | DevOps/Team leads |
| **[ENVIRONMENT_COMPARISON.md](./ENVIRONMENT_COMPARISON.md)** | Local vs Vercel differences | All team members |
| **[API_DOCUMENTATION.md](../API_DOCUMENTATION.md)** | API endpoints reference | Developers |

## 🚀 Quick Start

### First Time Setup (10 minutes)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Prepare environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with Firebase credentials
   ```

3. **Link project**
   ```bash
   vercel link
   ```

4. **Set environment variables**
   ```bash
   npm run setup:vercel
   # Follow the generated commands
   ```

5. **Deploy preview**
   ```bash
   vercel
   ```

6. **Deploy production** (when ready)
   ```bash
   vercel --prod
   ```

### Subsequent Deployments (30 seconds)

```bash
# Preview
vercel

# Production
vercel --prod
```

## 🏗️ Project Structure

```
.
├── .github/
│   └── workflows/
│       └── vercel-deploy.yml       # CI/CD pipeline
├── app/                             # Next.js 15 app directory
├── docs/
│   ├── VERCEL_README.md            # This file
│   └── ENVIRONMENT_COMPARISON.md   # Env differences guide
├── scripts/
│   └── setup-vercel.mjs            # Env var helper script
├── .env.example                     # Template for .env.local
├── .env.vercel.example             # Vercel-specific template
├── .vercelignore                   # Deployment exclusions
├── vercel.json                     # Vercel configuration
├── DEPLOYMENT.md                   # Full deployment guide
├── VERCEL_QUICKSTART.md           # Quick start guide
└── PRE_DEPLOYMENT_CHECKLIST.md    # Pre-prod checklist
```

## 🔑 Environment Variables Overview

### Required for All Environments

#### Public (Browser)
- `NEXT_PUBLIC_SITE_URL` - Your deployed URL
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase web API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID

#### Private (Server-only)
- `FIREBASE_ADMIN_PROJECT_ID` - Firebase admin project ID
- `FIREBASE_ADMIN_CLIENT_EMAIL` - Service account email
- `FIREBASE_ADMIN_PRIVATE_KEY` - Service account private key
- `FIREBASE_WEB_API_KEY` - Firebase web API key
- `PRIVACY_HASH_SECRET` - Hashing secret (generate unique!)
- `EMAIL_PROVIDER` - Email service provider
- `EMAIL_API_KEY` - Email service API key
- `EMAIL_FROM` - From email address
- `MUNICIPAL_NOTIFICATIONS_EMAIL` - Notification recipient

### Optional
- `SESSION_TTL_HOURS` - Session duration (default: 8)
- `MFA_ENFORCEMENT` - MFA policy: report/enforce/off
- `MAX_UPLOAD_BYTES` - Max file size (default: 10MB)
- `UPSTASH_REDIS_REST_URL` - Redis URL (for rate limiting)
- `UPSTASH_REDIS_REST_TOKEN` - Redis token

## 🌍 Environment Scopes

### Local Development
- **File**: `.env.local`
- **Firebase**: `iten-tambach-dev`
- **URL**: `http://localhost:3000`

### Vercel Preview
- **Set in**: Vercel Dashboard (Preview scope)
- **Firebase**: `iten-tambach-dev`
- **URL**: `https://your-project-git-branch.vercel.app`

### Vercel Production
- **Set in**: Vercel Dashboard (Production scope)
- **Firebase**: `iten-tambach-prod`
- **URL**: `https://your-domain.vercel.app`

## 🔄 Deployment Workflows

### Manual Deployment
```bash
# Preview environment
vercel

# Production environment
vercel --prod
```

### Automatic (GitHub)
1. Push to GitHub
2. Vercel auto-deploys:
   - `main` branch → Production
   - Other branches → Preview
   - Pull requests → Preview

### CI/CD (GitHub Actions)
Workflow runs on every push:
1. Install dependencies
2. Type checking
3. Linting
4. Tests
5. Build
6. Deploy to Vercel

**Setup required**: Add GitHub secrets
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 🎯 Common Tasks

### View Deployment Status
```bash
vercel ls                    # List deployments
vercel inspect [url]         # Inspect specific deployment
```

### Manage Environment Variables
```bash
vercel env ls                # List all variables
vercel env add VAR production    # Add variable
vercel env rm VAR production     # Remove variable
vercel env pull              # Pull to .env.local
```

### View Logs
```bash
vercel logs                  # Recent logs
vercel logs --follow         # Stream logs
vercel logs [deployment-url] # Logs for specific deployment
```

### Rollback Deployment
```bash
vercel ls                    # Find previous deployment URL
vercel promote [url]         # Promote to production
```

Or use Vercel Dashboard → Deployments → Previous deployment → Promote

## 🔍 Verification Steps

### After Every Deployment

1. **Health check**
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

2. **Admin login**
   Visit: `https://your-domain.vercel.app/admin/login`

3. **Check logs**
   ```bash
   vercel logs
   ```

4. **Test functionality**
   - Browse public pages
   - Submit a test form
   - Upload a test file
   - Create test data in admin

### Before Production Deployment

Use the complete checklist: `PRE_DEPLOYMENT_CHECKLIST.md`

## 🚨 Troubleshooting

### Firebase Admin Not Initialized

**Symptom**: Server-side Firebase operations fail

**Solution**:
```bash
# Verify private key is set correctly
vercel env ls | grep FIREBASE_ADMIN_PRIVATE_KEY

# If missing or wrong, add it again
vercel env add FIREBASE_ADMIN_PRIVATE_KEY production
# Paste: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### CORS Errors

**Symptom**: Browser can't connect to Firebase

**Solution**:
1. Verify `NEXT_PUBLIC_SITE_URL` matches deployed domain
2. Add domain to Firebase Console → Authentication → Authorized domains

### Build Failures

**Symptom**: Deployment fails during build

**Solution**:
```bash
# Test build locally first
npm run build

# Check build logs
vercel logs

# Common issues:
# - Missing environment variables
# - Type errors (run: npm run typecheck)
# - Linting errors (run: npm run lint)
```

### Environment Variables Not Working

**Symptom**: Variables are undefined at runtime

**Solution**:
1. Check variable is set for correct environment (Production/Preview)
2. Redeploy after adding new variables
3. Verify variable names match exactly (case-sensitive)
4. Public vars must start with `NEXT_PUBLIC_`

## 📊 Monitoring

### Vercel Dashboard
- **Analytics**: Traffic and performance
- **Logs**: Real-time application logs
- **Deployments**: Deployment history
- **Integrations**: Third-party tools

### Firebase Console
- **Authentication**: User activity
- **Firestore**: Database usage
- **Storage**: File storage usage
- **Performance**: App performance (if configured)

## 🔐 Security Best Practices

- [ ] Never commit `.env.local` or service account JSON
- [ ] Use different Firebase projects for dev/prod
- [ ] Generate unique `PRIVACY_HASH_SECRET` per environment
- [ ] Use strong passwords for admin accounts
- [ ] Enable MFA for production admins
- [ ] Review Firebase Security Rules before production
- [ ] Use HTTPS only (automatic with Vercel)
- [ ] Keep dependencies updated
- [ ] Monitor Vercel and Firebase logs regularly

## 🔗 Useful Links

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Dashboards
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com)

### Support
- [Vercel Support](https://vercel.com/support)
- [Firebase Support](https://firebase.google.com/support)

### Tools
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Firebase CLI Docs](https://firebase.google.com/docs/cli)

## 📞 Getting Help

### Documentation Priority
1. Start with **VERCEL_QUICKSTART.md** for basic setup
2. Refer to **DEPLOYMENT.md** for detailed steps
3. Check **ENVIRONMENT_COMPARISON.md** for env differences
4. Use **PRE_DEPLOYMENT_CHECKLIST.md** before production
5. Consult official docs (linked above)

### Common Questions

**Q: How do I update environment variables?**
A: `vercel env add VAR_NAME production` or via Vercel Dashboard

**Q: How do I rollback a deployment?**
A: `vercel promote [previous-deployment-url]`

**Q: Where are the logs?**
A: `vercel logs` or Vercel Dashboard → Logs

**Q: How do I use a custom domain?**
A: Vercel Dashboard → Settings → Domains

**Q: Can I use GitHub for deployments?**
A: Yes! Connect repo in Vercel Dashboard → Git

## ✅ Success Criteria

Your deployment is successful when:

- ✅ Site loads without errors
- ✅ Health endpoint returns OK: `/api/health`
- ✅ Admin login works
- ✅ Firebase reads/writes work
- ✅ File uploads succeed
- ✅ Forms submit correctly
- ✅ Email notifications send
- ✅ No errors in Vercel logs
- ✅ No errors in browser console

---

**Ready to deploy?** Start with [VERCEL_QUICKSTART.md](../VERCEL_QUICKSTART.md)!
