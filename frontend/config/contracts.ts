export const CONTRACTS = {
    TOKEN_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "",
    AIRDROP_ADDRESS: process.env.NEXT_PUBLIC_AIRDROP_ADDRESS || "",
};

export const NETWORK_CONFIG = {
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID || "11155111", // Sepolia
    chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || "Sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.infura.io/v3/",
    blockExplorer: process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://sepolia.etherscan.io",
};

export const AIRDROP_CONFIG = {
    amountPerUser: "1000", // SRT tokens per user
    merkleRoot: process.env.NEXT_PUBLIC_MERKLE_ROOT || "",
};
