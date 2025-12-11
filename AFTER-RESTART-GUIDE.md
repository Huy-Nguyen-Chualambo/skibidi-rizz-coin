# 🔄 After Restart Guide - Why Your Tokens Disappeared

## 🎯 **WHAT HAPPENED?**

When you **turned off your computer**:

```
Computer shutdown
    ↓
Hardhat node stopped
    ↓
RAM cleared (blockchain was in-memory!)
    ↓
ALL DATA LOST ❌
    ↓
- Contracts gone
- Balances reset
- Transaction history gone
- Deployed addresses invalid
```

**This is NORMAL behavior** for Hardhat local development!

---

## 💡 **WHY THIS HAPPENS:**

### Hardhat Local Node = In-Memory Blockchain

```
Traditional Database (MySQL, PostgreSQL):
├── Data → Stored on DISK
├── Shutdown → Data PERSISTS ✅
└── Restart → Data still there!

Hardhat Local Node:
├── Data → Stored in RAM (memory)
├── Shutdown → Data LOST ❌
└── Restart → Fresh blockchain, no history!
```

**Analogy**: Like using Notepad without saving - close it and everything's gone!

---

## ✅ **SOLUTION: Redeploy (Already Done!)**

I've already:
- ✅ Redeployed contracts to fresh blockchain
- ✅ Updated `.env.local` with new addresses
- ✅ Generated new Merkle root

**New Contract Addresses**:
```
Token:   0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
Airdrop: 0x0165878A594ca255338adfa4d48449f69242Eb8F
```

---

## 🚀 **WHAT YOU NEED TO DO NOW:**

### **Step 1: Restart Frontend** ⚠️ CRITICAL

Frontend needs to reload new environment variables!

**In terminal running `npm run dev`**:
1. Press `Ctrl+C` to stop
2. Run `npm run dev` again
3. Wait for "Ready" message

### **Step 2: Refresh Browser**

Hard refresh to clear cache:
```
Ctrl + Shift + R
```

Or:
```
Ctrl + F5
```

### **Step 3: Reconnect MetaMask**

1. Disconnect wallet (if connected)
2. Connect again
3. Select your account

### **Step 4: Claim Airdrop Again!**

1. Click "Claim Airdrop"
2. Confirm transaction
3. Get 1,000 SRT! 🎁

### **Step 5: Add Token to MetaMask Again**

**Import SRT Token**:
```
Address: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
Symbol: SRT
Decimals: 18
```

---

## ⚡ **QUICK RESTART AUTOMATION:**

Next time you restart, just run:

```powershell
.\restart-dev.ps1
```

This script will:
1. ✅ Check Hardhat node is running
2. ✅ Deploy contracts
3. ✅ Update `.env.local`
4. ✅ Show new addresses

**Then you only need to**:
1. Restart frontend
2. Refresh browser
3. Claim again!

---

## 🔄 **TYPICAL WORKFLOW:**

### **Every Day:**

```
Morning:
1. Start Hardhat node: npx hardhat node
2. Run restart script: .\restart-dev.ps1
3. Start frontend: cd frontend && npm run dev
4. Refresh browser
5. Claim airdrop (fresh state!)

Evening:
- Stop everything
- Shutdown computer
- Data lost (expected!)

Next Morning:
- Repeat above steps
```

---

## 💾 **HOW TO PERSIST DATA? (Advanced)**

If you want data to survive restarts, you have options:

### **Option 1: Use Testnet** (Recommended)

Deploy to **Sepolia** testnet:
- Data persists forever ✅
- Free testnet ETH from faucets
- Real blockchain behavior

**Setup**:
```bash
# Get testnet ETH from faucet
# Configure .env with private key and RPC
npx hardhat run scripts/deploy.js --network sepolia
```

Contracts stay deployed even after restart!

### **Option 2: Keep Hardhat Node Running**

Don't shutdown:
- Keep computer on
- Keep `npx hardhat node` terminal running
- Or use `screen`/`tmux` on Linux/Mac

### **Option 3: Hardhat Persistence (Complex)**

Use `hardhat-deploy` plugin:
```bash
npm install --save-dev hardhat-deploy
```

Configure to save state to disk.

**For learning/testing**, **local restart is actually GOOD**:
- ✅ Always fresh state
- ✅ No old data confusion
- ✅ Practice deployment
- ✅ Test different scenarios

---

