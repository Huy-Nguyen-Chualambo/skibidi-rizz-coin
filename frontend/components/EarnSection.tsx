"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { ethers, Contract } from "ethers";
import { SKIBIDI_AIRDROP_ABI } from "@/config/abi";

export default function EarnSection() {
    const { account, provider } = useWeb3();
    const [tasks, setTasks] = useState<any[]>([]);
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState<string | null>(null);
    const [claiming, setClaiming] = useState(false);


    // Fetch User Data & Tasks
    const fetchData = async () => {
        try {
            // 1. Get User Points
            const userRes = await fetch("/api/auth/user");
            const userData = await userRes.json();
            if (userData.authenticated) {
                setUserPoints(userData.user.points);
            }

            // 2. Get Tasks
            const tasksRes = await fetch("/api/tasks");
            const tasksData = await tasksRes.json();
            if (tasksData.tasks) {
                setTasks(tasksData.tasks);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (account) fetchData();
    }, [account]);

    const handleStartTask = (task: any) => {
        // Open link in new tab
        window.open(task.link, "_blank");

        // In real shortlink scenario, user waits or gets callback.
        // Here we simulate "Ready to Verify" state immediately or after timeout.
        // For UX, let's allow verifying immediately after click for MVP.
    };

    const handleVerify = async (task: any) => {
        setVerifying(task.id);
        try {
            const res = await fetch("/api/tasks/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId: task.id })
            });
            const data = await res.json();

            if (data.success) {
                // Refresh data
                await fetchData();
                alert(`🎉 +${data.reward} Points Received!`);
            } else {
                alert(data.error || "Verification Failed");
            }
        } catch (e) {
            alert("Error verifying task");
        } finally {
            setVerifying(null);
        }
    };

    const handleClaim = async () => {
        if (!process.env.NEXT_PUBLIC_AIRDROP_ADDRESS) return;
        setClaiming(true);
        try {
            // 1. Get Signature from Backend
            const res = await fetch("/api/claim", { method: "POST" });
            const data = await res.json();

            if (!data.success) {
                alert(data.error || "Claim failed");
                setClaiming(false);
                return;
            }

            // 2. Call Contract
            const signer = await provider?.getSigner();
            const contract = new Contract(
                process.env.NEXT_PUBLIC_AIRDROP_ADDRESS,
                SKIBIDI_AIRDROP_ABI,
                signer
            );

            console.log("Claiming...", data.amountInWei, data.signature);
            const tx = await contract.claim(data.amountInWei, data.signature);
            await tx.wait();

            alert(`successfully claimed ${data.amount} SRT! Check your wallet.`);
            setUserPoints(0); // Update local state
        } catch (error: any) {
            console.error(error);
            alert("Transaction Failed: " + (error.reason || error.message));
        } finally {
            setClaiming(false);
        }
    };

    if (!account) return null; // Hide if not connected

    return (
        <div className="mt-12 max-w-4xl mx-auto">
            {/* POINTS DASHBOARD */}
            <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-cyan-500/30 p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                <div>
                    <h2 className="text-2xl font-bold text-cyan-400 mb-2">MY BALANCE</h2>
                    <p className="text-gray-400 text-sm">Accumulated from tasks</p>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div>
                        <span className="text-6xl font-black text-white drop-shadow-xl">{userPoints}</span>
                        <span className="text-2xl font-bold text-cyan-500 ml-2">PTS</span>
                    </div>

                    {/* CLAIM BUTTON */}
                    <button
                        onClick={handleClaim}
                        disabled={userPoints < 10 || claiming}
                        className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${userPoints >= 10
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 text-black shadow-orange-500/50'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {claiming ? "Claiming..." :
                            userPoints < 10 ? `Min 10 to Claim` : "💰 CLAIM TOKENS"}
                    </button>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-400">⚡</span> AVAILABLE MISSIONS
            </h3>

            {/* TASK LIST */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 animate-pulse">Loading missions...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No missions available. Come back later!</div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className={`relative p-6 rounded-2xl border transition-all duration-300 ${task.completed
                            ? 'bg-green-900/20 border-green-500/30 opacity-70'
                            : 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-white/10'
                            }`}>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${task.platform === 'SHORTLINK' ? 'bg-orange-500/20 text-orange-400' :
                                            task.platform === 'TELEGRAM' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {task.platform}
                                        </span>
                                        <h4 className="text-xl font-bold text-white">{task.title}</h4>
                                    </div>
                                    <p className="text-gray-400 text-sm">{task.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-yellow-400 font-bold text-xl">
                                        +{task.reward} PTS
                                    </div>

                                    {task.completed ? (
                                        <button disabled className="px-6 py-3 bg-green-500/20 text-green-400 font-bold rounded-xl border border-green-500/50 cursor-not-allowed flex items-center gap-2">
                                            ✅ COMPLETED
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStartTask(task)}
                                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                                            >
                                                🚀 GO
                                            </button>
                                            <button
                                                onClick={() => handleVerify(task)}
                                                disabled={verifying === task.id}
                                                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                                            >
                                                {verifying === task.id ? "Checking..." : "Verify"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
