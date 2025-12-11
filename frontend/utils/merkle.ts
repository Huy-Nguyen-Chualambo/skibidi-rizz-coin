import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

// Whitelist addresses from deployment
const WHITELIST = [
    "0x791b90ae817E012f289C7B163E0f971f529f0c69", // Sepolia Deployer (You)
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    "0x4311623b16ce461d69d368185560cba936de21fd",
    "0x791b90ae817e012f289c7b163e0f971f529f0c69", // Duplicate (kept for consistency with deploy script)
];

export function getMerkleProof(address: string): string[] {
    try {
        // Create leaves from addresses
        const leaves = WHITELIST.map((addr) => keccak256(addr));

        // Create tree
        const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

        // Generate proof for address
        const leaf = keccak256(address);
        const proof = merkleTree.getHexProof(leaf);

        return proof;
    } catch (error) {
        console.error("Error generating merkle proof:", error);
        return [];
    }
}

export function isWhitelisted(address: string): boolean {
    return WHITELIST.map((a) => a.toLowerCase()).includes(address.toLowerCase());
}

export { WHITELIST };
