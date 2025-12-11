
const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🔍 DEBUGGING DEPLOYMENT ENVIRONMENT");
    console.log("-----------------------------------");

    // 1. Check Private Key
    const pk = process.env.PRIVATE_KEY;
    if (!pk) {
        console.error("❌ ERROR: PRIVATE_KEY is missing in .env file!");
        console.error("👉 Please rename .env.sepolia to .env and fill in your Private Key.");
    } else if (pk.length < 64) {
        console.error("❌ ERROR: PRIVATE_KEY seems too short. Is it correct?");
    } else {
        console.log("✅ PRIVATE_KEY found (Masked):", pk.substring(0, 4) + "..." + pk.substring(pk.length - 4));
    }

    // 2. Check Signers in Hardhat
    try {
        const [deployer] = await hre.ethers.getSigners();
        if (!deployer) {
            console.error("❌ ERROR: No deployer account found in Hardhat config.");
            console.error("   Reason: The 'accounts' array for network 'sepolia' is empty.");
        } else {
            console.log("✅ DEPLOYER DETECTED:", deployer.address);

            // 3. Check Balance
            const balance = await hre.ethers.provider.getBalance(deployer.address);
            console.log("💰 BALANCE ON SEPOLIA:", hre.ethers.formatEther(balance), "ETH");

            if (balance === 0n) {
                console.error("⚠️ WARNING: Balance is 0 ETH. Deployment will fail due to gas fees.");
                console.error("👉 Please get free ETH from a Sepolia Faucet.");
            } else {
                console.log("✅ Ready to deploy! 🚀");
            }
        }
    } catch (e) {
        console.error("❌ ERROR GETTING SIGNERS:", e.message);
    }
}

main().catch(console.error);
