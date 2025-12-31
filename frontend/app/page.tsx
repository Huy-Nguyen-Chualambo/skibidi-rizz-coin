"use client";

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import HowToClaimSection from '@/components/HowToClaimSection';
import TokenomicsChart from '@/components/TokenomicsChart';
import RoadmapSection from '@/components/RoadmapSection';
import EarnSection from '@/components/EarnSection';
import AirdropStats from '@/components/AirdropStats';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ['home', 'airdrop', 'earn', 'tokenomics', 'roadmap', 'community'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl glow-lime group-hover:scale-110 transition-transform">
                😎
              </div>
              <span className="font-black text-xl">
                <span className="text-white">Skibidi</span>
                <span className="gradient-text">Rizz</span>
              </span>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'airdrop', label: 'Airdrop' },
                { id: 'earn', label: 'Earn' },
                { id: 'tokenomics', label: 'Tokenomics' },
                { id: 'roadmap', label: 'Roadmap' },
                { id: 'community', label: 'Community' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeSection === item.id
                    ? 'text-white bg-white/10 glow-lime'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA - Mobile shows simplified version */}
            <div className="block md:hidden">
              <button className="px-4 py-2 bg-gradient-to-r from-lime-500 to-purple-600 rounded-full font-bold text-sm glow-lime">
                Connect
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home">
        <HeroSection />
      </div>

      {/* Airdrop Stats Section */}
      <section id="airdrop" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="gradient-text">Live Airdrop Stats</span>
            </h2>
            <p className="text-gray-400 text-lg">Track the $RIZZ distribution in real-time</p>
          </div>

          <AirdropStats />

          <HowToClaimSection />
        </div>
      </section>

      {/* Earn Section */}
      <section id="earn" className="relative py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="gradient-text">Earn More $RIZZ</span>
            </h2>
            <p className="text-gray-400 text-lg">Connect wallet and complete tasks to claim your rewards</p>
          </div>

          <EarnSection />
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <TokenomicsChart />
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="relative py-20 px-6 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <RoadmapSection />
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-dark p-12 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black">
              <span className="gradient-text">Join the Rizz Community</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect with thousands of Sigma Rizzlers. Don't miss the latest updates, memes, and alpha.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform glow-purple">
                  <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                </div>
                <div className="text-sm mt-2 text-gray-400 group-hover:text-white transition-colors">Telegram</div>
              </a>

              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform glow-purple">
                  <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div className="text-sm mt-2 text-gray-400 group-hover:text-white transition-colors">X (Twitter)</div>
              </a>

              <a
                href="https://sepolia.etherscan.io/token/0x8567c833e77565551b82c78f282d424fb8f80f66?a=0x3bdb2EC7e9E4Ea967eeEdAF0aF6D883CbCABdc02"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center text-2xl font-black hover:scale-110 transition-transform glow-blue">
                  Eth
                </div>
                <div className="text-sm mt-2 text-gray-400 group-hover:text-white transition-colors">EtherScan</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl">
                  😎
                </div>
                <span className="font-black text-xl">
                  <span className="text-white">Skibidi</span>
                  <span className="gradient-text">Rizz</span>
                </span>
              </div>
              <p className="text-sm text-gray-500">
                The Ultimate Rizz in DeFi. Fair launched meme token on Sepolia testnet.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#tokenomics" className="hover:text-white transition-colors">Tokenomics</a></li>
                <li><a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
                <li><a href="https://sepolia.etherscan.io/token/0x8567c833e77565551b82c78f282d424fb8f80f66?a=0x3bdb2EC7e9E4Ea967eeEdAF0aF6D883CbCABdc02" target="_blank" className="hover:text-white transition-colors">View on Etherscan</a></li>
              </ul>
            </div>

            {/* Contract */}
            <div>
              <h3 className="font-bold text-white mb-4">Contract Address</h3>
              <div className="text-xs font-mono bg-black/50 p-3 rounded-lg border border-white/5 break-all text-gray-400">
                {process.env.NEXT_PUBLIC_AIRDROP_ADDRESS || '0x...'}
              </div>
              <p className="text-xs text-gray-500 mt-2">Always verify contract before interacting</p>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 SkibidiRizz Token. All rights reserved.</p>
            <p className="text-xs">
              <span className="text-yellow-500">⚠️</span> Disclaimer: This is a meme coin with no intrinsic value. Invest at your own risk.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
