"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConnectButton from '@/components/ConnectButton';
import AirdropStats from '@/components/AirdropStats';
import ClaimAirdrop from '@/components/ClaimAirdrop';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Generate random particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: ['🚽', '🗿', '💀', '🔥', '💅', '💎', '⚡', '🌟'][i % 8],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }));
    setParticles(newParticles);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white overflow-hidden relative">

      {/* ANIMATED GRID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translateY(${scrollY * 0.5}px)`,
        }} />
      </div>

      {/* FLOATING PARTICLES WITH PARALLAX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-4xl opacity-30 blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.02}px, ${(mousePos.y - window.innerHeight / 2) * 0.02}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      {/* GRADIENT ORBS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* CONFETTI EFFECT */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {['🎉', '💰', '🚀', '⭐', '💎'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* NAVBAR WITH GLASSMORPHISM */}
      <nav className="relative z-50 backdrop-blur-xl bg-black/30 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">🚽</span>
              <h1 className="text-4xl font-black uppercase tracking-tighter bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                SKIBIDI RIZZ
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin" className="hidden md:block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-sm shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-rotate-2 text-white">
                🛠️ ADMIN HACK
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16">

        {/* WARNING BADGE */}
        <div className="flex justify-center mb-8">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xl md:text-2xl px-8 py-3 rounded-full uppercase tracking-wider transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
              ⚠️ WARNING: GYATT LEVEL 9000 ⚠️
            </div>
          </div>
        </div>

        {/* MAIN TITLE */}
        <div className="text-center mb-16">
          <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
            <span className="inline-block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
              OHIO FINAL
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient drop-shadow-2xl">
              BOSS TOKEN
            </span>
          </h1>

          <div className="relative inline-block mt-8 group cursor-pointer">
            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative backdrop-blur-lg bg-black/60 p-6 rounded-3xl border-2 border-pink-500/50 shadow-2xl max-w-3xl mx-auto">
              <p className="text-2xl md:text-3xl font-bold text-pink-300 leading-relaxed">
                No Cap 🧢 • No Fanum Tax 🍕 • 100% Sigma Grindset 🗿
                <br />
                <span className="text-yellow-300 inline-block mt-2 animate-bounce">
                  Claim your FREE SRT before it's too late!
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* STATS BOARD WITH 3D EFFECT */}
        <AirdropStats />

        {/* CLAIM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* CLAIM CARD */}
          <ClaimAirdrop onSuccess={() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }} />

          {/* INFO CARDS */}
          <div className="space-y-8">

            {/* TOKENOMICS */}
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative backdrop-blur-xl bg-blue-900/60 p-8 rounded-3xl border-2 border-cyan-400/50 shadow-2xl">
                <h3 className="text-4xl font-black text-cyan-300 mb-6 flex items-center gap-3">
                  <span className="text-5xl">📉</span> TOKENOMICS
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Total Supply', value: '1,000,000 SRT', color: 'text-yellow-400' },
                    { label: '4 Da Boyz', value: '40%', color: 'text-green-400' },
                    { label: 'Skibidi Marketing', value: '20%', color: 'text-pink-400' },
                    { label: 'Grimace Shake Fund', value: '40%', color: 'text-purple-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 backdrop-blur-lg bg-black/40 rounded-xl border border-white/10 hover:border-cyan-400/50 transition-colors group/item">
                      <span className="font-bold text-lg group-hover/item:text-cyan-300 transition-colors">{item.label}</span>
                      <span className={`font-black text-xl ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROADMAP */}
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative backdrop-blur-xl bg-red-900/60 p-8 rounded-3xl border-2 border-orange-500/50 shadow-2xl">
                <h3 className="text-4xl font-black text-orange-300 mb-6 flex items-center gap-3">
                  <span className="text-5xl">🛣️</span> ROADMAP
                </h3>
                <div className="space-y-5">
                  {[
                    { date: 'SEP 2024', text: 'Launch Token', status: 'done', color: 'bg-green-500' },
                    { date: 'NOW', text: 'Mogging ETH', status: 'active', color: 'bg-yellow-400' },
                    { date: 'SOON™', text: 'Buy Ohio', status: 'pending', color: 'bg-gray-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center p-4 backdrop-blur-lg bg-black/40 rounded-xl border border-white/10 hover:border-orange-400/50 transition-all group/item">
                      <div className={`${item.color} text-black font-black px-4 py-2 rounded-lg shadow-lg transform group-hover/item:scale-110 transition-transform`}>
                        {item.date}
                      </div>
                      <p className={`font-bold text-lg flex-1 ${item.status === 'done' ? 'line-through text-gray-500' : item.status === 'active' ? 'animate-pulse text-white' : 'text-gray-400'}`}>
                        {item.text}
                      </p>
                      {item.status === 'done' && <span className="text-2xl">✅</span>}
                      {item.status === 'active' && <span className="text-2xl animate-spin">⚡</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-32 border-t-2 border-white/10 pt-16 pb-8 text-center">
          <div className="mb-8">
            <p className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 uppercase tracking-wider">
              BUILT DIFFERENT 😤
            </p>
            <div className="flex justify-center gap-6">
              {['🐦', '👾', '✈️'].map((emoji, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-16 h-16 flex items-center justify-center text-4xl backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 hover:border-purple-400/50 hover:bg-purple-900/30 transition-all duration-300 hover:scale-125 hover:rotate-12"
                >
                  {emoji}
                </a>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-lg bg-black/40 p-6 rounded-2xl border border-white/10 max-w-2xl mx-auto">
            <p className="text-xs text-gray-500 font-mono leading-relaxed">
              NOT FINANCIAL ADVICE. IF YOU LOSE MONEY IT'S A SKILL ISSUE.
              COPY THIS AND ADD TO YOUR DAPP: 0x17164f16cb9C811637DEd6D9C64aA730A042E80e
              <br />
              <span className="text-purple-400">DYOR • NFA • WAGMI • LFG</span>
            </p>
          </div>
        </footer>
      </main>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
