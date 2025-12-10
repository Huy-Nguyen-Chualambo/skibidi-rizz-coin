const hre = require("hardhat");

async function main() {
    console.log("💸 Transferring ETH to user accounts...\n");

    const [sender] = await hre.ethers.getSigners();
    console.log("📤 Sender:", sender.address);
    console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(sender.address)), "ETH\n");

    // Your accounts that need ETH
    const recipients = [
        "0x4311623b16ce461d69d368185560cba936de21fd",
        "0x791b90ae817e012f289c7b163e0f971f529f0c69"
    ];

    const amountToSend = hre.ethers.parseEther("1.0"); // 1 ETH per account

    for (const recipient of recipients) {
        console.log(`📥 Sending ${hre.ethers.formatEther(amountToSend)} ETH to ${recipient}...`);

        const tx = await sender.sendTransaction({
            to: recipient,
            value: amountToSend
        });

        await tx.wait();

        const newBalance = await hre.ethers.provider.getBalance(recipient);
        console.log(`✅ Transfer complete! New balance: ${hre.ethers.formatEther(newBalance)} ETH\n`);
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 ALL TRANSFERS COMPLETE!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nYour accounts now have ETH for gas fees! 🚀");
    console.log("You can now claim your airdrops! 🎁\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
