"use client";

import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { ethers } from "ethers";
import { CONTRACTS } from "@/config/contracts";
import { AIRDROP_ABI } from "@/config/abi";

export default function ClaimAirdrop() {
    const { account, signer } = useWeb3();
    const [claiming, setClaiming] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleClaim = async () => {
        if (!account || !signer) {
            setError("Please connect your wallet first");
            return;
        }

        if (!CONTRACTS.AIRDROP_ADDRESS) {
            setError("Contract address not configured. Please check .env.local file.");
            return;
        }

        try {
            setClaiming(true);
            setError("");
            setSuccess(false);
            setTxHash("");

            // Check if contract exists
            const provider = signer.provider;
            if (provider) {
                const code = await provider.getCode(CONTRACTS.AIRDROP_ADDRESS);
                if (code === '0x') {
                    setError("Contract not found. Please ensure you're connected to the correct network (Localhost Chain ID: 1337)");
                    setClaiming(false);
                    return;
                }
            }

            // Import merkle utility
            const { getMerkleProof, isWhitelisted } = await import("@/utils/merkle");

            // Check if address is whitelisted
            if (!isWhitelisted(account)) {
                setError(`Address ${account} is not on the whitelist. Please use one of the test accounts from 'npx hardhat node'.`);
                setClaiming(false);
                return;
            }

            // Get merkle proof for this address
            const merkleProof = getMerkleProof(account);

            if (merkleProof.length === 0) {
                setError("Failed to generate merkle proof.");
                setClaiming(false);
                return;
            }

            console.log("Claiming with proof:", merkleProof);

            const airdropContract = new ethers.Contract(
                CONTRACTS.AIRDROP_ADDRESS,
                AIRDROP_ABI,
                signer
            );

            // Check if eligible
            const isEligible = await airdropContract.isEligible(account, merkleProof);
            if (!isEligible) {
                setError("You are not eligible for this airdrop or have already claimed.");
                setClaiming(false);
                return;
            }

            // Claim airdrop
            const tx = await airdropContract.claimAirdrop(merkleProof);
            setTxHash(tx.hash);

            await tx.wait();

            setSuccess(true);
            setError("");
        } catch (err: any) {
            console.error("Error claiming airdrop:", err);

            if (err.message.includes("Already claimed")) {
                setError("You have already claimed your airdrop!");
            } else if (err.message.includes("Invalid merkle proof")) {
                setError("You are not on the whitelist for this airdrop.");
            } else if (err.message.includes("Airdrop is not active")) {
                setError("The airdrop is currently not active.");
            } else if (err.message.includes("user rejected")) {
                setError("Transaction rejected by user.");
            } else {
                setError(err.message || "Failed to claim airdrop. Please try again.");
            }
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 shadow-2xl">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">🎁 Claim Your Airdrop</h2>
                <p className="text-gray-400">Get your free SkibidiRizz Tokens now!</p>
            </div>

            {!account ? (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                    <p className="text-yellow-400 font-semibold">⚠️ Please connect your wallet to claim</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <button
                        onClick={handleClaim}
                        disabled={claiming || success}
                        className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {claiming ? (
                            <span className="flex items-center justify-center gap-3">
                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Claiming...
                            </span>
                        ) : success ? (
                            "✓ Claimed Successfully!"
                        ) : (
                            "Claim Airdrop"
                        )}
                    </button>

                    {txHash && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <p className="text-blue-400 text-sm mb-2 font-semibold">Transaction Hash:</p>
                            <a
                                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-blue-200 text-xs font-mono break-all underline"
                            >
                                {txHash}
                            </a>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <p className="text-red-400 text-sm">❌ {error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <p className="text-green-400 text-sm font-semibold">
                                🎉 Congratulations! Your airdrop has been claimed successfully!
                            </p>
                        </div>
                    )}

                    <div className="bg-gray-700/50 rounded-xl p-4 mt-6">
                        <h3 className="text-white font-semibold mb-2">ℹ️ How to claim:</h3>
                        <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                            <li>Connect your MetaMask wallet</li>
                            <li>Make sure you&apos;re on Sepolia testnet</li>
                            <li>Click &quot;Claim Airdrop&quot; button</li>
                            <li>Confirm the transaction in MetaMask</li>
                            <li>Wait for confirmation (usually 10-30 seconds)</li>
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
}
