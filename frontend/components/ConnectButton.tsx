"use client";

import { useWeb3 } from "@/contexts/Web3Context";

export default function ConnectButton() {
    const { account, connectWallet, disconnectWallet, isConnecting, error } = useWeb3();

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="flex flex-col items-center gap-2">
            {!account ? (
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isConnecting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Connecting...
                        </span>
                    ) : (
                        "🦊 Connect MetaMask"
                    )}
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="px-6 py-3 bg-gray-800 text-white font-mono rounded-full shadow-lg border border-gray-700">
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            {formatAddress(account)}
                        </span>
                    </div>
                    <button
                        onClick={disconnectWallet}
                        className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Disconnect
                    </button>
                </div>
            )}
            {error && (
                <p className="text-red-500 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    {error}
                </p>
            )}
        </div>
    );
}