## 🎓 **LEARNING MOMENT:**

This teaches important blockchain concepts:

### **1. Immutability ≠ Persistence**

```
Blockchain data is IMMUTABLE:
- Can't change past transactions ✅

But NOT automatically PERSISTENT:
- Need nodes to store data
- Local node = temporary
- Network nodes = permanent
```

### **2. Contract Deployment**

```
Contract deployment:
- Creates NEW instance every time
- NEW address every deployment
- Old addresses become invalid
```

### **3. State vs Code**

```
Smart Contract:
├── Code: The logic (in .sol files)
└── State: The data (balances, claims, etc.)

Redeployment:
├── Code: SAME (from your files) ✅
└── State: FRESH (all zeros) 🔄
```

---

## 📊 **WHAT YOU LOST vs WHAT YOU KEPT:**

### ❌ **Lost (on blockchain)**:
- Token balances (were on old blockchain)
- Claim history (was on old blockchain)
- Contract state (was in RAM)
- Transaction history (was in RAM)

### ✅ **Kept (in your project)**:
- Smart contract code (in `.sol` files)
- Frontend code (in `frontend/`)
- All scripts (in `scripts/`)
- Documentation (in `docs/`)
- `.gitignore` and config files

**Nothing important lost!** Just need to redeploy.

---

## 🎯 **BEST PRACTICES:**

### **For Development:**
1. ✅ Use local Hardhat node (fast, free)
2. ✅ Expect to restart often
3. ✅ Use `restart-dev.ps1` script
4. ✅ Keep test scripts ready

### **For Testing:**
1. ✅ Deploy to testnet (Sepolia)
2. ✅ Share with beta testers
3. ✅ Collect feedback
4. ✅ Iterate

### **For Production:**
1. ✅ Professional audit
2. ✅ Deploy to mainnet
3. ✅ Data persists forever!
4. ✅ No more restarts needed

---

## 🆘 **TROUBLESHOOTING:**

### **Frontend still shows old address?**

**Solution**:
```bash
# Must restart frontend!
# Ctrl+C in npm terminal
cd frontend
npm run dev
```

### **MetaMask shows wrong network?**

**Solution**:
- Disconnect wallet
- Reconnect
- Ensure "Hardhat Local (1337)" selected

### **Still can't claim?**

Check:
1. [ ] Hardhat node running?
2. [ ] Contracts deployed? (`deployment-info.json` exists)
3. [ ] Frontend restarted?
4. [ ] Browser refreshed (Ctrl+Shift+R)?
5. [ ] MetaMask on localhost network?
6. [ ] Using whitelisted address?

### **Transaction fails?**

**Check**:
- Account has ETH for gas?
- Using correct network (Chain ID 1337)?
- Contract addresses updated?

Run:
```bash
npx hardhat run scripts/transfer-eth.js --network localhost
```

To get ETH for gas!

---

## ✅ **CURRENT STATUS:**

**After following this guide**:
- [x] ✅ Contracts redeployed
- [x] ✅ `.env.local` updated
- [ ] **⚠️ Frontend needs restart** ← DO THIS!
- [ ] Browser needs refresh
- [ ] MetaMask needs reconnect
- [ ] Ready to claim again!

---

## 🎉 **SUMMARY:**

### **What Happened:**
Hardhat node is in-memory → Restart = fresh blockchain

### **What I Did:**
- ✅ Explained why tokens disappeared
- ✅ Redeployed contracts
- ✅ Updated frontend config
- ✅ Created restart script
- ✅ Documented everything

### **What You Do:**
1. Restart frontend (`Ctrl+C` → `npm run dev`)
2. Refresh browser (`Ctrl+Shift+R`)
3. Claim airdrop again!
4. Add token to MetaMask again

### **For Future:**
Use `restart-dev.ps1` script every morning!

---

## 📝 **QUICK REFERENCE:**

### **Every Restart:**
```powershell
# Terminal 1
npx hardhat node

# Terminal 2
.\restart-dev.ps1

# Terminal 3
cd frontend
npm run dev

# Browser
Ctrl+Shift+R
```

### **Check Balances:**
```bash
npx hardhat run scripts/check-balances.js --network localhost
```

### **Transfer ETH:**
```bash
npx hardhat run scripts/transfer-eth.js --network localhost
```

---

**You're back on track!** 🚀

**Just restart frontend and claim again!** 🎁
