"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACTS } from "@/config/contracts";

export default function AirdropStats() {
    const [stats, setStats] = useState({
        totalSupply: "0",
        airdropAllocation: "0",
        tokensClaimed: "0",
        registeredUsers: "0",
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!CONTRACTS.AIRDROP_ADDRESS || !process.env.NEXT_PUBLIC_RPC_URL) {
            setLoading(false);
            return;
        }

        try {
            // Use public RPC provider (no wallet needed)
            const publicProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
            // Create contract instances
            const tokenContract = new ethers.Contract(
                process.env.NEXT_PUBLIC_TOKEN_ADDRESS!,
                [
                    "function totalSupply() view returns (uint256)",
                    "function balanceOf(address) view returns (uint256)",
                    "function AIRDROP_ALLOCATION() view returns (uint256)"
                ],
                publicProvider
            );

            // Fetch data from blockchain
            const totalSupply = await tokenContract.totalSupply();
            const initialAllocation = await tokenContract.AIRDROP_ALLOCATION();
            const currentAirdropBalance = await tokenContract.balanceOf(CONTRACTS.AIRDROP_ADDRESS);

            // Calculate claimed amount: Initial - Current
            const claimed = initialAllocation - currentAirdropBalance;

            // Format numbers
            const totalSupplyFormatted = ethers.formatEther(totalSupply);
            const allocationFormatted = ethers.formatEther(initialAllocation);
            const tokensClaimedFormatted = ethers.formatEther(claimed);

            // Fetch registered users count from database
            let usersCount = "0";
            try {
                const res = await fetch("/api/stats/users");
                if (res.ok) {
                    const data = await res.json();
                    usersCount = data.count?.toLocaleString() || "0";
                }
            } catch (e) {
                console.log("Could not fetch user count");
            }

            setStats({
                totalSupply: parseFloat(totalSupplyFormatted).toLocaleString(undefined, { maximumFractionDigits: 0 }),
                airdropAllocation: parseFloat(allocationFormatted).toLocaleString(undefined, { maximumFractionDigits: 0 }),
                tokensClaimed: parseFloat(tokensClaimedFormatted).toLocaleString(undefined, { maximumFractionDigits: 0 }),
                registeredUsers: usersCount,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
            // Fallback
            setStats({
                totalSupply: "1,000,000",
                airdropAllocation: "400,000",
                tokensClaimed: "0",
                registeredUsers: "0",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 15000); // Refresh every 15s
        return () => clearInterval(interval);
    }, [fetchStats]);

    const statsData = [
        {
            label: "Total Supply",
            value: stats.totalSupply,
            unit: "SRT",
            icon: "📊",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            label: "Airdrop Allocation",
            value: stats.airdropAllocation,
            unit: "SRT",
            icon: "🎁",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            label: "Tokens Claimed",
            value: stats.tokensClaimed,
            unit: "SRT",
            icon: "✅",
            gradient: "from-lime-500 to-green-500"
        },
        {
            label: "Registered Users",
            value: stats.registeredUsers,
            unit: "accounts",
            icon: "👥",
            gradient: "from-orange-500 to-red-500"
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card-dark p-6 animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, idx) => (
                <div
                    key={idx}
                    className="card-dark p-6 hover:scale-105 transition-transform group"
                >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                    </div>

                    {/* Label */}
                    <div className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-wider">
                        {stat.label}
                    </div>

                    {/* Value */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white group-hover:gradient-text transition-all">
                            {stat.value}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                            {stat.unit}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
