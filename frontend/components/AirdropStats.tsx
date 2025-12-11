"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/contexts/Web3Context";
import { CONTRACTS } from "@/config/contracts";
import { SKIBIDI_AIRDROP_ABI } from "@/config/abi";

export default function AirdropStats() {
    const { provider, chainId } = useWeb3();
    const [stats, setStats] = useState({
        totalClaimed: "0",
        totalParticipants: 0,
        remainingTokens: "0",
        isActive: false,
        airdropAmount: "0",
    });
    const [loading, setLoading] = useState(true);
    const [wrongNetwork, setWrongNetwork] = useState(false);

    const fetchStats = useCallback(async () => {
        if (!provider || !CONTRACTS.AIRDROP_ADDRESS) {
            setLoading(false);
            return;
        }

        const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
        if (chainId && chainId !== targetChainId) {
            setWrongNetwork(true);
            setLoading(false);
            return;
        } else {
            setWrongNetwork(false);
        }

        try {
            const code = await provider.getCode(CONTRACTS.AIRDROP_ADDRESS);
            if (code === '0x') {
                setWrongNetwork(true);
                setLoading(false);
                return;
            }

            const airdropContract = new ethers.Contract(
                CONTRACTS.AIRDROP_ADDRESS,
                SKIBIDI_AIRDROP_ABI,
                provider
            );

            const [totalClaimed, totalParticipants, remainingTokens, isActive] =
                await airdropContract.getStats();

            const airdropAmount = await airdropContract.airdropAmount();

            setStats({
                totalClaimed: ethers.formatEther(totalClaimed),
                totalParticipants: Number(totalParticipants),
                remainingTokens: ethers.formatEther(remainingTokens),
                isActive: Boolean(isActive),
                airdropAmount: ethers.formatEther(airdropAmount),
            });
            setWrongNetwork(false);
        } catch (error: any) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    }, [provider, chainId]);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    const statCards = [
        {
            title: "Total Mogged",
            value: parseFloat(stats.totalClaimed).toLocaleString() + " SRT",
            icon: "🎁",
            color: "from-yellow-400 to-pink-500",
        },
        {
            title: "Sigma Males",
            value: stats.totalParticipants.toString(),
            icon: "👥",
            color: "from-blue-400 to-cyan-500",
        },
        {
            title: "Leftovers",
            value: parseFloat(stats.remainingTokens).toLocaleString() + " SRT",
            icon: "💰",
            color: "from-green-400 to-emerald-500",
        },
        {
            title: "Per Rizzler",
            value: parseFloat(stats.airdropAmount).toLocaleString() + " SRT",
            icon: "⏰",
            color: "from-purple-400 to-indigo-500",
        },
    ];

    if (loading) {
        return (
            <div className="mb-20 perspective-1000">
                <div className="backdrop-blur-xl bg-purple-900/40 p-8 rounded-3xl border-2 border-yellow-400/50 shadow-2xl flex justify-center">
                    <div className="text-4xl animate-spin">🚽</div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-20 perspective-1000">
            {wrongNetwork ? (
                <div className="backdrop-blur-xl bg-red-900/60 p-8 rounded-3xl border-2 border-red-500/50 shadow-2xl text-center">
                    <h3 className="text-2xl font-black text-red-500 mb-2">WRONG NETWORK DETECTED</h3>
                    <p className="text-red-300">Please switch to Sepolia Testnet (Chain ID: 11155111)</p>
                </div>
            ) : (
                <div className="backdrop-blur-xl bg-purple-900/40 p-8 rounded-3xl border-2 border-yellow-400/50 shadow-2xl transform hover:rotate-y-5 transition-all duration-500 hover:shadow-yellow-400/30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {statCards.map((stat, index) => (
                            <div key={index} className="text-center group cursor-pointer">
                                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className={`text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color} mb-2`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">
                                    {stat.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
