const hre = require("hardhat");

async function main() {
    console.log("🔍 Checking SRT Token Balances...\n");

    // Contract addresses from deployment
    const tokenAddress = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";
    const airdropAddress = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";

    // Accounts to check
    const accounts = [
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Test Account #0
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Test Account #1
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Test Account #2
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Test Account #3
        "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", // Test Account #4
        "0x4311623b16ce461d69d368185560cba936de21fd", // User Account #1
        "0x791b90ae817e012f289c7b163e0f971f529f0c69", // User Account #2
    ];

    // Get token contract
    const Token = await hre.ethers.getContractFactory("SkibidiRizzToken");
    const token = Token.attach(tokenAddress);

    console.log("📋 Token Info:");
    console.log("   Name:", await token.name());
    console.log("   Symbol:", await token.symbol());
    console.log("   Total Supply:", hre.ethers.formatEther(await token.totalSupply()), "SRT");
    console.log("   Decimals:", await token.decimals(), "\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💰 BALANCES:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    let totalClaimed = 0;

    for (let i = 0; i < accounts.length; i++) {
        const address = accounts[i];
        const balance = await token.balanceOf(address);
        const balanceFormatted = hre.ethers.formatEther(balance);

        const ethBalance = await hre.ethers.provider.getBalance(address);
        const ethFormatted = hre.ethers.formatEther(ethBalance);

        let label;
        if (i < 5) {
            label = `Test Account #${i}`;
        } else {
            label = `User Account #${i - 4}`;
        }

        console.log(`${label}:`);
        console.log(`   Address: ${address}`);
        console.log(`   ETH: ${ethFormatted} ETH`);
        console.log(`   SRT: ${balanceFormatted} SRT`);

        if (parseFloat(balanceFormatted) > 0) {
            console.log(`   Status: ✅ CLAIMED!`);
            totalClaimed++;
        } else {
            console.log(`   Status: ⏳ Not claimed yet`);
        }
        console.log();
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 SUMMARY:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Total Accounts: ${accounts.length}`);
    console.log(`   Claimed: ${totalClaimed}`);
    console.log(`   Not Claimed: ${accounts.length - totalClaimed}`);
    console.log(`   Tokens Distributed: ${totalClaimed * 1000} SRT`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Check airdrop contract stats
    const Airdrop = await hre.ethers.getContractFactory("SkibidiAirdrop");
    const airdrop = Airdrop.attach(airdropAddress);

    console.log("🎁 AIRDROP CONTRACT STATS:");
    console.log("   Total Claimed:", hre.ethers.formatEther(await airdrop.totalClaimed()), "SRT");
    console.log("   Total Participants:", (await airdrop.totalParticipants()).toString());
    console.log("   Remaining Tokens:", hre.ethers.formatEther(await airdrop.getRemainingTokens()), "SRT");
    console.log("   Airdrop Active:", await airdrop.airdropActive());
    console.log("\n✅ Done!\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
