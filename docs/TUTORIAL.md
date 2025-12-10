# Tutorial: Building a DeFi Airdrop from Scratch

## 🎓 Educational Tutorial

Hướng dẫn chi tiết cách xây dựng DeFi Airdrop Platform từ đầu, giải thích từng bước và lý do.

---

## Part 1: Understanding the Basics

### What is an Airdrop?

**Airdrop** là phương thức phân phối token miễn phí cho cộng đồng để:
- Xây dựng community ban đầu
- Tạo liquidity cho token
- Khuyến khích early adopters
- Marketing và brand awareness

### Why Use Merkle Trees?

**Traditional Approach** ❌:
```solidity
mapping(address => bool) public whitelist;

function addToWhitelist(address[] memory users) {
    for (uint i = 0; i < users.length; i++) {
        whitelist[users[i]] = true; // ~20k gas per address
    }
}
```
**Cost**: 10,000 addresses = 200M gas = $3,000+ (at 15 gwei)

**Merkle Tree Approach** ✅:
```solidity
bytes32 public merkleRoot; // ~45k gas ONE TIME

function claimAirdrop(bytes32[] calldata proof) {
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(MerkleProof.verify(proof, merkleRoot, leaf));
    // ~10k gas to verify
}
```
**Cost**: Unlimited addresses = 45k gas = $0.67!

**Savings**: 99.7% 🎉

---

## Part 2: Smart Contract Development

### Step 1: ERC-20 Token

#### Why ERC-20?
- Industry standard
- Compatible with all wallets (MetaMask, Trust Wallet, etc.)
- Supported by all exchanges (Uniswap, Sushiswap, etc.)
- Easy to integrate

#### Key Decisions:

**Total Supply**: 1,000,000 tokens
```solidity
uint256 public constant TOTAL_SUPPLY = 1_000_000 * 10**18;
```
- Small enough để có giá trị
- Large enough để distribute rộng rãi
- 10^18 because 18 decimals (standard for ETH)

**Fixed Supply** vs **Mintable**:
- Fixed = No inflation = Better for holders
- We chose fixed supply để tạo scarcity

**Burnable**:
```solidity
function burn(uint256 amount) external {
    _burn(msg.sender, amount);
}
```
- Allows users to reduce supply
- Potentially increases token value over time

#### OpenZeppelin Libraries

Tại sao dùng OpenZeppelin?
- ✅ Battle-tested (used by top protocols)
- ✅ Audited by professionals
- ✅ Gas-optimized
- ✅ Industry standard

```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
```

---

### Step 2: Airdrop Contract Architecture

#### Core Components:

**1. Merkle Root Storage**
```solidity
bytes32 public merkleRoot;
```
- Stores hash of entire whitelist
- Changed only by admin
- Verifies eligibility off-chain→on-chain

**2. Claim Tracking**
```solidity
mapping(address => bool) public hasClaimed;
```
- Prevents double claims
- Permanently on-chain
- Gas-efficient boolean

**3. Reentrancy Protection**
```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

function claimAirdrop(...) external nonReentrant {
    // Protected against reentrancy attacks
}
```

**What is Reentrancy?**
Attacker calls function → Function calls attacker's contract → Attacker calls original function again → Infinite loop drains funds!

**Solution**: `nonReentrant` modifier blocks recursive calls.

#### Time-Bound Distribution:

```solidity
uint256 public airdropStartTime;
uint256 public airdropEndTime;

require(block.timestamp >= airdropStartTime, "Not started");
require(block.timestamp <= airdropEndTime, "Ended");
```

**Why?**
- Creates urgency (FOMO)
- Limits exposure to bugs
- Allows for multiple campaigns

---

### Step 3: Security Considerations

#### Access Control:
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

