"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/contexts/Web3Context";
import { CONTRACTS } from "@/config/contracts";
import { SKIBIDI_AIRDROP_ABI } from "@/config/abi";

export default function ClaimAirdrop({ onSuccess }: { onSuccess?: () => void }) {
    const { provider, account } = useWeb3();
    const [claiming, setClaiming] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [txHash, setTxHash] = useState("");

    const handleClaim = async () => {
        if (!provider || !account) return;

        setClaiming(true);
        setStatus("idle");
        setMessage("");

        try {
            // Public Airdrop - No whitelist check needed!
            // const { getMerkleProof, isWhitelisted } = await import("@/utils/merkle");

            // Proof generation removed as per instruction.
            // The airdrop is now public, so no merkle proof is needed for the claim function.

            const signer = await provider.getSigner();
            const code = await provider.getCode(CONTRACTS.AIRDROP_ADDRESS);
            if (code === '0x') {
                setStatus("error");
                setMessage("❌ CONTRACT NOT FOUND");
                setClaiming(false);
                return;
            }

            const airdropContract = new ethers.Contract(
                CONTRACTS.AIRDROP_ADDRESS,
                SKIBIDI_AIRDROP_ABI,
                signer
            );

            // Check if already claimed
            const hasClaimed = await airdropContract.hasClaimed(account);
            if (hasClaimed) {
                setStatus("error");
                setMessage("🤡 ALREADY CLAIMED! (Greedy ahh)");
                setClaiming(false);
                return;
            }

            // 2. Call Contract directly (No Proof needed for Public Airdrop)
            console.log("Calling claimAirdrop()...");

            const tx = await airdropContract.claimAirdrop(); // No args!
            console.log("Transaction sent:", tx.hash);

            setMessage("⏳ MINING... (Mewing...)");
            await tx.wait();

            setTxHash(tx.hash);

            setStatus("success");
            setMessage("🔥 BRO COOKED! 1,000 SRT SECURED");

            if (onSuccess) onSuccess();

        } catch (error: any) {
            console.error(error);
            setStatus("error");
            if (error.reason?.includes("Already claimed")) {
                setMessage("🤡 ALREADY CLAIMED! (Greedy ahh)");
            } else if (error.reason?.includes("not active")) {
                setMessage("⛔ SHOP'S CLOSED (Not active)");
            } else if (error.info?.error?.code === 4001) {
                setMessage("🙅 REJECTED? Small aura energy.");
            } else {
                setMessage("💀 CRITICAL FAILURELMAO");
            }
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="relative group">
            <div className={`absolute inset-0 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${status === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-green-500 to-emerald-600'
                }`} />

            <div className="relative backdrop-blur-xl bg-gray-900/80 p-10 rounded-3xl border-2 border-green-500/50 shadow-2xl">
                <div className="absolute -top-8 -right-8 text-7xl animate-bounce">
                    🤑
                </div>

                <h2 className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-8 uppercase">
                    GET RICH OR DIE TRYING
                </h2>

                <div className="space-y-6 mb-8">
                    <div className="backdrop-blur-lg bg-black/40 p-6 rounded-2xl border border-white/10">
                        <div className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">
                            Your Address
                        </div>
                        <div className="text-xl font-mono text-white break-all">
                            {account ? account : "NOT CONNECTED"}
                        </div>
                    </div>

                    <div className="backdrop-blur-lg bg-black/40 p-6 rounded-2xl border border-white/10">
                        <div className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">
                            Reward
                        </div>
                        <div className="text-4xl font-black text-yellow-400">
                            1,000 SRT
                        </div>
                    </div>
                </div>

                {account ? (
                    <button
                        onClick={handleClaim}
                        disabled={claiming || status === 'success'}
                        className={`w-full py-6 rounded-2xl font-black text-2xl uppercase tracking-wider shadow-2xl transform transition-all duration-300 ${claiming || status === 'success'
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white hover:scale-105 hover:shadow-green-500/50 active:scale-95'
                            }`}
                    >
                        {claiming ? '⏳ COOKING...' : status === 'success' ? '✅ CLAIMED' : '🚀 CLAIM NOW'}
                    </button>
                ) : (
                    <div className="w-full py-6 rounded-2xl font-black text-2xl uppercase tracking-wider shadow-2xl bg-gray-700 text-gray-400 text-center cursor-not-allowed">
                        CONNECT WALLET FIRST
                    </div>
                )}

                {message && (
                    <p className={`mt-6 font-bold text-center animate-wiggle ${status === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {message}
                    </p>
                )}

                {status === 'success' && (
                    <div className="space-y-3 mt-4">
                        {txHash && (
                            <div className="text-center">
                                <a href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/tx/${txHash}`} target="_blank" className="text-blue-400 underline uppercase text-sm font-bold hover:text-blue-300">
                                    View Receipt ↗
                                </a>
                            </div>
                        )}

                        <button
                            onClick={async () => {
                                try {
                                    if ((window as any).ethereum) {
                                        await (window as any).ethereum.request({
                                            method: 'wallet_watchAsset',
                                            params: {
                                                type: 'ERC20',
                                                options: {
                                                    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
                                                    symbol: 'SRT',
                                                    decimals: 18,
                                                },
                                            } as any,
                                        });
                                    }
                                } catch (e) { console.error(e); }
                            }}
                            className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-orange-500 hover:bg-orange-400 text-white shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            🦊 ADD SRT TO METAMASK
                        </button>
                    </div>
                )}

                <p className="mt-6 text-gray-400 text-sm italic text-center">
                    *By claiming you agree to mog everyone else.
                </p>
            </div>
        </div>
    );
}
