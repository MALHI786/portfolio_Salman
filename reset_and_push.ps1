# Script to clear git history and push current files fresh to GitHub
# Run this in PowerShell from the portfolio directory

Write-Host "Step 1: Aborting any ongoing rebase..." -ForegroundColor Yellow
git rebase --abort 2>$null

Write-Host "`nStep 2: Resetting to detached state..." -ForegroundColor Yellow
git checkout main 2>$null
if (-not $?) {
    git checkout -b main
}

Write-Host "`nStep 3: Removing all files from git tracking..." -ForegroundColor Yellow
git rm -r --cached . 2>$null

Write-Host "`nStep 4: Adding all current files..." -ForegroundColor Yellow
git add .

Write-Host "`nStep 5: Creating fresh commit..." -ForegroundColor Yellow
git commit -m "Fresh setup: Portfolio with LongCat chatbot integration"

Write-Host "`nStep 6: Force pushing to GitHub (this will overwrite remote)..." -ForegroundColor Yellow
Write-Host "WARNING: This will DELETE all previous commits on GitHub!" -ForegroundColor Red
$confirm = Read-Host "Type 'YES' to continue"

if ($confirm -eq 'YES') {
    git push -f origin main
    Write-Host "`nDone! Repository has been reset and pushed fresh." -ForegroundColor Green
} else {
    Write-Host "`nCancelled. No changes pushed to GitHub." -ForegroundColor Yellow
}

Write-Host "`nCurrent status:" -ForegroundColor Cyan
git status
