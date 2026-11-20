# Pre-Deployment Checklist

Complete this checklist before deploying to production.

## 🔐 Security

- [ ] All sensitive credentials are in environment variables (not hardcoded)
- [ ] `.env.local` is listed in `.gitignore` and never committed
- [ ] Service account JSON files are never committed
- [ ] `PRIVACY_HASH_SECRET` is generated and unique for production
- [ ] `NEXT_PUBLIC_SITE_URL` uses HTTPS for production
- [ ] Firebase Security Rules are reviewed and deployed
- [ ] Storage Rules are reviewed and deployed
- [ ] MFA enforcement policy is set appropriately
- [ ] Admin accounts have strong passwords

## 🔥 Firebase Configuration

### Development Project (`iten-tambach-dev`)

- [ ] Firebase project exists
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] Authentication enabled (Email/Password)
- [ ] Service account created and downloaded
- [ ] Security rules deployed: `firebase deploy --only firestore:rules,storage:rules --project iten-tambach-dev`

### Production Project (`iten-tambach-prod`)

- [ ] Firebase project exists
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] Authentication enabled (Email/Password)
- [ ] Service account created and downloaded
- [ ] Security rules deployed: `firebase deploy --only firestore:rules,storage:rules --project iten-tambach-prod`
- [ ] Backup schedule configured (if applicable)

## 🌐 Vercel Configuration

### Project Setup

- [ ] Vercel account created
- [ ] Vercel CLI installed: `npm i -g vercel`
- [ ] Project linked: `vercel link`
- [ ] Custom domain configured (if applicable)

### Environment Variables - Preview/Development

Set in Vercel Dashboard → Settings → Environment Variables → Preview

- [ ] `NEXT_PUBLIC_SITE_URL` (preview URL)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (`iten-tambach-dev`)
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `FIREBASE_ADMIN_PROJECT_ID` (`iten-tambach-dev`)
- [ ] `FIREBASE_ADMIN_CLIENT_EMAIL`
- [ ] `FIREBASE_ADMIN_PRIVATE_KEY`
- [ ] `FIREBASE_WEB_API_KEY`
- [ ] `PRIVACY_HASH_SECRET`
- [ ] `EMAIL_PROVIDER`
- [ ] `EMAIL_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `MUNICIPAL_NOTIFICATIONS_EMAIL`

### Environment Variables - Production

Set in Vercel Dashboard → Settings → Environment Variables → Production

- [ ] `NEXT_PUBLIC_SITE_URL` (production URL)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (`iten-tambach-prod`)
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `FIREBASE_ADMIN_PROJECT_ID` (`iten-tambach-prod`)
- [ ] `FIREBASE_ADMIN_CLIENT_EMAIL`
- [ ] `FIREBASE_ADMIN_PRIVATE_KEY`
- [ ] `FIREBASE_WEB_API_KEY`
- [ ] `PRIVACY_HASH_SECRET` (different from dev!)
- [ ] `EMAIL_PROVIDER`
- [ ] `EMAIL_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `MUNICIPAL_NOTIFICATIONS_EMAIL`

## 📧 Email Configuration

- [ ] Email provider account created (Resend, SendGrid, etc.)
- [ ] API key generated
- [ ] From address verified/authorized
- [ ] Test email sent successfully
- [ ] Notification recipient configured

## 🧪 Testing

### Local Testing

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts successfully
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run test:rules` passes (Firebase rules)
- [ ] Admin login works locally
- [ ] File uploads work locally
- [ ] Forms submit successfully

### Preview Deployment Testing

- [ ] Deploy preview: `vercel`
- [ ] Preview site loads without errors
- [ ] Health check endpoint works: `/api/health`
- [ ] Admin login works on preview
- [ ] Firebase reads/writes work
- [ ] File uploads work
- [ ] Email notifications send (test in dev project)
- [ ] All pages load correctly
- [ ] No console errors in browser
- [ ] Mobile responsive design works

## 📝 Documentation

- [ ] README.md updated with deployment info
- [ ] API documentation current
- [ ] Admin user guide available
- [ ] Environment variables documented

## 🚀 Pre-Production

- [ ] Code review completed
- [ ] All tests passing in CI/CD
- [ ] Performance tested (Lighthouse/PageSpeed)
- [ ] Accessibility tested (WCAG compliance)
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile tested (iOS and Android)
- [ ] Error handling tested
- [ ] 404 and error pages work correctly

## 📊 Monitoring Setup

- [ ] Vercel Analytics enabled (optional)
- [ ] Firebase monitoring configured
- [ ] Error tracking setup (Sentry, etc.) if applicable
- [ ] Uptime monitoring configured if required

## 🔄 Deployment Process

### First Production Deployment

```bash
# 1. Ensure all tests pass
npm run verify:all

# 2. Deploy to preview first
vercel

# 3. Test preview thoroughly (use checklist above)

# 4. Deploy to production
vercel --prod

# 5. Verify production deployment
```

### Post-Deployment Verification

- [ ] Production site loads: `https://your-domain.vercel.app`
- [ ] Health check passes: `https://your-domain.vercel.app/api/health`
- [ ] Admin login works
- [ ] Create test data (document, news, project)
- [ ] Test public forms submission
- [ ] Test file uploads
- [ ] Check Firestore data appears correctly
- [ ] Check Storage bucket receives files
- [ ] Test email notifications
- [ ] Review Vercel deployment logs for errors
- [ ] Review Firebase console for errors
- [ ] Test from different devices/browsers

## 🔐 Post-Deployment Security

- [ ] Change all default passwords
- [ ] Create first admin user: `npm run admin:provision`
- [ ] Review Firebase console access permissions
- [ ] Review Vercel project access permissions
- [ ] Enable MFA for admin accounts (if MFA_ENFORCEMENT=enforce)
- [ ] Review audit logs in admin dashboard

## 📱 Custom Domain (if applicable)

- [ ] Domain added in Vercel Dashboard
- [ ] DNS records configured correctly
- [ ] SSL certificate issued (automatic with Vercel)
- [ ] Domain added to Firebase Authentication authorized domains
- [ ] `NEXT_PUBLIC_SITE_URL` updated to custom domain
- [ ] Email links use custom domain

## 🆘 Rollback Plan

Know how to rollback if issues occur:

```bash
# View recent deployments
vercel ls

# Promote a previous deployment
vercel promote <deployment-url>
```

Or use Vercel Dashboard → Deployments → Click on previous deployment → Promote to Production

## 📞 Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Firebase Support**: https://firebase.google.com/support
- **DNS Provider**: [Your provider]
- **Email Provider**: [Your provider]

---

## Deployment Sign-Off

**Deployed by**: _________________  
**Date**: _________________  
**Production URL**: _________________  
**Notes**: _________________

---

**Last Updated**: November 2024
