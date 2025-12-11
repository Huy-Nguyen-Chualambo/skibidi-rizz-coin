
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../frontend/.env.local');

const envContent = `NEXT_PUBLIC_TOKEN_ADDRESS=0xc9516d504551C9dD50409E54fC1b92EDD5b69C38
NEXT_PUBLIC_AIRDROP_ADDRESS=0xf373f4b5e079cCF28cD87D4B80FC3b9877d5e716
NEXT_PUBLIC_MERKLE_ROOT=0x42bac3a8fe43bd57197bcbfeabfbc32efd9867895f9843d5daf2fbb60613e817
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_BLOCK_EXPLORER=https://sepolia.etherscan.io
`;

fs.writeFileSync(envPath, envContent);
console.log("✅ frontend/.env.local updated for SEPOLIA!");
