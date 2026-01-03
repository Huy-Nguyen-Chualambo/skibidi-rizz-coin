"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function ConnectButton({ compact = false }: { compact?: boolean }) {
    const { account, provider, connectWallet, disconnectWallet, isConnecting, error } = useWeb3();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Check login status on mount
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch("/api/auth/user");
                const data = await res.json();
                if (data.authenticated && data.user.address.toLowerCase() === account?.toLowerCase()) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (e) { setIsLoggedIn(false); }
        };
        if (account) checkLogin();
    }, [account]);

    const handleLogin = async () => {
        if (!account || !provider) return;
        setIsVerifying(true);
        try {
            // 1. Get Nonce
            const nonceRes = await fetch("/api/auth/nonce", {
                method: "POST",
                body: JSON.stringify({ address: account }),
            });

            if (!nonceRes.ok) {
                const errData = await nonceRes.json();
                throw new Error(errData.error || "Failed to get nonce from server");
            }

            const { nonce } = await nonceRes.json();
            if (!nonce) throw new Error("Server returned empty nonce");

            // 2. Sign Message
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(nonce);

            // 3. Verify Login
            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ address: account, signature }),
            });

            if (loginRes.ok) {
                setIsLoggedIn(true);
            } else {
                alert("Login Failed!");
            }
        } catch (error) {
            console.error(error);
            alert("User Rejected Signature");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleDisconnect = async () => {
        // Logout backend
        await fetch("/api/auth/user", { method: "DELETE" });
        setIsLoggedIn(false);
        disconnectWallet();
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, compact ? 4 : 6)}...${address.slice(compact ? -2 : -4)}`;
    };

    return (
        <div className={`flex ${compact ? 'flex-row items-center' : 'flex-col items-center'} gap-2`}>
            {!account ? (
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className={`${compact ? 'px-3 py-1.5 text-xs' : 'px-8 py-3'} bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-full shadow-lg transition-all duration-200 whitespace-nowrap`}
                >
                    {isConnecting ? "..." : (compact ? "🦊 Connect" : "🦊 Connect Wallet")}
                </button>
            ) : (
                <div className="flex items-center gap-1.5">
                    {/* ACCOUNT BADGE */}
                    <div className={`${compact ? 'px-2 py-1' : 'px-5 py-2'} bg-gray-900/80 backdrop-blur border border-gray-700 rounded-full flex items-center gap-1.5`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isLoggedIn ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                        <span className={`font-mono text-gray-300 font-bold ${compact ? 'text-[10px]' : 'text-sm'}`}>{formatAddress(account)}</span>
                    </div>

                    {/* LOGIN ACTION */}
                    {!isLoggedIn ? (
                        <button
                            onClick={handleLogin}
                            disabled={isVerifying}
                            className={`${compact ? 'px-2 py-1 text-[10px]' : 'px-4 py-2 text-sm'} bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full shadow-lg transition-transform hover:scale-105`}
                        >
                            {isVerifying ? "..." : (compact ? "🔑 Verify" : "Verify to Claim $SRT")}
                        </button>
                    ) : (
                        !compact && (
                            <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/50 uppercase">
                                Verified
                            </div>
                        )
                    )}

                    <button
                        onClick={handleDisconnect}
                        className={`${compact ? 'p-1' : 'p-2'} text-gray-400 hover:text-red-400 transition-colors`}
                        title="Disconnect"
                    >
                        <svg className={`${compact ? 'w-4 h-4' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            )}
        </div>
    );
}
