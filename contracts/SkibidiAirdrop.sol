// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SkibidiAirdrop
 * @dev Airdrop distribution contract with Merkle Tree verification
 * 
 * Features:
 * - Merkle tree whitelist for gas-efficient verification
 * - One claim per address anti-spam mechanism
 * - Admin functions to manage distribution
 * - Emergency withdrawal functionality
 */
contract SkibidiAirdrop is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
    bytes32 public merkleRoot;
    uint256 public airdropAmount;
    
    // Track claims
    mapping(address => bool) public hasClaimed;
    
    // Statistics
    uint256 public totalClaimed;
    uint256 public totalParticipants;
    
    // Airdrop status
    bool public airdropActive;
    uint256 public airdropStartTime;
    uint256 public airdropEndTime;
    
    event MerkleRootUpdated(bytes32 indexed newMerkleRoot);
    event AirdropClaimed(address indexed user, uint256 amount);
    event AirdropAmountUpdated(uint256 newAmount);
    event AirdropStatusUpdated(bool status);
    event AirdropTimeUpdated(uint256 startTime, uint256 endTime);
    event EmergencyWithdraw(address indexed owner, uint256 amount);
    
    constructor(
        address _token,
        bytes32 _merkleRoot,
        uint256 _airdropAmount,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_token != address(0), "Invalid token address");
        require(_airdropAmount > 0, "Airdrop amount must be greater than 0");
        
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
        airdropAmount = _airdropAmount;
        airdropActive = false;
    }
    
    /**
     * @dev Claim airdrop tokens using Merkle proof
     * @param merkleProof Merkle proof for verification
     */
    function claimAirdrop(bytes32[] calldata merkleProof) external nonReentrant {
        require(airdropActive, "Airdrop is not active");
        require(block.timestamp >= airdropStartTime, "Airdrop has not started yet");
        require(block.timestamp <= airdropEndTime, "Airdrop has ended");
        require(!hasClaimed[msg.sender], "Already claimed");
        
        // Verify merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid merkle proof");
        
        // Mark as claimed
        hasClaimed[msg.sender] = true;
        totalClaimed += airdropAmount;
        totalParticipants += 1;
        
        // Transfer tokens
        require(token.transfer(msg.sender, airdropAmount), "Token transfer failed");
        
        emit AirdropClaimed(msg.sender, airdropAmount);
    }
    
    /**
     * @dev Check if an address is eligible for airdrop
     * @param user Address to check
     * @param merkleProof Merkle proof for verification
     */
    function isEligible(address user, bytes32[] calldata merkleProof) external view returns (bool) {
        if (hasClaimed[user]) {
            return false;
        }
        
        bytes32 leaf = keccak256(abi.encodePacked(user));
        return MerkleProof.verify(merkleProof, merkleRoot, leaf);
    }
    
    /**
     * @dev Update merkle root (admin only)
     * @param _merkleRoot New merkle root
     */
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
        emit MerkleRootUpdated(_merkleRoot);
    }
    
    /**
     * @dev Update airdrop amount per claim (admin only)
     * @param _airdropAmount New airdrop amount
     */
    function setAirdropAmount(uint256 _airdropAmount) external onlyOwner {
        require(_airdropAmount > 0, "Amount must be greater than 0");
        airdropAmount = _airdropAmount;
        emit AirdropAmountUpdated(_airdropAmount);
    }
    
    /**
     * @dev Set airdrop active status (admin only)
     * @param _status New status
     */
    function setAirdropStatus(bool _status) external onlyOwner {
        airdropActive = _status;
        emit AirdropStatusUpdated(_status);
    }
    
    /**
     * @dev Set airdrop start and end time (admin only)
     * @param _startTime Start timestamp
     * @param _endTime End timestamp
     */
    function setAirdropTime(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(_endTime > _startTime, "End time must be after start time");
        airdropStartTime = _startTime;
        airdropEndTime = _endTime;
        emit AirdropTimeUpdated(_startTime, _endTime);
    }
    
    /**
     * @dev Emergency withdraw remaining tokens (admin only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(owner(), balance), "Token transfer failed");
        emit EmergencyWithdraw(owner(), balance);
    }
    
    /**
     * @dev Get remaining tokens in contract
     */
    function getRemainingTokens() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
    
    /**
     * @dev Get airdrop statistics
     */
    function getStats() external view returns (
        uint256 _totalClaimed,
        uint256 _totalParticipants,
        uint256 _remainingTokens,
        bool _isActive
    ) {
        return (
            totalClaimed,
            totalParticipants,
            token.balanceOf(address(this)),
            airdropActive
        );
    }
}
