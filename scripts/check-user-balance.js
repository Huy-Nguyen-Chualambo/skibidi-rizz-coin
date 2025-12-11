
const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
    // Read latest deployment info
    const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info.json', 'utf8'));
    const tokenAddress = deploymentInfo.contracts.token;
    const userAddress = "0x791b90ae817E012f289C7B163E0f971f529f0c69";

    console.log("------------------------------------------");
    console.log("🔍 CHECKING REAL ON-CHAIN BALANCE");
    console.log("------------------------------------------");
    console.log("🪙  Token Contract:", tokenAddress);
    console.log("👤 User Address:  ", userAddress);

    const Token = await ethers.getContractFactory("SkibidiRizzToken");
    const token = Token.attach(tokenAddress);

    const balance = await token.balanceOf(userAddress);
    const formattedBalance = ethers.formatEther(balance);

    console.log("------------------------------------------");
    console.log(`💰 REAL BALANCE: ${formattedBalance} SRT`);
    console.log("------------------------------------------");

    if (parseFloat(formattedBalance) > 0) {
        console.log("✅ CONCLUSION: You HAVE the tokens!");
        console.log("👉 FIX: You need to import the NEW Token Address into MetaMask.");
    } else {
        console.log("❌ CONCLUSION: Claim failed (Balance is truly 0).");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
