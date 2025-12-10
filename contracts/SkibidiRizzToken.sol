// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkibidiRizzToken
 * @dev ERC20 Token for the SkibidiRizz DeFi ecosystem
 * 
 * Tokenomics:
 * - Total Supply: 1,000,000 SRT
 * - Airdrop Allocation: 40% (400,000 SRT)
 * - Team & Development: 20% (200,000 SRT)
 * - Liquidity Pool: 20% (200,000 SRT)
 * - Community Rewards: 15% (150,000 SRT)
 * - Marketing & Partnerships: 5% (50,000 SRT)
 */
contract SkibidiRizzToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000 * 10**18; // 1 million tokens
    uint256 public constant AIRDROP_ALLOCATION = 400_000 * 10**18; // 40%
    
    // Track allocation addresses
    address public airdropContract;
    
    event AirdropContractSet(address indexed airdropContract);
    
    constructor(address initialOwner) ERC20("SkibidiRizzToken", "SRT") Ownable(initialOwner) {
        // Mint total supply to owner
        _mint(initialOwner, TOTAL_SUPPLY);
    }
    
    /**
     * @dev Set the airdrop contract address and transfer allocated tokens
     * @param _airdropContract Address of the airdrop contract
     */
    function setAirdropContract(address _airdropContract) external onlyOwner {
        require(_airdropContract != address(0), "Invalid airdrop contract address");
        require(airdropContract == address(0), "Airdrop contract already set");
        
        airdropContract = _airdropContract;
        
        // Transfer airdrop allocation to the airdrop contract
        _transfer(msg.sender, _airdropContract, AIRDROP_ALLOCATION);
        
        emit AirdropContractSet(_airdropContract);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
