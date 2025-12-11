
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Deploying PUBLIC SkibidiRizz Airdrop...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

    // 1. Deploy Token
    console.log("1️⃣  Deploying SkibidiRizzToken...");
    const SkibidiRizzToken = await hre.ethers.getContractFactory("SkibidiRizzToken");
    const token = await SkibidiRizzToken.deploy(deployer.address);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("✅ Token deployed to:", tokenAddress);

    // 2. Deploy Airdrop (Public Mode)
    console.log("2️⃣  Deploying SkibidiAirdrop (Public)...");
    const airdropAmountPerUser = hre.ethers.parseEther("1000"); // 1000 SRT per user

    const SkibidiAirdrop = await hre.ethers.getContractFactory("SkibidiAirdrop");
    // Constructor no longer takes merkleRoot
    const airdrop = await SkibidiAirdrop.deploy(
        tokenAddress,
        airdropAmountPerUser,
        deployer.address
    );
    await airdrop.waitForDeployment();
    const airdropAddress = await airdrop.getAddress();
    console.log("✅ Airdrop deployed to:", airdropAddress);

    // 3. Transfer Tokens to Airdrop
    console.log("3️⃣  Funding Airdrop Contract...");
    const platformSupply = hre.ethers.parseEther("400000"); // 400k tokens
    const txTransfer = await token.transfer(airdropAddress, platformSupply);
    await txTransfer.wait(); // Wait for confirmation
    console.log("✅ Transferred 400,000 SRT to Airdrop");

    // 4. Activate Airdrop
    console.log("4️⃣  Activating Airdrop...");
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + (30 * 24 * 60 * 60); // 30 days

    const txTime = await airdrop.setAirdropTime(startTime, endTime);
    await txTime.wait();

    const txStatus = await airdrop.setAirdropStatus(true);
    await txStatus.wait();

    console.log("✅ Airdrop Activated!");

    // 5. UPDATE FRONTEND AUTOMATICALLY
    console.log("\n🔄 Updating Frontend Config & ABIs...");

    // Update .env.local
    const envPath = path.join(__dirname, "../frontend/.env.local");
    const network = await hre.ethers.provider.getNetwork();

    let explorerUrl = "http://localhost:8545";
    let rpcUrl = "http://localhost:8545";

    if (network.chainId === 11155111n) {
        explorerUrl = "https://sepolia.etherscan.io";
        rpcUrl = "https://ethereum-sepolia-rpc.publicnode.com";
    }

    const envContent = `NEXT_PUBLIC_TOKEN_ADDRESS=${tokenAddress}
NEXT_PUBLIC_AIRDROP_ADDRESS=${airdropAddress}
NEXT_PUBLIC_CHAIN_ID=${network.chainId.toString()}
NEXT_PUBLIC_RPC_URL=${rpcUrl}
NEXT_PUBLIC_BLOCK_EXPLORER=${explorerUrl}
`;
    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env.local updated");

    // Update ABI
    const abiPath = path.join(__dirname, "../frontend/config/abi.ts");
    const tokenArtifact = await hre.artifacts.readArtifact("SkibidiRizzToken");
    const airdropArtifact = await hre.artifacts.readArtifact("SkibidiAirdrop");

    const abiContent = `export const SKIBIDI_TOKEN_ABI = ${JSON.stringify(tokenArtifact.abi, null, 2)} as const;

export const SKIBIDI_AIRDROP_ABI = ${JSON.stringify(airdropArtifact.abi, null, 2)} as const;
`;
    fs.writeFileSync(abiPath, abiContent);
    console.log("✅ abi.ts updated with new Public ABI");

    console.log("\n🎉 ALL DONE! Just restart frontend to see changes.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