function setMerkleRoot(bytes32 _root) external onlyOwner {
    merkleRoot = _root;
}
```

**Owner can**:
- Update merkle root (if error in whitelist)
- Activate/deactivate airdrop
- Emergency withdraw (if needed)

**Owner CANNOT**:
- Take users' tokens (they control their own)
- Change claim history (immutable)
- Bypass time restrictions (enforced by blockchain)

#### Emergency Functions:
```solidity
function emergencyWithdraw() external onlyOwner {
    uint256 balance = token.balanceOf(address(this));
    token.transfer(owner(), balance);
}
```

**When to use**:
- Bug discovered after deployment
- Airdrop cancelled
- Remaining tokens after campaign

⚠️ **Risk**: Centralization. For mainnet, use multi-sig wallet!

---

## Part 3: Frontend Development

### Step 1: Web3 Integration

#### Why Ethers.js?
- Modern API (vs Web3.js)
- TypeScript support
- Better documentation
- Active maintenance

#### Wallet Connection:
```typescript
const provider = new ethers.BrowserProvider(window.ethereum);
const accounts = await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();
```

**Concepts**:
- **Provider**: Read-only connection to blockchain
- **Signer**: Can sign transactions (requires private key)
- **Account**: User's Ethereum address

---

### Step 2: React Context for State Management

#### Why Context API?
- Share wallet state across components
- Avoid prop drilling
- Single source of truth

```typescript
const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  signer: null,
  connectWallet: async () => {},
  // ...
});
```

#### Usage in Components:
```typescript
const { account, connectWallet } = useWeb3();

if (!account) {
  return <button onClick={connectWallet}>Connect</button>;
}
```

---

### Step 3: Transaction Flow

**1. Check Eligibility**:
```typescript
const contract = new ethers.Contract(address, abi, provider);
const merkleProof = [...]; // From backend
const eligible = await contract.isEligible(account, merkleProof);
```

**2. Submit Transaction**:
```typescript
const contractWithSigner = contract.connect(signer);
const tx = await contractWithSigner.claimAirdrop(merkleProof);
```

**3. Wait for Confirmation**:
```typescript
const receipt = await tx.wait();
console.log("Confirmed in block:", receipt.blockNumber);
```

**4. Handle Errors**:
```typescript
try {
  await tx.wait();
} catch (error) {
  if (error.message.includes("Already claimed")) {
    // Show user-friendly message
  }
}
```

---

## Part 4: Testing Strategy

### Unit Tests

**Test Pyramid**:
```
       /\
      /E2E\       ← Few, slow, expensive
     /------\
    /Integra\    ← Some, medium speed
   /----------\
  /Unit Tests \  ← Many, fast, cheap
 /--------------\
```

#### What to Test:

**Happy Path** ✅:
```javascript
it("Should allow eligible user to claim", async () => {
  const tx = await airdrop.connect(user1).claimAirdrop(proof);
  expect(await token.balanceOf(user1.address)).to.equal(AMOUNT);
});
```

**Error Cases** ❌:
```javascript
it("Should reject double claims", async () => {
  await airdrop.connect(user1).claimAirdrop(proof);
  await expect(
    airdrop.connect(user1).claimAirdrop(proof)
  ).to.be.revertedWith("Already claimed");
});
```

**Edge Cases** 🔍:
```javascript
it("Should handle last claim correctly", async () => {
  // Claim until contract has 0 balance
  // Ensure last user gets exact amount
});
```

---

### Gas Testing:

```javascript
it("Should use <50k gas per claim", async () => {
  const tx = await airdrop.claimAirdrop(proof);
  const receipt = await tx.wait();
  expect(receipt.gasUsed).to.be.lessThan(50000);
});
```

**Why measure gas?**
- Lower gas = more accessible
- Predictable costs for users
- Benchmark vs competitors

---

## Part 5: Deployment

### Testnet First!

**Never deploy to mainnet first** ⚠️

Testnets:
- **Sepolia**: Ethereum Foundation official testnet
- **Holesky**: Newer, more stable
- **Goerli**: Being phased out (don't use)

### Deployment Checklist:

- [ ] All tests passing
- [ ] Gas costs acceptable
- [ ] Merkle tree generated
- [ ] Environment variables set
- [ ] Sufficient testnet ETH
- [ ] Team reviewed code

### Post-Deployment:

**Verify on Etherscan**:
```bash
npx hardhat verify --network sepolia <ADDRESS> <CONSTRUCTOR_ARGS>
```

**Why verify?**
- Users can read your code
- Builds trust
- Easier debugging
- Third-party tools can interact

---

## Part 6: Common Pitfalls & Solutions

### Pitfall 1: Nonce Issues

**Problem**: 
```
Error: nonce too high
```

**Cause**: MetaMask nonce out of sync

**Solution**:
```
MetaMask → Settings → Advanced → Clear Activity Tab Data
```

---

### Pitfall 2: Gas Estimation Failure

**Problem**:
```
Error: cannot estimate gas; transaction may fail
```

**Causes**:
- Function will revert (fix logic)
- Insufficient balance
- Wrong network

**Solution**:
- Test function in Hardhat console first
- Check revert reason manually
- Ensure correct network in MetaMask

---

### Pitfall 3: Frontend Not Updating

**Problem**: Stats don't refresh after claim

**Solution**: Poll for changes
```typescript
useEffect(() => {
  const interval = setInterval(fetchStats, 15000);
  return () => clearInterval(interval);
}, []);
```

Or listen to events:
```typescript
contract.on("AirdropClaimed", (user, amount) => {
  if (user === account) {
    // Update UI
  }
});
```

---

## Part 7: Advanced Topics

### Multi-Sig Wallets

For mainnet, **NEVER use single owner**!

**Use Gnosis Safe**:
1. Create multi-sig (e.g., 3-of-5)
2. Deploy contracts from Safe
3. Transfer ownership to Safe
4. All admin actions require multiple approvals

---

### Upgradeable Contracts

**Proxy Pattern**:
```
User → Proxy Contract → Implementation Contract
```

**Benefits**:
- Fix bugs after deployment
- Add features
- Maintain same address

**Risks**:
- Centralization
- Complex security

**Our Choice**: No upgradability for simplicity and security.

---

### Cross-Chain Deployment

To deploy on multiple chains:

1. **Deploy on each chain separately**
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   npx hardhat run scripts/deploy.js --network arbitrum
   ```

