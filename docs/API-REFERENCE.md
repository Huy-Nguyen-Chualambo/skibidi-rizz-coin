# API Reference - SkibidiRizz Token

## Smart Contract API Documentation

### SkibidiRizzToken.sol

#### Read Functions

**name()**
```solidity
function name() public view returns (string memory)
```
Returns: "SkibidiRizzToken"

---

**symbol()**
```solidity
function symbol() public view returns (string memory)
```
Returns: "SRT"

---

**decimals()**
```solidity
function decimals() public view returns (uint8)
```
Returns: 18

---

**totalSupply()**
```solidity
function totalSupply() public view returns (uint256)
```
Returns: 1000000000000000000000000 (1,000,000 * 10^18)

---

**balanceOf(address)**
```solidity
function balanceOf(address account) public view returns (uint256)
```
Parameters:
- `account`: Address to check balance

Returns: Token balance of the address

---

**TOTAL_SUPPLY()**
```solidity
function TOTAL_SUPPLY() public view returns (uint256)
```
Returns: Total supply constant (1,000,000 SRT)

---

**AIRDROP_ALLOCATION()**
```solidity
function AIRDROP_ALLOCATION() public view returns (uint256)
```
Returns: Airdrop allocation (400,000 SRT)

---

**airdropContract()**
```solidity
function airdropContract() public view returns (address)
```
Returns: Address of the airdrop contract

---

#### Write Functions

**transfer(address, uint256)**
```solidity
function transfer(address to, uint256 amount) public returns (bool)
```
Parameters:
- `to`: Recipient address
- `amount`: Amount to transfer (in wei)

Returns: true if successful

---

**approve(address, uint256)**
```solidity
function approve(address spender, uint256 amount) public returns (bool)
```
Parameters:
- `spender`: Address allowed to spend
- `amount`: Amount approved (in wei)

Returns: true if successful

---

**transferFrom(address, address, uint256)**
```solidity
function transferFrom(address from, address to, uint256 amount) public returns (bool)
```
Parameters:
- `from`: Sender address
- `to`: Recipient address
- `amount`: Amount to transfer

Returns: true if successful

---

**burn(uint256)**
```solidity
function burn(uint256 amount) external
```
Parameters:
- `amount`: Amount of tokens to burn

Burns tokens from caller's balance

---

**setAirdropContract(address)** (Owner only)
```solidity
function setAirdropContract(address _airdropContract) external onlyOwner
```
Parameters:
- `_airdropContract`: Address of airdrop contract

Transfers airdrop allocation to contract

---

### SkibidiAirdrop.sol

#### Read Functions

**token()**
```solidity
function token() public view returns (IERC20)
```
Returns: Address of SRT token contract

---

**merkleRoot()**
```solidity
function merkleRoot() public view returns (bytes32)
```
Returns: Current Merkle root hash

---

**airdropAmount()**
```solidity
function airdropAmount() public view returns (uint256)
```
Returns: Amount per claim (default: 1000 SRT)

---

**airdropActive()**
```solidity
function airdropActive() public view returns (bool)
```
Returns: Whether airdrop is currently active

---

**airdropStartTime()**
```solidity
function airdropStartTime() public view returns (uint256)
```
Returns: Unix timestamp when airdrop starts

---

**airdropEndTime()**
```solidity
function airdropEndTime() public view returns (uint256)
```
Returns: Unix timestamp when airdrop ends

---

**hasClaimed(address)**
```solidity
function hasClaimed(address user) public view returns (bool)
```
Parameters:
- `user`: Address to check

Returns: true if address has already claimed

---

**totalClaimed()**
```solidity
function totalClaimed() public view returns (uint256)
```
Returns: Total amount of tokens claimed

---

**totalParticipants()**
```solidity
function totalParticipants() public view returns (uint256)
```
Returns: Number of unique claimers

---

**isEligible(address, bytes32[])**
```solidity
function isEligible(address user, bytes32[] calldata merkleProof) 
    external view returns (bool)
```
Parameters:
- `user`: Address to check eligibility
- `merkleProof`: Merkle proof array

Returns: true if eligible and hasn't claimed

---

**getRemainingTokens()**
```solidity
function getRemainingTokens() external view returns (uint256)
```
Returns: Remaining tokens in contract

---

**getStats()**
```solidity
function getStats() external view returns (
    uint256 _totalClaimed,
    uint256 _totalParticipants,
    uint256 _remainingTokens,
    bool _isActive
)
```
Returns: All statistics in one call

---

#### Write Functions

**claimAirdrop(bytes32[])**
```solidity
function claimAirdrop(bytes32[] calldata merkleProof) external nonReentrant
```
Parameters:
- `merkleProof`: Array of bytes32 hashes for verification

Claims airdrop tokens for caller

Requirements:
- Airdrop must be active
- Current time within start/end window
- Caller hasn't claimed before
- Valid Merkle proof

Emits: `AirdropClaimed(address user, uint256 amount)`

---

#### Admin Functions (Owner only)

**setMerkleRoot(bytes32)**
```solidity
function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner
```
Parameters:
- `_merkleRoot`: New Merkle root hash

