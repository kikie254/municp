# ─────────────────────────────────────────────────────────────────────────────
# Upload Environment Variables to Vercel
# 
# This script reads .env.production and uploads each variable to Vercel
# Usage: .\upload-env-to-vercel.ps1
# ─────────────────────────────────────────────────────────────────────────────

Write-Host "🚀 Uploading Environment Variables to Vercel" -ForegroundColor Green
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    Write-Host "Please make sure you're in the project root directory." -ForegroundColor Yellow
    exit 1
}

# Check if vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    if (-not $vercelVersion) {
        throw "Vercel CLI not found"
    }
} catch {
    Write-Host "❌ Error: Vercel CLI is not installed!" -ForegroundColor Red
    Write-Host "Install it with: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Reading .env.production file..." -ForegroundColor Cyan
Write-Host ""

# Read .env.production file
$envContent = Get-Content ".env.production"

# Parse environment variables
$envVars = @()
foreach ($line in $envContent) {
    $line = $line.Trim()
    
    # Skip comments and empty lines
    if ($line -match "^#" -or $line -eq "") {
        continue
    }
    
    # Parse KEY=VALUE
    if ($line -match "^([^=]+)=(.*)$") {
        $key = $Matches[1].Trim()
        $value = $Matches[2].Trim()
        
        # Remove quotes if present
        if ($value -match '^"(.*)"$') {
            $value = $Matches[1]
        }
        
        # Skip empty values (except for intentionally empty ones)
        if ($value -eq "" -and -not ($key -match "EMAIL_API_KEY|UPSTASH")) {
            Write-Host "⏭️  Skipping $key (empty value)" -ForegroundColor Yellow
            continue
        }
        
        $envVars += @{
            Key = $key
            Value = $value
        }
    }
}

Write-Host "Found $($envVars.Count) environment variables to upload" -ForegroundColor Green
Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Ask for environment scope
Write-Host "Select environment scope:" -ForegroundColor Cyan
Write-Host "  1) Production (recommended for production deployment)" -ForegroundColor White
Write-Host "  2) Preview (for development/staging)" -ForegroundColor White
Write-Host "  3) Both Production and Preview" -ForegroundColor White
Write-Host ""
$scope = Read-Host "Enter choice (1-3)"

$environments = @()
switch ($scope) {
    "1" { $environments = @("production") }
    "2" { $environments = @("preview") }
    "3" { $environments = @("production", "preview") }
    default { 
        Write-Host "❌ Invalid choice. Defaulting to production." -ForegroundColor Red
        $environments = @("production")
    }
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Upload each variable
$successCount = 0
$failCount = 0

foreach ($env in $envVars) {
    $key = $env.Key
    $value = $env.Value
    
    # Mask sensitive values in output
    $displayValue = $value
    if ($key -match "SECRET|KEY|PASSWORD|TOKEN" -and $key -notmatch "NEXT_PUBLIC") {
        $displayValue = "[REDACTED]"
    }
    
    Write-Host "Uploading: $key = $displayValue" -ForegroundColor White
    
    foreach ($envScope in $environments) {
        try {
            # Create a temporary file with the value
            $tempFile = [System.IO.Path]::GetTempFileName()
            Set-Content -Path $tempFile -Value $value -NoNewline
            
            # Upload to Vercel using input redirection
            $result = Get-Content $tempFile | vercel env add $key $envScope 2>&1
            
            # Clean up temp file
            Remove-Item $tempFile -Force
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Added to $envScope" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "  ⚠️  May already exist in $envScope or needs manual review" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ❌ Failed to add to $envScope" -ForegroundColor Red
            $failCount++
        }
    }
    
    Write-Host ""
}

Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Successful uploads: $successCount" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "  ❌ Failed uploads: $failCount" -ForegroundColor Red
}
Write-Host ""
Write-Host "────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANT: Remember to update NEXT_PUBLIC_SITE_URL" -ForegroundColor Yellow
Write-Host "   with your actual Vercel URL after deployment!" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Run: vercel --prod" -ForegroundColor White
Write-Host "  2. Get your deployment URL" -ForegroundColor White
Write-Host "  3. Update NEXT_PUBLIC_SITE_URL with that URL" -ForegroundColor White
Write-Host "  4. Redeploy: vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Done!" -ForegroundColor Green
