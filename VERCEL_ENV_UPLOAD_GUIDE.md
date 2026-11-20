# 📤 Upload Environment Variables to Vercel

This guide shows you how to upload your environment variables from `.env.production` to Vercel.

## 🎯 Quick Methods

### Method 1: Automated PowerShell Script (Windows - Easiest)

```powershell
.\upload-env-to-vercel.ps1
```

This script will:
1. Read `.env.production`
2. Parse all environment variables
3. Upload each one to Vercel
4. Ask you to choose Production, Preview, or Both

**Prerequisites**: You must be logged in to Vercel (`vercel login`)

---

### Method 2: Vercel Dashboard (Manual - Most Reliable)

1. **Open Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Select your project (or create one)

2. **Navigate to Environment Variables**
   - Click **Settings** → **Environment Variables**

3. **Add Each Variable**
   - Click **Add** button
   - **Key**: Copy from `.env.production` (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Copy the corresponding value
   - **Environment**: Select **Production** and/or **Preview**
   - Click **Save**

4. **Repeat for All Variables**

**💡 Tip**: Open `.env.production` in one window and Vercel Dashboard in another for easy copy-paste.

---

### Method 3: Vercel CLI (One by One)

For each variable in `.env.production`, run:

```powershell
# For production environment
vercel env add VARIABLE_NAME production

# For preview environment  
vercel env add VARIABLE_NAME preview

# Then paste the value when prompted
```

**Example:**

```powershell
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# Paste: AIzaSyAZcbuLEmcEGAq_1L3dlg0GQakdsjLDdBg

vercel env add FIREBASE_ADMIN_PROJECT_ID production
# Paste: municip-dced5

# ... repeat for each variable
```

---

### Method 4: Bulk Import via File (Advanced)

Vercel CLI can import from a file, but requires specific format:

```powershell
# Pull existing variables (creates .env.production.local)
vercel env pull .env.production.local

# Edit that file with your values
# Then push back (NOTE: This may not work for all variable types)
```

⚠️ **Note**: This method may not work reliably for all variable types, especially multiline values like `FIREBASE_ADMIN_PRIVATE_KEY`.

---

## 📋 Complete Variable List

Here's what you need to upload from `.env.production`:

### Public Variables (Safe to expose)
```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Private Variables (Server-only)
```
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY    ⚠️ MULTILINE - Be careful!
FIREBASE_WEB_API_KEY
PRIVACY_HASH_SECRET
SESSION_TTL_HOURS
MFA_ENFORCEMENT
EMAIL_PROVIDER
EMAIL_FROM
MUNICIPAL_NOTIFICATIONS_EMAIL
MAX_UPLOAD_BYTES
```

### Optional Variables
```
EMAIL_API_KEY                  (if you have email service)
UPSTASH_REDIS_REST_URL        (if using Redis)
UPSTASH_REDIS_REST_TOKEN      (if using Redis)
```

---

## ⚠️ Special Handling for FIREBASE_ADMIN_PRIVATE_KEY

The private key is multiline and needs special care:

### In Vercel Dashboard:
1. Click **Add**
2. Key: `FIREBASE_ADMIN_PRIVATE_KEY`
3. Value: Paste the ENTIRE key including:
   ```
   "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...\n-----END PRIVATE KEY-----\n"
   ```
4. Make sure the `\n` characters are preserved (they represent newlines)
5. Keep the quotes

### In Vercel CLI:
```powershell
vercel env add FIREBASE_ADMIN_PRIVATE_KEY production
# When prompted, paste the entire value with \n characters
```

---

## 🔍 Verify Upload

After uploading, verify your variables:

```powershell
# List all environment variables
vercel env ls

# Should show all your variables for the selected environment
```

---

## 🚀 After Uploading Variables

### 1. Deploy to Vercel

```powershell
# Deploy to production
vercel --prod
```

### 2. Get Your Deployment URL

You'll receive a URL like:
```
https://iten-tambach-municipality-abc123.vercel.app
```

### 3. Update NEXT_PUBLIC_SITE_URL

Go back to Vercel Dashboard → Environment Variables and update:

**Key**: `NEXT_PUBLIC_SITE_URL`  
**Value**: `https://your-actual-vercel-url.vercel.app`

### 4. Redeploy

```powershell
vercel --prod
```

Now your site will use the correct URL!

---

## 🔧 Troubleshooting

### "Variable already exists"

**Solution**: Either:
- Delete the existing variable in Vercel Dashboard first
- Or use `vercel env rm VARIABLE_NAME production` then add again

### "Invalid value" for FIREBASE_ADMIN_PRIVATE_KEY

**Solution**: 
- Make sure you're copying the value WITH quotes
- Ensure `\n` characters are present for newlines
- Don't add extra spaces or newlines
- The value should start with `"-----BEGIN` and end with `-----\n"`

### Script fails to run

**Solution**:
```powershell
# Allow script execution (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again
.\upload-env-to-vercel.ps1
```

### Too many variables to add manually

**Solution**: Use the PowerShell script (Method 1) or Vercel Dashboard bulk copy-paste (Method 2)

---

## 📊 Checklist

Before deploying, ensure you've added:

- [ ] All `NEXT_PUBLIC_*` variables
- [ ] All Firebase Admin variables
- [ ] `PRIVACY_HASH_SECRET`
- [ ] Email configuration (if applicable)
- [ ] Optional Redis configuration (if applicable)
- [ ] Correct environment scope selected (Production/Preview)

---

## 🎯 Recommended Workflow

**For first-time deployment:**

1. ✅ Use **Method 2** (Vercel Dashboard) - Most reliable
2. ✅ Add all variables manually by copy-paste
3. ✅ Double-check `FIREBASE_ADMIN_PRIVATE_KEY` is correct
4. ✅ Deploy with `vercel --prod`
5. ✅ Update `NEXT_PUBLIC_SITE_URL` with deployment URL
6. ✅ Redeploy

**For updates:**

1. ✅ Update `.env.production` locally
2. ✅ Run PowerShell script (Method 1)
3. ✅ Or update specific variables in Vercel Dashboard
4. ✅ Redeploy

---

## 📞 Need Help?

- **Vercel Environment Variables Docs**: https://vercel.com/docs/environment-variables
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Project Docs**: See `DEPLOYMENT.md` for full guide

---

**Ready to upload?** Choose Method 1 (automated) or Method 2 (manual) and get started!
