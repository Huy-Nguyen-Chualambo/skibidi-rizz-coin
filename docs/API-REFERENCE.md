# 📟 API & Contract Reference - SkibidiRizz

## 1. Smart Contract API (On-Chain)

### SkibidiAirdrop.sol
The central distribution point for SRT tokens.

| Function | Type | Description |
| :--- | :--- | :--- |
| `claim(uint256 amount, bytes sig)` | Write | Claims SRT by providing a backend signature. |
| `hasClaimed(address)` | Read | Returns `true` if the address has already claimed. |
| `totalClaimed()` | Read | Total tokens distributed so far. |
| `token()` | Read | Address of the SRT ERC-20 contract. |
| `signerAddress()` | Read | The authorized public key allowed to sign claims. |

### SkibidiRizzToken.sol (ERC-20)
Standard token functions plus airdrop management.

| Function | Type | Description |
| :--- | :--- | :--- |
| `balanceOf(address)` | Read | Check SRT balance of a wallet. |
| `totalSupply()` | Read | Returns 1,000,000 SRT. |
| `AIRDROP_ALLOCATION()` | Read | Returns 400,000 SRT constant. |

---

## 2. Backend API Reference (Off-Chain)

### Authentication
*   **POST `/api/auth/nonce`**
    *   *Body*: `{ "address": "0x..." }`
    *   *Returns*: A random string (nonce) to be signed.
*   **POST `/api/auth/login`**
    *   *Body*: `{ "address": "0x...", "signature": "0x..." }`
    *   *Logic*: Verifies signature and sets a secure JWT cookie.
*   **GET `/api/auth/user`**
    *   *Returns*: Current authenticated user profile and stats.

### Task System
*   **GET `/api/tasks`**
    *   *Returns*: List of available tasks and user's completion status.
*   **POST `/api/tasks/verify`**
    *   *Body*: `{ "taskId": "..." }`
    *   *Logic*: Verifies task completion (e.g., link click) and awards points.

### Claiming
*   **POST `/api/claim`**
    *   *Auth*: Required (JWT).
    *   *Logic*: Validates points eligibility. If valid, generates an **ECDSA Signature** using the backend admin key.
    *   *Returns*: `{ "signature": "0x...", "amount": "..." }`

### Statistics
*   **GET `/api/stats/users`**
    *   *Returns*: Total number of registered users for the "Live Stats" dashboard.

---

## 3. Integration Guide

### How to request a claim signature (Frontend Example):
```javascript
const response = await fetch('/api/claim', { method: 'POST' });
const { signature, amount } = await response.json();

// Send to Smart Contract
const tx = await airdropContract.claimTokens(
    ethers.parseEther(amount), 
    signature
);
await tx.wait();
```

---
*Last Updated: January 2026 | Project Code Version 2.1*
