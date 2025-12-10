const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

async function main() {
    console.log("🚀 Deploying SkibidiRizz Airdrop Platform...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

    // Step 1: Deploy SkibidiRizzToken
    console.log("1️⃣  Deploying SkibidiRizzToken...");
    const SkibidiRizzToken = await hre.ethers.getContractFactory("SkibidiRizzToken");
    const token = await SkibidiRizzToken.deploy(deployer.address);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();

    console.log("✅ SkibidiRizzToken deployed to:", tokenAddress);
    console.log("   Total Supply:", hre.ethers.formatEther(await token.TOTAL_SUPPLY()), "SRT");
    console.log("   Symbol:", await token.symbol());
    console.log("   Name:", await token.name(), "\n");

    // Step 2: Create Merkle Tree for whitelist
    console.log("2️⃣  Creating Merkle Tree for whitelist...");

    // Example whitelist addresses (replace with actual addresses)
    const whitelist = [
        deployer.address,
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        "0x4311623b16ce461d69d368185560cba936de21fd",// User's personal account ✅
        "0x791b90ae817e012f289c7b163e0f971f529f0c69"
    ];

    const leaves = whitelist.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot = merkleTree.getHexRoot();

    console.log("✅ Merkle Root:", merkleRoot);
    console.log("   Whitelisted addresses:", whitelist.length, "\n");

    // Step 3: Deploy Airdrop Contract
    console.log("3️⃣  Deploying SkibidiAirdrop contract...");

    const airdropAmountPerUser = hre.ethers.parseEther("1000"); // 1000 SRT per user

    const SkibidiAirdrop = await hre.ethers.getContractFactory("SkibidiAirdrop");
    const airdrop = await SkibidiAirdrop.deploy(
        tokenAddress,
        merkleRoot,
        airdropAmountPerUser,
        deployer.address
    );
    await airdrop.waitForDeployment();
    const airdropAddress = await airdrop.getAddress();

    console.log("✅ SkibidiAirdrop deployed to:", airdropAddress);
    console.log("   Airdrop amount per user:", hre.ethers.formatEther(airdropAmountPerUser), "SRT\n");

    // Step 4: Transfer tokens to Airdrop contract
    console.log("4️⃣  Transferring tokens to Airdrop contract...");

    const tx1 = await token.setAirdropContract(airdropAddress);
    await tx1.wait();

    console.log("✅ Transferred", hre.ethers.formatEther(await token.AIRDROP_ALLOCATION()), "SRT to airdrop contract\n");

    // Step 5: Configure Airdrop
    console.log("5️⃣  Configuring airdrop parameters...");

    const startTime = Math.floor(Date.now() / 1000); // Now
    const endTime = startTime + (30 * 24 * 60 * 60); // 30 days from now

    const tx2 = await airdrop.setAirdropTime(startTime, endTime);
    await tx2.wait();

    const tx3 = await airdrop.setAirdropStatus(true);
    await tx3.wait();

    console.log("✅ Airdrop activated");
    console.log("   Start time:", new Date(startTime * 1000).toISOString());
    console.log("   End time:", new Date(endTime * 1000).toISOString(), "\n");

    // Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📋 Contract Addresses:");
    console.log("   Token:", tokenAddress);
    console.log("   Airdrop:", airdropAddress);
    console.log("\n📊 Configuration:");
    console.log("   Merkle Root:", merkleRoot);
    console.log("   Airdrop Amount:", hre.ethers.formatEther(airdropAmountPerUser), "SRT");
    console.log("   Whitelisted Users:", whitelist.length);
    console.log("\n💡 Next Steps:");
    console.log("   1. Save contract addresses for frontend");
    console.log("   2. Verify contracts on Etherscan");
    console.log("   3. Update frontend configuration");
    console.log("   4. Test claim functionality");
    console.log("\n🔍 Verify contracts:");
    console.log(`   npx hardhat verify --network sepolia ${tokenAddress} "${deployer.address}"`);
    console.log(`   npx hardhat verify --network sepolia ${airdropAddress} "${tokenAddress}" "${merkleRoot}" "${airdropAmountPerUser}" "${deployer.address}"`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            token: tokenAddress,
            airdrop: airdropAddress
        },
        config: {
            merkleRoot: merkleRoot,
            airdropAmount: airdropAmountPerUser.toString(),
            whitelist: whitelist,
            startTime: startTime,
            endTime: endTime
        }
    };

    const fs = require("fs");
    fs.writeFileSync(
        "deployment-info.json",
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("💾 Deployment info saved to deployment-info.json\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
