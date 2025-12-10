export const TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address, uint256) returns (bool)",
    "function AIRDROP_ALLOCATION() view returns (uint256)",
    "function TOTAL_SUPPLY() view returns (uint256)",
];

export const AIRDROP_ABI = [
    "function claimAirdrop(bytes32[] calldata merkleProof) external",
    "function isEligible(address user, bytes32[] calldata merkleProof) external view returns (bool)",
    "function hasClaimed(address) view returns (bool)",
    "function airdropAmount() view returns (uint256)",
    "function totalClaimed() view returns (uint256)",
    "function totalParticipants() view returns (uint256)",
    "function getStats() view returns (uint256, uint256, uint256, bool)",
    "function getRemainingTokens() view returns (uint256)",
    "function airdropActive() view returns (bool)",
    "function airdropStartTime() view returns (uint256)",
    "function airdropEndTime() view returns (uint256)",
    "event AirdropClaimed(address indexed user, uint256 amount)",
];
