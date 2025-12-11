# ⚡ Quick Restart Script
# Run this after restarting Hardhat node

Write-Host "🔄 Restarting Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Hardhat node is running
Write-Host "1️⃣  Checking Hardhat node..." -ForegroundColor Yellow
$hardhatRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*hardhat*"}
if (-not $hardhatRunning) {
    Write-Host "⚠️  Hardhat node is not running!" -ForegroundColor Red
    Write-Host "   Please start it first: npx hardhat node" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Hardhat node is running" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy contracts
Write-Host "2️⃣  Deploying contracts to local network..." -ForegroundColor Yellow
npx hardhat run scripts/deploy.js --network localhost
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Contracts deployed" -ForegroundColor Green
Write-Host ""

# Step 3: Read deployment info
Write-Host "3️⃣  Reading deployment info..." -ForegroundColor Yellow
$deploymentData = Get-Content "deployment-info.json" | ConvertFrom-Json
$tokenAddress = $deploymentData.contracts.token
$airdropAddress = $deploymentData.contracts.airdrop
$merkleRoot = $deploymentData.config.merkleRoot

Write-Host "   Token:   $tokenAddress" -ForegroundColor Cyan
Write-Host "   Airdrop: $airdropAddress" -ForegroundColor Cyan
Write-Host ""

# Step 4: Update frontend .env.local
Write-Host "4️⃣  Updating frontend environment..." -ForegroundColor Yellow
$envContent = @"
# Contract addresses from local deployment
NEXT_PUBLIC_TOKEN_ADDRESS=$tokenAddress
NEXT_PUBLIC_AIRDROP_ADDRESS=$airdropAddress

# Network configuration
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_CHAIN_NAME=Localhost
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_BLOCK_EXPLORER=http://localhost:8545

# Merkle root
NEXT_PUBLIC_MERKLE_ROOT=$merkleRoot
"@

$envContent | Out-File -FilePath "frontend\.env.local" -Encoding utf8
Write-Host "✅ Frontend environment updated" -ForegroundColor Green
Write-Host ""

# Step 5: Instructions
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 RESTART COMPLETE!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 New Contract Addresses:" -ForegroundColor Yellow
Write-Host "   Token:   $tokenAddress" -ForegroundColor White
Write-Host "   Airdrop: $airdropAddress" -ForegroundColor White
Write-Host ""
Write-Host "🔄 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. Restart frontend: Ctrl+C in npm terminal, then 'npm run dev'" -ForegroundColor White
Write-Host "   2. Refresh browser: Ctrl+Shift+R" -ForegroundColor White
Write-Host "   3. Reconnect MetaMask" -ForegroundColor White
Write-Host "   4. Claim your airdrop again! 🎁" -ForegroundColor White
Write-Host ""
Write-Host "💡 NOTE: You'll need to import SRT token again in MetaMask" -ForegroundColor Yellow
Write-Host "   Token Address: $tokenAddress" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Ready to go!" -ForegroundColor Green
