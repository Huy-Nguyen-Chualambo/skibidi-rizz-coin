# SkibidiRizz Token - Architecture Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                      │
│  ┌───────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐ │
│  │  Landing  │  │  Claim   │  │   Stats    │  │  Wallet  │ │
│  │   Page    │  │   Form   │  │ Dashboard  │  │ Connect  │ │
│  └─────┬─────┘  └────┬─────┘  └─────┬──────┘  └────┬─────┘ │
│        │             │               │              │       │
│        └─────────────┴───────────────┼──────────────┘       │
│                                      │                       │
└──────────────────────────────────────┼───────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │      WEB3 INTEGRATION LAYER         │
                    │  ┌────────────┐  ┌──────────────┐  │
                    │  │  Ethers.js │  │   MetaMask   │  │
                    │  │  Provider  │  │    Signer    │  │
                    │  └──────┬─────┘  └──────┬───────┘  │
                    │         │                │          │
                    └─────────┼────────────────┼──────────┘
                              │                │
        ┌─────────────────────┴────────────────┴──────────────────┐
        │              BLOCKCHAIN LAYER (Ethereum)                 │
        │                                                           │
        │  ┌───────────────────────────────────────────────────┐  │
        │  │         SkibidiAirdrop Contract                   │  │
        │  │  ┌──────────────┐  ┌────────────┐  ┌───────────┐ │  │
        │  │  │ Merkle Tree  │  │   Claim    │  │   Admin   │ │  │
        │  │  │ Verification │  │   Logic    │  │  Controls │ │  │
        │  │  └──────┬───────┘  └─────┬──────┘  └─────┬─────┘ │  │
        │  │         │                 │               │       │  │
        │  └─────────┼─────────────────┼───────────────┼───────┘  │
        │            │                 │               │          │
        │  ┌─────────▼─────────────────▼───────────────▼───────┐  │
        │  │         SkibidiRizzToken (ERC-20)                 │  │
        │  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │  │
        │  │  │ Transfer │  │   Burn   │  │ balanceOf/etc.  │ │  │
        │  │  └──────────┘  └──────────┘  └─────────────────┘ │  │
        │  └───────────────────────────────────────────────────┘  │
        │                                                           │
        └───────────────────────────────────────────────────────────┘
```

---

## Smart Contract Interaction Flow

```
┌─────────┐
│  USER   │
└────┬────┘
     │ 1. Connect Wallet
     ▼
┌─────────────┐
│  MetaMask   │ ◄──── Authenticates user
└─────┬───────┘
      │ 2. Request accounts
      ▼
┌──────────────┐
│  Frontend    │ ◄──── Stores address & signer
└──────┬───────┘
       │ 3. Check eligibility
       │    (view call - no gas)
       ▼
┌─────────────────┐
│ Airdrop Contract │
│  isEligible()    │ ◄──── Returns true/false
└──────┬──────────┘
       │ 4. If eligible: claimAirdrop()
       │    (transaction - requires gas)
       ▼
┌─────────────────┐
│ Merkle Verify   │ ◄──── On-chain verification
└──────┬──────────┘
       │ 5. If valid: mark as claimed
       ▼
┌─────────────────┐
│ hasClaimed[user]│ ◄──── Permanently stored
│     = true      │
└──────┬──────────┘
       │ 6. Transfer tokens
       ▼
┌─────────────────┐
│  Token Contract │
│   transfer()    │ ◄──── Sends SRT to user
└──────┬──────────┘
       │ 7. Emit event
       ▼
┌─────────────────┐
│ AirdropClaimed  │ ◄──── Logged on blockchain
│     Event       │
└──────┬──────────┘
       │ 8. Frontend updates
       ▼
┌─────────────────┐
│  Success UI     │ ◄──── Shows confirmation
└─────────────────┘
```

---

## Merkle Tree Structure

```
                    ROOT (stored on-chain)
                    ┌─────┴─────┐
                    │ Hash12,34 │
                    └─────┬─────┘
          ┌───────────────┴───────────────┐
          │                               │
    ┌─────▼─────┐                   ┌─────▼─────┐
    │ Hash1,2   │                   │ Hash3,4   │
    └─────┬─────┘                   └─────┬─────┘
      ┌───┴───┐                       ┌───┴───┐
      │       │                       │       │
  ┌───▼──┐ ┌──▼───┐             ┌───▼──┐ ┌──▼───┐
  │Hash1 │ │Hash2 │             │Hash3 │ │Hash4 │
  └──┬───┘ └───┬──┘             └──┬───┘ └───┬──┘
     │         │                   │         │