2. **Use Canonical Bridges**
   - Lock tokens on chain A
   - Mint wrapped tokens on chain B
   - Burn wrapped to unlock original

3. **Track addresses per chain**
   ```json
   {
     "ethereum": "0x123...",
     "polygon": "0x456...",
     "arbitrum": "0x789..."
   }
   ```

---

## Part 8: Going to Production

### Pre-Launch Checklist:

**Code** ✅:
- [ ] Professional audit ($10k-50k)
- [ ] Bug bounty program
- [ ] Multi-sig setup
- [ ] Timelock on critical functions

**Legal** ⚖️:
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Legal counsel review
- [ ] Compliance check (securities laws)

**Operations** 🏭:
- [ ] Monitoring setup (Tenderly, Defender)
- [ ] Alert system for anomalies
- [ ] Incident response plan
- [ ] Community managers ready

**Marketing** 📢:
- [ ] Social media accounts
- [ ] Community channels (Discord, Telegram)
- [ ] Press release prepared
- [ ] Influencer partnerships

---

## Part 9: Learning Resources

### Beginner:
- **CryptoZombies**: Learn Solidity through game
- **Buildspace**: Project-based learning
- **Alchemy University**: Free blockchain courses

### Intermediate:
- **Ethernaut**: Security challenges
- **Damn Vulnerable DeFi**: Hack DeFi protocols
- **OpenZeppelin Docs**: Smart contract patterns

### Advanced:
- **MEV Research**: Maximal Extractable Value
- **ZK-SNARKs**: Zero-knowledge proofs
- **Layer 2 Scaling**: Rollups and sidechains

---

## Part 10: Final Thoughts

### Key Takeaways:

1. **Security First** 🔒
   - Use audited libraries
   - Test extensively
   - Plan for worst case

2. **User Experience** 😊
   - Make it simple
   - Clear error messages
   - Fast and cheap

3. **Community** 🤝
   - Build in public
   - Listen to feedback
   - Give value first

4. **Sustainability** ♻️
   - Plan long-term
   - Multiple revenue streams
   - Aligned incentives

---

### Your Journey Starts Here! 🚀

You now have:
- ✅ Complete codebase
- ✅ Deep understanding of concepts
- ✅ Production-ready architecture
- ✅ Security best practices
- ✅ Deployment expertise

**Next steps**:
1. Deploy to testnet
2. Get users to test
3. Iterate based on feedback
4. Professional audit
5. Mainnet launch!

**Good luck building the future of DeFi!** 💎

---

## Need Help?

- **Stuck on code?** → Review `/test` folder for examples
- **Can't deploy?** → Check `DEPLOYMENT.md`
- **Security question?** → Read `TESTING-AND-RISKS.md`
- **Still confused?** → Ask in Discord or create GitHub issue

**Remember**: Every expert was once a beginner. Keep learning! 📚

---

*Tutorial Version 1.0 | December 2024*
