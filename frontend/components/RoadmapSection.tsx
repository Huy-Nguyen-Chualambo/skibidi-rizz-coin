"use client";

export default function RoadmapSection() {
    const phases = [
        {
            phase: "Phase 1",
            title: "Foundation",
            status: "completed",
            items: ["Smart Contract Deployment", "Website & Socials Launch", "V1 Task System Ready"]
        },
        {
            phase: "Phase 2",
            title: "Community Growth",
            status: "active",
            items: ["Airdrop Distribution", "Decentralized Exchange Listing", "Growing our Community"]
        },
        {
            phase: "Phase 3",
            title: "DeFi ecosystem & Utility",
            status: "upcoming",
            items: [
                "The Sigma Vault (Staking Protocol v1)",
                "Liquidity Pool Optimization (DEX)",
                "Governance (DAO) Framework Initiation",
                "Expansion of Task-to-Earn use cases"
            ]
        },
    ];

    return (
        <div className="card-dark p-8">
            <h2 className="text-3xl font-black mb-2 text-center">
                <span className="gradient-text">Roadmap</span>
            </h2>
            <p className="text-center text-gray-400 mb-12">Step by step, building with the community</p>

            {/* Timeline */}
            <div className="relative">
                {/* Center Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-lime-500 via-purple-500 to-pink-500 opacity-30"></div>

                {/* Phases */}
                <div className="space-y-12">
                    {phases.map((phase, idx) => (
                        <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                            {/* Content */}
                            <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                <div className="card-elevated p-6 group hover:scale-105 transition-transform">
                                    <div className="flex items-center gap-3 mb-3" style={{ justifyContent: idx % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                                        <span className="text-sm font-bold text-purple-400">{phase.phase}</span>
                                        {phase.status === 'completed' && (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">✓ Done</span>
                                        )}
                                        {phase.status === 'active' && (
                                            <span className="px-2 py-1 bg-lime-500/20 text-lime-400 text-xs rounded-full border border-lime-500/30 animate-pulse">⚡ Active</span>
                                        )}
                                        {phase.status === 'upcoming' && (
                                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30">⏳ Soon</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-4 group-hover:gradient-text transition-all">{phase.title}</h3>
                                    <ul className="space-y-2">
                                        {phase.items.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-400 flex items-center gap-2" style={{ justifyContent: idx % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                                                <span className={idx % 2 === 0 ? 'order-2' : ''}>•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Center Dot */}
                            <div className={`relative flex-shrink-0 w-6 h-6 rounded-full border-4 z-10 ${phase.status === 'completed' ? 'bg-green-500 border-green-500 glow-lime' :
                                phase.status === 'active' ? 'bg-lime-500 border-lime-500 glow-lime animate-pulse-glow' :
                                    'bg-gray-700 border-gray-700'
                                }`}>
                                {phase.status === 'active' && (
                                    <div className="absolute inset-0 rounded-full bg-lime-500 animate-ping opacity-75"></div>
                                )}
                            </div>

                            {/* Spacer */}
                            <div className="flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
