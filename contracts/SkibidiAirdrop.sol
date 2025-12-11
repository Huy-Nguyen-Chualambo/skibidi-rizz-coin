// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SkibidiAirdrop (Public Version)
 * @dev Public Airdrop distribution - First Come First Served
 */
contract SkibidiAirdrop is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
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
    
    event AirdropClaimed(address indexed user, uint256 amount);
    event AirdropAmountUpdated(uint256 newAmount);
    event AirdropStatusUpdated(bool status);
    event AirdropTimeUpdated(uint256 startTime, uint256 endTime);
    event EmergencyWithdraw(address indexed owner, uint256 amount);
    
    constructor(
        address _token,
        uint256 _airdropAmount,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_token != address(0), "Invalid token address");
        require(_airdropAmount > 0, "Airdrop amount must be greater than 0");
        
        token = IERC20(_token);
        airdropAmount = _airdropAmount;
        airdropActive = false;
    }
    
    /**
     * @dev Claim airdrop tokens (No Merkle Proof needed)
     */
    function claimAirdrop() external nonReentrant {
        require(airdropActive, "Airdrop is not active");
        require(block.timestamp >= airdropStartTime, "Airdrop has not started yet");
        require(block.timestamp <= airdropEndTime, "Airdrop has ended");
        require(!hasClaimed[msg.sender], "Already claimed");
        require(token.balanceOf(address(this)) >= airdropAmount, "Airdrop empty");
        
        // Mark as claimed
        hasClaimed[msg.sender] = true;
        totalClaimed += airdropAmount;
        totalParticipants += 1;
        
        // Transfer tokens
        require(token.transfer(msg.sender, airdropAmount), "Token transfer failed");
        
        emit AirdropClaimed(msg.sender, airdropAmount);
    }
    
    // Helper to check eligibility
    function isEligible(address user) external view returns (bool) {
        return !hasClaimed[user] && token.balanceOf(address(this)) >= airdropAmount;
    }
    
    // Admin functions
    function setAirdropAmount(uint256 _airdropAmount) external onlyOwner {
        require(_airdropAmount > 0, "Amount must be greater than 0");
        airdropAmount = _airdropAmount;
        emit AirdropAmountUpdated(_airdropAmount);
    }
    
    function setAirdropStatus(bool _status) external onlyOwner {
        airdropActive = _status;
        emit AirdropStatusUpdated(_status);
    }
    
    function setAirdropTime(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(_endTime > _startTime, "End time must be after start time");
        airdropStartTime = _startTime;
        airdropEndTime = _endTime;
        emit AirdropTimeUpdated(_startTime, _endTime);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(owner(), balance), "Token transfer failed");
        emit EmergencyWithdraw(owner(), balance);
    }
    
    function getRemainingTokens() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
    
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
