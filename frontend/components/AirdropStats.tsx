"use client";

import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { ethers } from "ethers";
import { CONTRACTS } from "@/config/contracts";
import { AIRDROP_ABI } from "@/config/abi";

export default function AirdropStats() {
    const { provider, account, chainId } = useWeb3();
    const [stats, setStats] = useState({
        totalClaimed: "0",
        totalParticipants: 0,
        remainingTokens: "0",
        isActive: false,
        airdropAmount: "0",
        hasClaimed: false,
    });
    const [loading, setLoading] = useState(true);
    const [wrongNetwork, setWrongNetwork] = useState(false);

    const fetchStats = useCallback(async () => {
        if (!provider || !CONTRACTS.AIRDROP_ADDRESS) {
            setLoading(false);
            return;
        }

        // Check if on correct network (1337 = Hardhat Local)
        if (chainId && chainId !== 1337) {
            setWrongNetwork(true);
            setLoading(false);
            return;
        } else {
            setWrongNetwork(false);
        }

        try {
            // Check if contract exists at address
            const code = await provider.getCode(CONTRACTS.AIRDROP_ADDRESS);
            if (code === '0x') {
                console.error("No contract found at address:", CONTRACTS.AIRDROP_ADDRESS);
                console.error("Make sure you're on Hardhat Local network (Chain ID: 1337)");
                setWrongNetwork(true);
                setLoading(false);
                return;
            }

            const airdropContract = new ethers.Contract(
                CONTRACTS.AIRDROP_ADDRESS,
                AIRDROP_ABI,
                provider
            );

            // Fetch all stats
            const [totalClaimed, totalParticipants, remainingTokens, isActive] =
                await airdropContract.getStats();

            const airdropAmount = await airdropContract.airdropAmount();

            let hasClaimed = false;
            if (account) {
                hasClaimed = await airdropContract.hasClaimed(account);
            }

            setStats({
                totalClaimed: ethers.formatEther(totalClaimed),
                totalParticipants: Number(totalParticipants),
                remainingTokens: ethers.formatEther(remainingTokens),
                isActive: Boolean(isActive),
                airdropAmount: ethers.formatEther(airdropAmount),
                hasClaimed,
            });
            setWrongNetwork(false);
        } catch (error: any) {
            console.error("Error fetching stats:", error);
            // Set default values on error
            setStats({
                totalClaimed: "0",
                totalParticipants: 0,
                remainingTokens: "0",
                isActive: false,
                airdropAmount: "0",
                hasClaimed: false,
            });
        } finally {
            setLoading(false);
        }
    }, [provider, account, chainId]);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 15000); // Refresh every 15 seconds
        return () => clearInterval(interval);
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-700 rounded-2xl p-6 h-32" />
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Distributed",
            value: parseFloat(stats.totalClaimed).toLocaleString(),
            unit: "SRT",
            icon: "💰",
            color: "from-blue-500 to-cyan-500",
        },
        {
            title: "Total Participants",
            value: stats.totalParticipants.toLocaleString(),
            unit: "Users",
            icon: "👥",
            color: "from-purple-500 to-pink-500",
        },
        {
            title: "Remaining Tokens",
            value: parseFloat(stats.remainingTokens).toLocaleString(),
            unit: "SRT",
            icon: "🎁",
            color: "from-green-500 to-emerald-500",
        },
        {
            title: "Amount Per User",
            value: parseFloat(stats.airdropAmount).toLocaleString(),
            unit: "SRT",
            icon: "⭐",
            color: "from-orange-500 to-red-500",
        },
    ];

    return (
        <div className="space-y-4">
            {wrongNetwork && (
                <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <span className="text-4xl">⚠️</span>
                        <div className="flex-1">
                            <h3 className="text-red-400 font-bold text-lg mb-2">Wrong Network Detected!</h3>
                            <p className="text-red-300 mb-3">
                                You're connected to <span className="font-mono bg-red-900/30 px-2 py-1 rounded">Chain ID: {chainId}</span> but contracts are deployed on <span className="font-mono bg-green-900/30 px-2 py-1 rounded text-green-300">Hardhat Local (1337)</span>
                            </p>
                            <div className="bg-red-900/30 rounded-lg p-4 mb-3">
                                <p className="text-red-200 font-semibold mb-2">📌 To fix:</p>
                                <ol className="text-red-200 text-sm space-y-1 list-decimal list-inside">
                                    <li>Open MetaMask</li>
                                    <li>Click network dropdown at top</li>
                                    <li>Select "Hardhat Local" (or add it if not present)</li>
                                    <li>Refresh this page</li>
                                </ol>
                            </div>
                            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3">
                                <p className="text-yellow-200 text-sm">
                                    <strong>Network Details:</strong><br />
                                    RPC URL: <code className="bg-black/30 px-1">http://127.0.0.1:8545</code><br />
                                    Chain ID: <code className="bg-black/30 px-1">1337</code>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-4xl">{stat.icon}</span>
                            <div className={`px-3 py-1 bg-gradient-to-r ${stat.color} rounded-full`}>
                                <span className="text-xs font-bold text-white">{stat.unit}</span>
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {account && (
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Your Status</h3>
                            <p className="text-gray-400">
                                {stats.hasClaimed ? (
                                    <span className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> You have claimed {stats.airdropAmount} SRT
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span className="text-yellow-500">⏳</span> You haven&apos;t claimed yet
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${stats.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                <span className={`w-2 h-2 rounded-full ${stats.isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                <span className="font-semibold">{stats.isActive ? "Active" : "Inactive"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
