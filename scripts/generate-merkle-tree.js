const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const fs = require("fs");

/**
 * Generate Merkle Tree and proofs for whitelist addresses
 * Usage: node scripts/generate-merkle-tree.js
 */

// Example whitelist - replace with actual addresses
const whitelist = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Hardhat account #0
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat account #1
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat account #2
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Hardhat account #3
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", // Hardhat account #4
    "0x4311623b16ce461d69d368185560cba936de21fd", // User's personal account #1 ✅
    "0x791b90ae817e012f289c7b163e0f971f529f0c69", // User's personal account #2 ✅
    // Add more addresses here
];

function generateMerkleTree() {
    console.log("🌳 Generating Merkle Tree...\n");

    // Create leaves from addresses
    const leaves = whitelist.map(addr => keccak256(addr));

    // Create tree
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot = merkleTree.getHexRoot();

    console.log("✅ Merkle Root:", merkleRoot);
    console.log("📊 Total addresses:", whitelist.length, "\n");

    // Generate proofs for all addresses
    const proofs = {};
    whitelist.forEach(address => {
        const leaf = keccak256(address);
        const proof = merkleTree.getHexProof(leaf);
        proofs[address] = proof;
    });

    // Create output object
    const output = {
        merkleRoot: merkleRoot,
        totalAddresses: whitelist.length,
        proofs: proofs,
        whitelist: whitelist,
        generatedAt: new Date().toISOString()
    };

    // Save to file
    fs.writeFileSync(
        "merkle-tree.json",
        JSON.stringify(output, null, 2)
    );

    console.log("💾 Merkle tree data saved to merkle-tree.json");
    console.log("\n📋 Sample proof for first address:");
    console.log("   Address:", whitelist[0]);
    console.log("   Proof:", JSON.stringify(proofs[whitelist[0]], null, 2));
    console.log("\n🎯 You can use this data to:");
    console.log("   1. Deploy airdrop contract with merkleRoot");
    console.log("   2. Verify addresses in frontend");
    console.log("   3. Generate proofs for claim transactions\n");
}

// Generate tree
generateMerkleTree();
