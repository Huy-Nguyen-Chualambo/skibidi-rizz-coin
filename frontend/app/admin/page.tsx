"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import { useWeb3 } from "@/contexts/Web3Context";
import { SKIBIDI_TOKEN_ABI, SKIBIDI_AIRDROP_ABI } from "@/config/abi";
import { CONTRACTS } from "@/config/contracts";

export default function AdminDashboard() {
    const { provider, account, chainId } = useWeb3();
    const [stats, setStats] = useState<any>({
        tokenTotalSupply: "0",
        airdropBalance: "0",
        deployerBalance: "0",
        totalClaimed: "0",
        remainingTokens: "0",
        isPaused: false,
    });
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Contract Data
    const fetchAdminData = async () => {
        if (!provider) return;

        try {
            const tokenContract = new Contract(CONTRACTS.TOKEN_ADDRESS, SKIBIDI_TOKEN_ABI, provider);
            const airdropContract = new Contract(CONTRACTS.AIRDROP_ADDRESS, SKIBIDI_AIRDROP_ABI, provider);

            // 1. Token Metrics
            const totalSupply = await tokenContract.totalSupply();
            const airdropBal = await tokenContract.balanceOf(CONTRACTS.AIRDROP_ADDRESS);

            // 2. Airdrop Metrics
            const claimed = await airdropContract.totalClaimed();
            const remaining = await airdropContract.getRemainingTokens();
            const paused = !(await airdropContract.airdropActive());

            let deployerBal = "0";
            if (account) {
                deployerBal = await tokenContract.balanceOf(account);
            }

            setStats({
                tokenTotalSupply: ethers.formatEther(totalSupply),
                airdropBalance: ethers.formatEther(airdropBal),
                deployerBalance: ethers.formatEther(deployerBal),
                totalClaimed: ethers.formatEther(claimed),
                remainingTokens: ethers.formatEther(remaining),
                isPaused: paused,
            });

            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            setLoading(false);
        }
    };

    // Listen for Real-time Events
    useEffect(() => {
        if (!provider) return;

        const airdropContract = new Contract(CONTRACTS.AIRDROP_ADDRESS, SKIBIDI_AIRDROP_ABI, provider);

        // Define event listener
        const setupEvents = async () => {
            // Get past events (last 100 blocks)
            const currentBlock = await provider.getBlockNumber();
            const fromBlock = currentBlock - 1000 > 0 ? currentBlock - 1000 : 0;

            const filter = airdropContract.filters.AirdropClaimed();
            const logs = await airdropContract.queryFilter(filter, fromBlock);

            const formattedLogs = logs.map((log: any) => ({
                user: log.args[0],
                amount: ethers.formatEther(log.args[1]),
                hash: log.transactionHash,
                block: log.blockNumber
            })).reverse(); // Newest first

            setEvents(formattedLogs);

            // Listen for NEW events
            airdropContract.on("AirdropClaimed", (user, amount, event) => {
                console.log("New Claim Detected!");
                const newEvent = {
                    user: user,
                    amount: ethers.formatEther(amount),
                    hash: event.log.transactionHash,
                    block: event.log.blockNumber
                };
                setEvents(prev => [newEvent, ...prev]);
                fetchAdminData(); // Refresh stats
            });
        };

        setupEvents();
        fetchAdminData();

        // Cleanup
        return () => {
            airdropContract.removeAllListeners();
        };
    }, [provider, chainId]);

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                🛠️ Admin & Debug Panel
            </h1>

            {/* ERROR WARNING */}
            {chainId !== parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111") && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl mb-6">
                    ⚠️ Wrong Network! Please switch to {process.env.NEXT_PUBLIC_CHAIN_ID === "11155111" ? "Sepolia" : "Localhost"} to view debug data.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* 1. CONTRACT STATE */}
                <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-emerald-400">🏦 Contract Balances (Vault)</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                            <span className="text-gray-400">Token Contract Supply:</span>
                            <span className="font-mono text-white">{parseInt(stats.tokenTotalSupply).toLocaleString()} SRT</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg border border-purple-500/30">
                            <span className="text-purple-400">Airdrop Contract Balance (ATM):</span>
                            <span className="font-mono text-purple-300 font-bold">{parseInt(stats.airdropBalance).toLocaleString()} SRT</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                            <span className="text-gray-400">Your Wallet Balance:</span>
                            <span className="font-mono text-white">{parseInt(stats.deployerBalance).toLocaleString()} SRT</span>
                        </div>
                        <div className="h-px bg-gray-700 my-2"></div>
                        <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                            <span className="text-green-400">Total Distributed:</span>
                            <span className="font-mono text-green-300">{parseInt(stats.totalClaimed).toLocaleString()} SRT</span>
                        </div>
                    </div>
                </div>

                {/* 2. TRANSACTION LOGS */}
                <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">📜 Live Event Logs</h2>
                    <p className="text-sm text-gray-400 mb-4">Listening for "AirdropClaimed" events happening on chain...</p>

                    <div className="h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {events.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">No events found yet...</p>
                        ) : (
                            events.map((evt, idx) => (
                                <div key={idx} className="bg-black/40 p-3 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-green-400">CLAIM SUCCESS ✅</span>
                                        <span className="text-xs text-gray-500">Block #{evt.block}</span>
                                    </div>
                                    <div className="font-mono text-xs text-gray-300 truncate">
                                        User: <span className="text-yellow-200">{evt.user}</span>
                                    </div>
                                    <div className="font-mono text-xs text-gray-400 truncate flex justify-between mt-1">
                                        <span>Amount: {evt.amount} SRT</span>
                                        <a
                                            href={`http://localhost:8545/tx/${evt.hash}`} // Local explorer logic usually simpler
                                            target="_blank"
                                            className="text-blue-400 hover:underline"
                                            rel="noreferrer"
                                        >
                                            View TX ↗
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 3. VISUALIZATION */}
            <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-700 text-center">
                <h3 className="text-xl font-bold mb-6">🔄 How Tokens Move</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm md:text-base">
                    <div className="p-4 bg-gray-900 rounded-xl border border-gray-600">
                        <div className="text-2xl mb-2">🏭</div>
                        <div className="font-bold">Token Contract</div>
                        <div className="text-gray-400 text-xs">Mints 1M SRT</div>
                    </div>

                    <div className="text-2xl animate-pulse text-gray-500">➡️</div>

                    <div className="p-4 bg-gray-900 rounded-xl border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <div className="text-2xl mb-2">🏧</div>
                        <div className="font-bold text-purple-300">Airdrop Contract</div>
                        <div className="text-gray-400 text-xs">Holds 400k SRT</div>
                    </div>

                    <div className="text-2xl animate-pulse text-green-500">➡️</div>

                    <div className="p-4 bg-gray-900 rounded-xl border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        <div className="text-2xl mb-2">👤</div>
                        <div className="font-bold text-green-300">User Wallet</div>
                        <div className="text-gray-400 text-xs">Claims 1k SRT</div>
                    </div>
                </div>
                <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
                    When you click "Claim", you are asking the <b>Airdrop Contract</b> to verify your whitelist proof.
                    If valid, the contract sends tokens from its own balance to your wallet. You pay the gas fee for this verification.
                </p>
            </div>
        </main>
    );
}