┌────▼───┐ ┌───▼────┐       ┌─────▼────┐ ┌──▼─────┐
│User1   │ │User2   │       │User3     │ │User4   │
│0x123...│ │0x456...│       │0x789...  │ │0xabc...│
└────────┘ └────────┘       └──────────┘ └────────┘

To prove User1 is whitelisted, provide:
- Hash2 (sibling)
- Hash3,4 (uncle)
- Combine with Hash1 to recreate ROOT
```

**Verification Process**:
1. Hash user address → Hash1
2. Combine Hash1 + Hash2 → Hash1,2
3. Combine Hash1,2 + Hash3,4 → ROOT
4. Compare ROOT with stored merkleRoot
5. If match → User is whitelisted ✅

**Proof Size**: Only log₂(n) hashes needed!
- 1,000 users = 10 proof elements
- 1,000,000 users = 20 proof elements

---

## Token Flow Diagram

```
┌────────────────┐
│  Deploy Token  │  ←  1,000,000 SRT created
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Owner Wallet  │  ←  All tokens initially
└───┬──────┬─────┘
    │      │
    │ 40%  │ 20%         20%           15%          5%
    │      │
    ▼      ▼
┌───────┐ ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐
│Airdrop│ │Liquidity│  │   Team   │  │ Rewards │  │Marketing │
│400k   │ │  200k   │  │   200k   │  │  150k   │  │   50k    │
└───┬───┘ └────┬────┘  └─────┬────┘  └────┬────┘  └────┬─────┘
    │          │             │             │            │
    │          │             │             │            │
    ▼          ▼             ▼             ▼            ▼
┌───────┐  ┌──────┐    ┌──────────┐  ┌─────────┐  ┌─────────┐
│Users  │  │Uniswap    │24-month  │  │Quarterly│  │As needed│
│Claim  │  │Pool   │   │Vesting   │  │Release  │  │Spend    │
└───────┘  └───────┘   └──────────┘  └─────────┘  └─────────┘
```

**Flow Control**:
- Airdrop: Immediate unlock on claim
- Liquidity: 12-month lock (cannot withdraw)
- Team: 6-month cliff + 24-month linear vesting
- Rewards: Released based on governance vote
- Marketing: Controlled spending by multisig

---

## Frontend Component Hierarchy

```
App
├── Layout
│   ├── Navigation
│   │   ├── Logo
│   │   └── ConnectButton ◄─── Web3Context
│   └── Footer
└── Page (Landing)
    ├── Hero Section
    │   ├── Title/Description
    │   └── Background Effects
    ├── AirdropStats ◄─── Fetches on-chain data
    │   ├── TotalClaimed
    │   ├── TotalParticipants
    │   ├── RemainingTokens
    │   └── AmountPerUser
    ├── ClaimAirdrop ◄─── Web3Context + Contract
    │   ├── EligibilityCheck
    │   ├── ClaimButton
    │   ├── TransactionStatus
    │   └── ErrorDisplay
    └── InfoSection
        ├── Tokenomics
        └── Features

Context Providers:
├── Web3Provider ◄─── Manages wallet state
    ├── account
    ├── provider
    ├── signer
    └── connectWallet()
```

---

## Deployment Pipeline

```
┌─────────────┐
│  Development│
│   (Local)   │
└──────┬──────┘
       │ 1. Write code
       │ 2. Test locally
       ▼
┌─────────────┐
│  Hardhat    │
│  Local Node │ ◄─── npx hardhat node
└──────┬──────┘
       │ 3. Deploy to local
       │ 4. Test with frontend
       ▼
┌─────────────┐
│  Testnet    │
│  (Sepolia)  │ ◄─── npx hardhat run --network sepolia
└──────┬──────┘
       │ 5. Community testing
       │ 6. Bug fixes
       ▼
