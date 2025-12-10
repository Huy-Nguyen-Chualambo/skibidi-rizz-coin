# Contributing to SkibidiRizz Token

First off, thank you for considering contributing to SkibidiRizz Token! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them learn
- ✅ Focus on what is best for the community
- ✅ Show empathy towards other community members
- ❌ No harassment or discriminatory language
- ❌ No trolling or insulting comments

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Good bug reports include**:
- Clear, descriptive title
- Exact steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

**Example**:
```
Title: Airdrop claim fails with "Invalid merkle proof" error

Steps to reproduce:
1. Connect MetaMask to Sepolia testnet
2. Click "Claim Airdrop"
3. Approve transaction

Expected: Token transfer succeeds
Actual: Transaction reverts with error

Environment:
- OS: Windows 11
- Browser: Chrome 120
- MetaMask: 11.5.0
```

---

### 💡 Suggesting Features

We love feature requests! Please provide:
- Clear use case
- Why this benefits users
- Potential implementation approach
- Any examples from other projects

**Template**:
```
Feature: [Name]
Problem: [What problem does this solve?]
Solution: [How should it work?]
Benefits: [Who benefits and how?]
Examples: [Similar features in other projects]
```

---

### 🔧 Pull Requests

#### Before You Start
1. Fork the repository
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Check existing PRs to avoid duplicates

#### Development Workflow

1. **Setup**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Skibidi-rizz-coin.git
   cd Skibidi-rizz-coin
   npm install
   cd frontend && npm install
   ```

2. **Make Changes**:
   - Follow existing code style
   - Add tests for new features
   - Update documentation

3. **Test**:
   ```bash
   npx hardhat test
   npx hardhat coverage
   cd frontend && npm run build
   ```

4. **Commit**:
   ```bash
   git add .
   git commit -m "feat: add new feature X"
   ```

5. **Push**:
   ```bash
   git push origin feature/YourFeature
   ```

6. **Create PR**:
   - Use clear title
   - Describe changes in detail
   - Link related issues
   - Add screenshots for UI changes

#### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(airdrop): add multi-token support
fix(frontend): resolve MetaMask connection issue
docs(whitepaper): update tokenomics section
test(contracts): add edge case for claim function
```

---

## Development Guidelines

### Smart Contracts

**Best Practices**:
- ✅ Use OpenZeppelin libraries
- ✅ Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- ✅ Add NatSpec comments
- ✅ Optimize for gas
- ✅ Write comprehensive tests

**Example**:
```solidity
/**
 * @notice Claim airdrop tokens
 * @param merkleProof Proof of whitelist inclusion
 * @dev Verifies proof and transfers tokens
 */
function claimAirdrop(bytes32[] calldata merkleProof) external {
    // Implementation
}
```

---

### Frontend

**Best Practices**:
- ✅ Use TypeScript for type safety
- ✅ Follow React best practices
- ✅ Implement error boundaries
- ✅ Add loading states
- ✅ Make responsive designs

**Component Structure**:
```tsx
"use client";

import { useState } from "react";

interface Props {
  // Props interface
}

export default function ComponentName({ props }: Props) {
  // State and logic
  
  return (
    // JSX
  );
}
```

---

### Testing

**Requirements**:
- ✅ >95% code coverage
- ✅ Test happy paths
- ✅ Test error cases
- ✅ Test edge cases
- ✅ Test gas usage

**Example**:
```javascript
describe("SkibidiAirdrop", function () {
  it("Should allow eligible user to claim", async function () {
    // Setup
    // Execute
    // Assert
  });
  
  it("Should reject double claims", async function () {
    // Test anti-spam
  });
});
```

---

### Documentation

When adding features, update:
- [ ] README.md (if user-facing)
- [ ] API-REFERENCE.md (if new functions)
- [ ] WHITEPAPER.md (if tokenomics change)
- [ ] Code comments (always!)

---

## PR Review Process

1. **Automated Checks**:
   - Tests must pass
   - No linting errors
   - Build succeeds

2. **Code Review**:
   - At least one maintainer approval
   - Address review comments
   - Keep PR scope focused

3. **Merge**:
   - Squash and merge for clean history
   - Delete branch after merge

---

## Getting Help

### Resources
- **Documentation**: `/docs` folder
- **Examples**: Existing code
- **Discord**: discord.gg/skibidirizz
- **GitHub Issues**: Ask questions with `question` label

### Mentorship
New to blockchain development? We're here to help!
- Tag issues with `good first issue`
- Ask questions in Discord
- Review existing PRs to learn

---

## Recognition

Contributors will be:
- ✅ Listed in CONTRIBUTORS.md
- ✅ Mentioned in release notes
- ✅ Eligible for contributor NFT (future)
- ✅ Potential core team member

---

## Legal

By contributing, you agree that:
- Your contributions will be licensed under MIT License
- You have the right to contribute the code
- You understand this is open-source

---

## Thank You!

Every contribution helps make SkibidiRizz better. Whether it's:
- Fixing a typo in documentation
- Reporting a bug
- Suggesting a feature
- Writing code
- Helping other users

**You're making a difference! 🚀**

---

*Questions? Reach out on [Discord](https://discord.gg/skibidirizz) or create an issue!*