Updates whitelist

---

**setAirdropAmount(uint256)**
```solidity
function setAirdropAmount(uint256 _airdropAmount) external onlyOwner
```
Parameters:
- `_airdropAmount`: New amount per claim (in wei)

---

**setAirdropStatus(bool)**
```solidity
function setAirdropStatus(bool _status) external onlyOwner
```
Parameters:
- `_status`: true to activate, false to deactivate

---

**setAirdropTime(uint256, uint256)**
```solidity
function setAirdropTime(uint256 _startTime, uint256 _endTime) external onlyOwner
```
Parameters:
- `_startTime`: Unix timestamp for start
- `_endTime`: Unix timestamp for end

---

**emergencyWithdraw()**
```solidity
function emergencyWithdraw() external onlyOwner
```
Withdraws all remaining tokens to owner

---

## Events

### SkibidiRizzToken

**Transfer**
```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
```

**Approval**
```solidity
event Approval(address indexed owner, address indexed spender, uint256 value)
```

**AirdropContractSet**
```solidity
event AirdropContractSet(address indexed airdropContract)
```

---

### SkibidiAirdrop

**AirdropClaimed**
```solidity
event AirdropClaimed(address indexed user, uint256 amount)
```

**MerkleRootUpdated**
```solidity
event MerkleRootUpdated(bytes32 indexed newMerkleRoot)
```

**AirdropAmountUpdated**
```solidity
event AirdropAmountUpdated(uint256 newAmount)
```

**AirdropStatusUpdated**
```solidity
event AirdropStatusUpdated(bool status)
```

**AirdropTimeUpdated**
```solidity
event AirdropTimeUpdated(uint256 startTime, uint256 endTime)
```

**EmergencyWithdraw**
```solidity
event EmergencyWithdraw(address indexed owner, uint256 amount)
```

---

## Frontend Integration Examples

### Connect Wallet
```javascript
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const accounts = await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();
```

---

### Check Eligibility
```javascript
import { AIRDROP_ABI } from "./config/abi";
import { CONTRACTS } from "./config/contracts";

const contract = new ethers.Contract(
  CONTRACTS.AIRDROP_ADDRESS,
  AIRDROP_ABI,
  provider
);

const merkleProof = [...]; // Get from API
const isEligible = await contract.isEligible(userAddress, merkleProof);
```

---

### Claim Airdrop
```javascript
const contractWithSigner = contract.connect(signer);
const tx = await contractWithSigner.claimAirdrop(merkleProof);
await tx.wait(); // Wait for confirmation
```

---

### Get Stats
```javascript
const [totalClaimed, totalParticipants, remaining, isActive] = 
  await contract.getStats();

console.log("Total Claimed:", ethers.formatEther(totalClaimed));
console.log("Participants:", totalParticipants.toString());
console.log("Remaining:", ethers.formatEther(remaining));
console.log("Active:", isActive);
```

---

### Check Token Balance
```javascript
import { TOKEN_ABI } from "./config/abi";

const tokenContract = new ethers.Contract(
  CONTRACTS.TOKEN_ADDRESS,
  TOKEN_ABI,
  provider
);

const balance = await tokenContract.balanceOf(userAddress);
console.log("Balance:", ethers.formatEther(balance), "SRT");
```

---

### Listen to Events
```javascript
// Listen for claims
contract.on("AirdropClaimed", (user, amount, event) => {
  console.log(`${user} claimed ${ethers.formatEther(amount)} SRT`);
});

// Stop listening
contract.removeAllListeners("AirdropClaimed");
```

---

## Error Codes

### Common Errors

**"Already claimed"**
- User has already claimed their airdrop
- Check `hasClaimed(address)` before attempting

**"Invalid merkle proof"**
- User is not on whitelist
- Or proof is incorrect
- Verify proof generation

**"Airdrop is not active"**
- Check `airdropActive()` status
- Admin may have paused distribution

**"Airdrop has not started yet"**
- Current time < `airdropStartTime()`
- Wait for official start

**"Airdrop has ended"**
- Current time > `airdropEndTime()`
- Distribution period is over

**"Token transfer failed"**
- Contract may be out of tokens
- Check `getRemainingTokens()`

---

## Gas Estimates

| Function | Estimated Gas | Cost @ 50 Gwei |
|----------|--------------|----------------|
| claimAirdrop() | ~50,000 | ~$0.0025 ETH |
| setMerkleRoot() | ~45,000 | ~$0.00225 ETH |
| setAirdropStatus() | ~30,000 | ~$0.0015 ETH |
| emergencyWithdraw() | ~60,000 | ~$0.003 ETH |

---

## Rate Limits

No on-chain rate limits, but frontend should implement:
- **Claim attempts**: Max 3 per minute
- **Eligibility checks**: Max 10 per minute
- **Stats refresh**: Max once per 15 seconds

---

## Support

For API-related questions:
- **Documentation**: https://docs.skibidirizz.io
- **Discord**: discord.gg/skibidirizz
- **Email**: developers@skibidirizz.io

---

*Last Updated: December 2024*
