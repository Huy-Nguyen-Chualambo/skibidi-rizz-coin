import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/contexts/Web3Context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkibidiRizz Token - DeFi Airdrop Platform",
  description: "Claim your free SkibidiRizz Tokens (SRT) - The next generation DeFi ecosystem",
  keywords: ["DeFi", "Airdrop", "Cryptocurrency", "Web3", "Blockchain", "SRT"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
