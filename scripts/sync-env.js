
const fs = require('fs');
const path = require('path');

const deploymentInfoPath = path.join(__dirname, '../deployment-info.json');
const envPath = path.join(__dirname, '../frontend/.env.local');

if (!fs.existsSync(deploymentInfoPath)) {
    console.error("❌ deployment-info.json not found! Run deployment script first.");
    process.exit(1);
}

// Try to get PRIVATE_KEY from root .env
let privateKey = "";
const rootEnvPath = path.join(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) {
    const rootEnv = fs.readFileSync(rootEnvPath, 'utf8');
    const match = rootEnv.match(/PRIVATE_KEY=["']?([a-fA-F0-9xX]+)["']?/);
    if (match) {
        privateKey = match[1];
        console.log("✅ PRIVATE_KEY found in root .env (Length: " + privateKey.length + ")");
    } else {
        console.warn("⚠️ PRIVATE_KEY not found in root .env");
    }
}

const info = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));

const network = info.network || "localhost";
let chainId = 1337;
let rpcUrl = "http://127.0.0.1:8545";
let explorerUrl = "";

if (network === "sepolia") {
    chainId = 11155111;
    rpcUrl = "https://ethereum-sepolia-rpc.publicnode.com";
    explorerUrl = "https://sepolia.etherscan.io";
}

const envContent = `NEXT_PUBLIC_TOKEN_ADDRESS=${info.contracts.token}
NEXT_PUBLIC_AIRDROP_ADDRESS=${info.contracts.airdrop}
NEXT_PUBLIC_MERKLE_ROOT=${info.config.merkleRoot || ""}
NEXT_PUBLIC_CHAIN_ID=${chainId}
NEXT_PUBLIC_RPC_URL=${rpcUrl}
NEXT_PUBLIC_BLOCK_EXPLORER=${explorerUrl}
ADMIN_PRIVATE_KEY=${privateKey}
`;

fs.writeFileSync(envPath, envContent);

console.log("✅ frontend/.env.local updated successfully with new addresses:");
console.log(`   Tokens: ${info.contracts.token}`);
console.log(`   Airdrop: ${info.contracts.airdrop}`);
console.log(`   Merkle Root: ${info.config.merkleRoot}`);
