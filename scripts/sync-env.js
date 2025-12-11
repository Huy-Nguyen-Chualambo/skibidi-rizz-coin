
const fs = require('fs');
const path = require('path');

const deploymentInfoPath = path.join(__dirname, '../deployment-info.json');
const envPath = path.join(__dirname, '../frontend/.env.local');

if (!fs.existsSync(deploymentInfoPath)) {
    console.error("❌ deployment-info.json not found! Run deployment script first.");
    process.exit(1);
}

const info = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));

const envContent = `NEXT_PUBLIC_TOKEN_ADDRESS=${info.contracts.token}
NEXT_PUBLIC_AIRDROP_ADDRESS=${info.contracts.airdrop}
NEXT_PUBLIC_MERKLE_ROOT=${info.config.merkleRoot}
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_BLOCK_EXPLORER=
`;

fs.writeFileSync(envPath, envContent);

console.log("✅ frontend/.env.local updated successfully with new addresses:");
console.log(`   Tokens: ${info.contracts.token}`);
console.log(`   Airdrop: ${info.contracts.airdrop}`);
console.log(`   Merkle Root: ${info.config.merkleRoot}`);
