
const { ethers } = require("hardhat");

async function main() {
    const suspectAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    const code = await ethers.provider.getCode(suspectAddress);

    console.log("---------------------------------------------------");
    console.log(`Checking Address: ${suspectAddress}`);
    if (code === "0x") {
        console.log("❌ STATUS: DEAD (No code found at this address)");
        console.log("👉 CAUSE: The blockchain was reset, but Frontend is using an old address.");
    } else {
        console.log("✅ STATUS: ALIVE (Contract code exists)");
        console.log("👉 CAUSE: The contract exists, so the error implies a logic revert (e.g. invalid proof).");
    }
    console.log("---------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
