"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';
import AirdropStats from '@/components/AirdropStats';
import ClaimAirdrop from '@/components/ClaimAirdrop';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-cyan-500 selection:text-black">

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Cyber Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          transform: `translateY(${scrollY * 0.2}px)`
        }} />

        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {/* Simple confetti can be kept or replaced with cleaner effect */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `fall ${2 + Math.random()}s linear forwards`
              }}
            />
          ))}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-black shadow-lg shadow-blue-500/50">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Skibidi<span className="text-gray-500">Protocol</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">
              Admin Panel
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">

        <div className="text-center max-w-4xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live on Sepolia Testnet
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
            The Future of <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              Decentralized Rizz.
            </span>
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12">
            Experience the next generation of meme-finance infrastructure.
            Secure, scalable, and built for the community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🛡️</div>
              <h3 className="text-lg font-bold text-white mb-2">Audited Security</h3>
              <p className="text-gray-400 text-sm">Smart contracts verified and tested on Sepolia network.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Settlement</h3>
              <p className="text-gray-400 text-sm">Modified ERC-20 standard for lightning-fast transfers.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🌐</div>
              <h3 className="text-lg font-bold text-white mb-2">Public Access</h3>
              <p className="text-gray-400 text-sm">Open distribution model with fair-launch mechanics.</p>
            </div>
          </div>
        </div>

        {/* CLAIM INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          <div className="lg:col-span-7 space-y-8">
            <AirdropStats />

            {/* Token Info Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-400">Token Name</td>
                    <td className="p-4 font-mono text-white text-right">Skibidi Rizz Token</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-400">Symbol</td>
                    <td className="p-4 font-mono text-cyan-400 text-right">SRT</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-400">Network</td>
                    <td className="p-4 font-mono text-white text-right">Sepolia</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-400">Contract</td>
                    <td className="p-4 font-mono text-gray-500 text-right text-xs truncate max-w-[200px]">
                      {process.env.NEXT_PUBLIC_TOKEN_ADDRESS}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <ClaimAirdrop onSuccess={() => {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
            }} />

            <p className="mt-6 text-center text-xs text-gray-500">
              By connecting your wallet, you agree to our Terms of Service.
              <br />Gas fees are required for transaction processing.
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="mt-32 border-t border-white/5 pt-12 pb-8 text-center text-gray-500 text-sm">
          <p>© 2024 Skibidi Protocol Foundation. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 opacity-50">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </footer>

      </main>
    </div>
  );
}
