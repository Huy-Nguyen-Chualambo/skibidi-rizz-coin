# SkibidiRizz Token - Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Node.js (v18+)
- ✅ MetaMask wallet with Sepolia ETH
- ✅ Alchemy/Infura API key
- ✅ Etherscan API key (for verification)

---

## 🚀 Step-by-Step Deployment

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment Variables

Create `.env` file in root directory:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **IMPORTANT**: Never commit `.env` file to Git!

### Step 3: Get Testnet ETH

Get free Sepolia ETH from faucets:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

You'll need ~0.1 ETH for deployment and testing.

### Step 4: Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
Compiled 10 Solidity files successfully
```

### Step 5: Run Tests (Optional but Recommended)

```bash
npx hardhat test
```

All tests should pass:
```
  SkibidiRizz Airdrop Platform
    Token Deployment
      ✓ Should have correct name and symbol
      ✓ Should have correct total supply
      ✓ Should transfer airdrop allocation correctly
    Airdrop Functionality
      ✓ Should allow whitelisted user to claim
      ✓ Should prevent double claiming
      ✓ Should reject non-whitelisted users
    ...
  
  15 passing (2s)
```

### Step 6: Generate Merkle Tree

Update whitelist addresses in `scripts/generate-merkle-tree.js`:

```javascript
const whitelist = [
  "0xYourAddress1",
  "0xYourAddress2",
  // Add more addresses...
];
```

Generate tree:
```bash
node scripts/generate-merkle-tree.js
```

Save the output `merkle-tree.json` - you'll need it for frontend!

### Step 7: Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:
```
🚀 Deploying SkibidiRizz Airdrop Platform...

1️⃣  Deploying SkibidiRizzToken...
✅ SkibidiRizzToken deployed to: 0x1234...
   Total Supply: 1000000.0 SRT

2️⃣  Creating Merkle Tree for whitelist...
✅ Merkle Root: 0xabcd...

3️⃣  Deploying SkibidiAirdrop contract...
✅ SkibidiAirdrop deployed to: 0x5678...

4️⃣  Transferring tokens to Airdrop contract...
✅ Transferred 400000.0 SRT

5️⃣  Configuring airdrop parameters...
✅ Airdrop activated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 DEPLOYMENT COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Contract Addresses:
   Token: 0x1234...
   Airdrop: 0x5678...
```

**💾 SAVE THESE ADDRESSES!** You'll need them for:
- Frontend configuration
- Contract verification
- User communication

### Step 8: Verify Contracts on Etherscan

```bash
# Verify token contract
npx hardhat verify --network sepolia <TOKEN_ADDRESS> "<DEPLOYER_ADDRESS>"

# Verify airdrop contract
npx hardhat verify --network sepolia <AIRDROP_ADDRESS> "<TOKEN_ADDRESS>" "<MERKLE_ROOT>" "<AIRDROP_AMOUNT>" "<DEPLOYER_ADDRESS>"
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234... "0xYourAddress"
```

Verified contracts will have a green checkmark on Etherscan! ✅

### Step 9: Configure Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_TOKEN_ADDRESS=0x1234...
NEXT_PUBLIC_AIRDROP_ADDRESS=0x5678...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CHAIN_NAME=Sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_BLOCK_EXPLORER=https://sepolia.etherscan.io
NEXT_PUBLIC_MERKLE_ROOT=0xabcd...
```

### Step 10: Run Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

---

## 🧪 Testing the Airdrop

1. **Connect MetaMask** to Sepolia testnet
2. **Switch account** to one of the whitelisted addresses
3. **Click "Claim Airdrop"**
4. **Confirm transaction** in MetaMask
5. **Wait 10-30 seconds** for confirmation
6. **Check balance** in MetaMask - you should see 1,000 SRT!

---

## 📊 Monitoring & Analytics

### Check Contract on Etherscan
```
Token: https://sepolia.etherscan.io/address/<TOKEN_ADDRESS>
Airdrop: https://sepolia.etherscan.io/address/<AIRDROP_ADDRESS>
```

### View Stats Programmatically
```bash
npx hardhat console --network sepolia
```

```javascript
const airdrop = await ethers.getContractAt("SkibidiAirdrop", "<AIRDROP_ADDRESS>");
const stats = await airdrop.getStats();
console.log("Total Claimed:", ethers.formatEther(stats[0]));
console.log("Total Participants:", stats[1].toString());
```

---

## 🔧 Troubleshooting

### Error: "insufficient funds for gas"
**Solution**: Add more Sepolia ETH to your wallet from faucets

### Error: "nonce too high"
**Solution**: Reset MetaMask account in Settings → Advanced → Clear Activity Tab Data

### Error: "Cannot find module"
**Solution**: Run `npm install` in root and frontend directories

### Frontend shows "Contract not found"
**Solution**: Double-check `.env.local` has correct contract addresses

### Transaction pending forever
**Solution**: Increase gas price in MetaMask or wait for network congestion to clear

---

## 🛡️ Security Checklist

Before mainnet deployment:

- [ ] Professional audit completed (CertiK, OpenZeppelin, etc.)
- [ ] Testnet thoroughly tested (minimum 1 week)
- [ ] Multi-sig setup for admin functions
- [ ] Emergency pause mechanism tested
- [ ] Merkle tree verified independently
- [ ] Frontend security review (XSS, CSRF protection)
- [ ] Rate limiting on claim endpoint
- [ ] Bug bounty program launched

---

## 📈 Post-Deployment Tasks

1. **Announce on Social Media** (Twitter, Discord, Telegram)
2. **Submit to DeFi listings** (CoinGecko, CoinMarketCap)
3. **Set up monitoring** (Tenderly, Defender)
4. **Create tutorial videos** for users
5. **Launch community contests** to drive engagement

---

## 🆘 Support

Need help? Contact us:
- Discord: discord.gg/skibidirizz
- Twitter: @SkibidiRizz
- Email: support@skibidirizz.io

---

**Happy Deploying! 🚀**
