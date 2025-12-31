"use client";

import ConnectButton from "./ConnectButton";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6">
            {/* Particle Background */}
            <div className="particle-bg"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                {/* Left: Text */}
                <div className="flex-1 text-center lg:text-left space-y-8">
                    <div className="inline-block">
                        <span className="px-4 py-2 bg-lime-500/10 border border-lime-500/30 rounded-full text-lime-400 text-sm font-bold animate-pulse-glow">
                            🚀 Fair Launch Active
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
                        <span className="text-white">Skibidi</span>
                        <span className="gradient-text">Rizz</span>
                        <br />
                        <span className="text-4xl md:text-5xl lg:text-6xl gradient-text-pink">Token</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-xl">
                        <span className="font-bold text-white">The Ultimate Rizz in DeFi.</span> <br />
                        Claim Your Airdrop & Join the Sigma Revolution.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <ConnectButton />
                        <a href="#tokenomics" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full font-bold transition-all text-center">
                            View Tokenomics
                        </a>
                    </div>

                    {/* Quick Stats 
                    <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-6">
                        <div>
                            <div className="text-3xl font-black gradient-text">420,690,000</div>
                            <div className="text-sm text-gray-500">Total Claimed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black gradient-text">12,500+</div>
                            <div className="text-sm text-gray-500">Holders</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black gradient-text-pink">$500K+</div>
                            <div className="text-sm text-gray-500">Liquidity Locked</div>
                        </div>
                    </div>*/}
                </div>

                {/* Right: Character */}
                <div className="flex-1 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-md aspect-square">
                        {/* Placeholder for Character Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl animate-pulse-glow"></div>
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Replace this with actual character image */}
                            <div className="w-80 h-80 bg-gradient-to-br from-purple-600 via-pink-600 to-lime-500 rounded-full opacity-20 animate-float"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-8xl animate-float" style={{ animationDelay: '1s' }}>😎</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center">
                            <div className="px-6 py-2 bg-black/80 backdrop-blur border border-white/10 rounded-full">
                                <span className="font-bold gradient-text">Rizzler</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/20 rounded-full p-1">
                    <div className="w-1 h-3 bg-lime-500 rounded-full mx-auto animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}
