"use client";

export default function TokenomicsChart() {
    const data = [
        { label: "40% Community Airdrop", value: 40, color: "from-lime-400 to-green-500", glow: "0 0 30px rgba(0,255,136,0.5)" },
        { label: "40% Liquidity Pool", value: 40, color: "from-purple-400 to-purple-600", glow: "0 0 30px rgba(168,85,247,0.5)" },
        { label: "10% Marketing & Scaling", value: 10, color: "from-pink-400 to-pink-600", glow: "0 0 30px rgba(255,0,110,0.5)" },
        { label: "10% Team & Development", value: 10, color: "from-cyan-400 to-blue-500", glow: "0 0 30px rgba(0,245,255,0.5)" },
    ];

    // Simple donut segments (SVG-based)
    let cumulativePercent = 0;

    const getCoordinates = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="card-dark p-8">
            <h2 className="text-3xl font-black mb-8 text-center">
                <span className="gradient-text">Tokenomics</span>
            </h2>

            <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Chart */}
                <div className="relative w-64 h-64 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {data.map((item, idx) => {
                            const [startX, startY] = getCoordinates(cumulativePercent);
                            cumulativePercent += item.value / 100;
                            const [endX, endY] = getCoordinates(cumulativePercent);
                            const largeArcFlag = item.value > 50 ? 1 : 0;

                            const pathData = [
                                `M ${startX * 40 + 50} ${startY * 40 + 50}`,
                                `A 40 40 0 ${largeArcFlag} 1 ${endX * 40 + 50} ${endY * 40 + 50}`,
                                `L 50 50`,
                            ].join(' ');

                            return (
                                <path
                                    key={idx}
                                    d={pathData}
                                    className={`fill-current bg-gradient-to-br ${item.color}`}
                                    style={{
                                        fill: `url(#gradient-${idx})`,
                                        filter: `drop-shadow(${item.glow})`
                                    }}
                                />
                            );
                        })}

                        {/* Gradients */}
                        <defs>
                            {data.map((item, idx) => (
                                <linearGradient key={idx} id={`gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={
                                        idx === 0 ? "#84cc16" :
                                            idx === 1 ? "#a855f7" :
                                                idx === 2 ? "#ff006e" : "#00f5ff"
                                    } />
                                    <stop offset="100%" stopColor={
                                        idx === 0 ? "#10b981" :
                                            idx === 1 ? "#7c3aed" :
                                                idx === 2 ? "#c026d3" : "#3b82f6"
                                    } />
                                </linearGradient>
                            ))}
                        </defs>

                        {/* Center Hole */}
                        <circle cx="50" cy="50" r="20" fill="var(--bg-primary)" />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-black gradient-text">1M</div>
                            <div className="text-xs text-gray-500">Total Supply</div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4">
                    {data.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 group hover:scale-105 transition-transform cursor-pointer">
                            <div
                                className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color}`}
                                style={{ boxShadow: item.glow }}
                            />
                            <div className="flex-1">
                                <div className="font-bold text-white group-hover:gradient-text transition-all">{item.label}</div>
                                <div className="text-sm text-gray-400">{item.value}% of supply</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contract Info */}
            <div className="mt-8 p-4 bg-black/30 rounded-xl border border-white/5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs text-gray-500">Contract:</div>
                    <code className="text-xs font-mono text-gray-300 bg-black/50 px-3 py-1 rounded">
                        {process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0x..."}
                    </code>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400">Verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
