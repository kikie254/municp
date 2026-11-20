# ─────────────────────────────────────────────────────────────────────────────
# Automated Deployment Script for Iten-Tambach Municipality
# ─────────────────────────────────────────────────────────────────────────────

Write-Host "🚀 Iten-Tambach Municipality Deployment Script" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "📦 Checking Vercel CLI..." -ForegroundColor Cyan
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 1: Login
Write-Host "🔐 Step 1: Login to Vercel" -ForegroundColor Cyan
Write-Host "This will open your browser for authentication..." -ForegroundColor Yellow
Write-Host ""

vercel login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login failed. Please try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Successfully logged in to Vercel!" -ForegroundColor Green
Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 2: Check if project is linked
Write-Host "🔗 Step 2: Checking project link..." -ForegroundColor Cyan
Write-Host ""

$linked = Test-Path ".vercel"

if (-not $linked) {
    Write-Host "⚠️  Project not linked to Vercel yet." -ForegroundColor Yellow
    Write-Host "Linking project now..." -ForegroundColor Yellow
    Write-Host ""
    
    vercel link
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Project linking failed." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Project linked successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Project already linked to Vercel" -ForegroundColor Green
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 3: Check environment variables
Write-Host "🔧 Step 3: Checking environment variables..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Listing current environment variables..." -ForegroundColor Yellow
vercel env ls

Write-Host ""
Write-Host "⚠️  IMPORTANT: Ensure all environment variables are set!" -ForegroundColor Yellow
Write-Host "If variables are missing, run: .\upload-env-to-vercel.ps1" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Continue with deployment? (Y/N)"
if ($continue -ne "Y" -and $continue -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 4: Deploy
Write-Host "🚀 Step 4: Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose deployment type:" -ForegroundColor Yellow
Write-Host "  1) Preview (for testing)" -ForegroundColor White
Write-Host "  2) Production (live site)" -ForegroundColor White
Write-Host ""

$deployType = Read-Host "Enter choice (1 or 2)"

Write-Host ""

if ($deployType -eq "2") {
    Write-Host "🌐 Deploying to PRODUCTION..." -ForegroundColor Cyan
    vercel --prod
} else {
    Write-Host "🔍 Deploying to PREVIEW..." -ForegroundColor Cyan
    vercel
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Missing environment variables" -ForegroundColor White
    Write-Host "  - Build errors (check logs)" -ForegroundColor White
    Write-Host "  - Network issues" -ForegroundColor White
    Write-Host ""
    Write-Host "Check logs: vercel logs" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Deployment Successful!" -ForegroundColor Green
Write-Host ""

# Step 5: Get deployment info
Write-Host "📊 Deployment Information:" -ForegroundColor Cyan
Write-Host ""

vercel ls --limit 1

Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 6: Verification
Write-Host "🔍 Next Steps - Verify Deployment:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Visit your deployment URL" -ForegroundColor White
Write-Host "2. Test health endpoint: /api/health" -ForegroundColor White
Write-Host "3. Check admin login: /admin/login" -ForegroundColor White
Write-Host "4. Review logs: vercel logs" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANT: Update NEXT_PUBLIC_SITE_URL" -ForegroundColor Yellow
Write-Host "After first deployment:" -ForegroundColor Yellow
Write-Host "  1. Copy your deployment URL" -ForegroundColor White
Write-Host "  2. Go to Vercel Dashboard → Environment Variables" -ForegroundColor White
Write-Host "  3. Update NEXT_PUBLIC_SITE_URL with the real URL" -ForegroundColor White
Write-Host "  4. Redeploy: vercel --prod" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