┌─────────────┐
│   Audit     │
│ (CertiK/OZ) │ ◄─── Professional review
└──────┬──────┘
       │ 7. Fix vulnerabilities
       │ 8. Re-audit if needed
       ▼
┌─────────────┐
│  Mainnet    │
│  Deployment │ ◄─── Production launch
└──────┬──────┘
       │ 9. Monitor 24/7
       │ 10. Respond to issues
       ▼
┌─────────────┐
│  Ongoing    │
│ Maintenance │ ◄─── Updates, governance
└─────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│         APPLICATION SECURITY             │
│  • Input validation                      │
│  • XSS protection                        │
│  • CSRF tokens                           │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        WEB3 SECURITY                     │
│  • Verify contract addresses             │
│  • Check network ID                      │
│  • Validate signatures                   │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│     SMART CONTRACT SECURITY              │
│  • Reentrancy guards                     │
│  • Access control (Ownable)              │
│  • Integer overflow protection           │
│  • Event logging                         │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│       OPERATIONAL SECURITY               │
│  • Multi-sig wallet                      │
│  • Monitoring/alerting                   │
│  • Incident response plan                │
│  • Regular audits                        │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│      BLOCKCHAIN SECURITY                 │
│  • Proof of Work/Stake consensus         │
│  • Immutability                          │
│  • Decentralization                      │
└──────────────────────────────────────────┘
```

---

## Data Flow: Claim Transaction

```
Frontend                Smart Contract              Blockchain
   │                         │                          │
   │  1. claimAirdrop()      │                          │
   ├─────────────────────────▶                          │
   │                         │                          │
   │                    2. Check active                │
   │                    3. Check time                  │
   │                    4. Check hasClaimed            │
   │                    5. Verify merkle proof         │
   │                         │                          │
   │                    6. Update state                │
   │                       hasClaimed = true           │
   │                       totalClaimed += amount      │
   │                       totalParticipants++         │
   │                         │                          │
   │                    7. Transfer tokens             │
   │                         │                          │
   │                    8. Emit event                  │
   │                         ├──────────────────────────▶
   │                         │              9. Mine block
   │  10. Transaction hash   │                          │
   ◀─────────────────────────┤                          │
   │                         │              10. Confirm │
   │  11. Receipt            │                          │
   ◀─────────────────────────┤◀─────────────────────────┤
   │                         │                          │
   │  12. Update UI          │                          │
   │     - Show success      │                          │
   │     - Refresh balance   │                          │
   │                         │                          │
```

---

## Cost Analysis

```
┌────────────────────────────────────────────────────┐
│                GAS COST COMPARISON                  │
├────────────────┬──────────┬──────────┬─────────────┤
│   Operation    │ Our Cost │ Typical  │   Savings   │
├────────────────┼──────────┼──────────┼─────────────┤
│ Deploy Token   │ 1.2M gas │ 1.5M gas │     20%     │
│ Deploy Airdrop │ 800k gas │ 2.5M gas │     68%     │
│ Add Whitelist  │  45k gas │ 200M gas │   99.97%    │
│ Claim Airdrop  │  50k gas │ 150k gas │     66%     │
├────────────────┼──────────┼──────────┼─────────────┤
│ TOTAL (10k)    │  545k    │  3.65M   │     85%     │
└────────────────┴──────────┴──────────┴─────────────┘

At 50 Gwei gas price & $2000 ETH:
- Our total cost: $54.50
- Typical cost: $365
- You save: $310.50
```

---

## Timeline Visualization

```
Month 1-2        Month 3-4       Month 5-6       Month 7-12
───────────────────────────────────────────────────────────▶
    MVP              Launch        Growth         Scale
────────────────────────────────────────────────────────────
│                │              │              │
│ • Contracts    │ • Audit      │ • Staking    │ • Bridge
│ • Frontend     │ • Mainnet    │ • NFTs       │ • DAO
│ • Testing      │ • Airdrop    │ • Quests     │ • Mobile
│ • Docs         │ • Marketing  │ • Referrals  │ • CEX
│                │              │              │
▼                ▼              ▼              ▼
Testnet      Production     Features      Ecosystem
```

---

*Diagrams Version 1.0 | December 2024*
