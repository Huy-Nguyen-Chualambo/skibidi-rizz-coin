"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers, BrowserProvider } from "ethers";

interface Web3ContextType {
    account: string | null;
    chainId: number | null;
    provider: BrowserProvider | null;
    signer: ethers.Signer | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnecting: boolean;
    error: string | null;
}

const Web3Context = createContext<Web3ContextType>({
    account: null,
    chainId: null,
    provider: null,
    signer: null,
    connectWallet: async () => { },
    disconnectWallet: () => { },
    isConnecting: false,
    error: null,
});

export function Web3Provider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        try {
            setIsConnecting(true);
            setError(null);

            if (!window.ethereum) {
                throw new Error("MetaMask is not installed. Please install MetaMask to use this dApp.");
            }

            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await web3Provider.send("eth_requestAccounts", []);
            const network = await web3Provider.getNetwork();
            const web3Signer = await web3Provider.getSigner();

            setProvider(web3Provider);
            setAccount(accounts[0]);
            setChainId(Number(network.chainId));
            setSigner(web3Signer);
        } catch (err: any) {
            console.error("Error connecting wallet:", err);
            setError(err.message || "Failed to connect wallet");
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setChainId(null);
        setProvider(null);
        setSigner(null);
        setError(null);
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    setAccount(accounts[0]);
                }
            });

            window.ethereum.on("chainChanged", () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners("accountsChanged");
                window.ethereum.removeAllListeners("chainChanged");
            }
        };
    }, []);

    return (
        <Web3Context.Provider
            value={{
                account,
                chainId,
                provider,
                signer,
                connectWallet,
                disconnectWallet,
                isConnecting,
                error,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
}
