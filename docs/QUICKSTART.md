# Quick Start Guide - SkibidiRizz Token

## 🚀 5-Minute Setup

Hướng dẫn nhanh để chạy dự án trong 5 phút!

---

## Step 1: Prerequisites ✅

Đảm bảo bạn đã cài đặt:
- ✅ **Node.js** v18+ ([Download](https://nodejs.org/))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **MetaMask** browser extension ([Download](https://metamask.io/))

Kiểm tra version:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
git --version   # Any recent version
```

---

## Step 2: Clone & Install ⬇️

```bash
# Clone repository
git clone https://github.com/yourusername/Skibidi-rizz-coin.git
cd Skibidi-rizz-coin

# Install dependencies (root)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Time**: ~2 minutes (depending on internet speed)

---

## Step 3: Local Development 🖥️

### Option A: Test on Local Hardhat Network

**Terminal 1** - Start local blockchain:
```bash
npx hardhat node
```
Để terminal này chạy! (Nó sẽ liệt kê 20 test accounts với private keys)

**Terminal 2** - Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

Lưu lại **contract addresses** được in ra!

**Terminal 3** - Start frontend:
```bash
cd frontend

# Tạo file .env.local
echo "NEXT_PUBLIC_TOKEN_ADDRESS=<TOKEN_ADDRESS_FROM_STEP_2>" > .env.local
echo "NEXT_PUBLIC_AIRDROP_ADDRESS=<AIRDROP_ADDRESS_FROM_STEP_2>" >> .env.local
echo "NEXT_PUBLIC_CHAIN_ID=1337" >> .env.local
echo "NEXT_PUBLIC_CHAIN_NAME=Localhost" >> .env.local

npm run dev
```

**Terminal 4** - Open browser:
```
Open: http://localhost:3000
```

### Configure MetaMask for Local Network

1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Fill in:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
4. Import one of the test accounts from Terminal 1 using private key

---

### Option B: Test on Sepolia Testnet

**Step 1**: Get Sepolia testnet ETH
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

**Step 2**: Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
ETHERSCAN_API_KEY=your_etherscan_key_here
```

**Step 3**: Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Step 4**: Update frontend `.env.local`:
```bash
cd frontend
cp env.example .env.local
```

Edit `frontend/.env.local` với addresses từ deployment:
```env
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_AIRDROP_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CHAIN_NAME=Sepolia
NEXT_PUBLIC_BLOCK_EXPLORER=https://sepolia.etherscan.io
```

**Step 5**: Run frontend:
```bash
npm run dev
```

**Step 6**: Configure MetaMask
- Switch to Sepolia network
- Visit http://localhost:3000
- Connect wallet

---

## Step 4: Test the Airdrop 🎁

1. **Connect MetaMask** to the app
2. **Check eligibility** (your address should be in whitelist từ deployment script)
3. **Click "Claim Airdrop"**
4. **Approve transaction** in MetaMask
5. **Wait ~10-30 seconds** for confirmation
6. **Check balance** - You should see 1,000 SRT!

---

## 🐛 Troubleshooting

### Problem: "Module not found"
**Solution**: 
```bash
npm install
cd frontend && npm install
```

### Problem: "Insufficient funds"
**Solution**: 
- Local: Import account from Hardhat node
- Sepolia: Get testnet ETH from faucet

### Problem: "ChainID mismatch"
**Solution**: 
- Check `.env.local` has correct CHAIN_ID
- Make sure MetaMask is on same network

### Problem: "Transaction failed"
**Solution**: 
- Check you're on whitelist (scripts/generate-merkle-tree.js)
- Make sure airdrop is active
- Try increasing gas limit

### Problem: "Cannot connect to network"
**Solution**: 
- Local: Make sure `npx hardhat node` is running
- Sepolia: Check RPC URL in .env

---

## 📚 Next Steps

Once everything is working:

1. **Read Documentation**:
   - [Whitepaper](docs/WHITEPAPER.md)
   - [Deployment Guide](docs/DEPLOYMENT.md)
   - [Testing & Risks](docs/TESTING-AND-RISKS.md)

2. **Run Tests**:
   ```bash
   npx hardhat test
   npx hardhat coverage
   ```

3. **Customize**:
   - Update whitelist in `scripts/generate-merkle-tree.js`
   - Modify tokenomics in contracts
   - Customize frontend styling

4. **Deploy to Mainnet** (when ready):
   - Get professional audit
   - Set up multi-sig wallet
   - Follow DEPLOYMENT.md checklist

---

## 🆘 Need Help?

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/Skibidi-rizz-coin/issues)
- **Discord**: discord.gg/skibidirizz
- **Email**: support@skibidirizz.io

---

## 🎉 Success!

If you see the landing page and can connect MetaMask, **congratulations!** 🎊

You've successfully set up the SkibidiRizz Token airdrop platform.

**Happy coding! 🚀**
