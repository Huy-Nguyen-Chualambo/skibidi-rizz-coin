"use client";

export default function HowToClaimSection() {
    const steps = [
        {
            icon: "🦊",
            title: "Verify Account",
            description: "Connect your wallet and sign a secure message to create your unique Rizz profile.",
            gradient: "from-lime-400 to-green-500"
        },
        {
            icon: "⚡",
            title: "Earn Points",
            description: "Complete simple tasks like visiting official links or following socials to earn reward points.",
            gradient: "from-purple-400 to-purple-600"
        },
        {
            icon: "💰",
            title: "Claim $SRT",
            description: "Turn your accumulated points into real SRT tokens and withdraw them directly to your wallet.",
            gradient: "from-pink-400 to-pink-600"
        },
    ];

    return (
        <div className="card-dark p-8">
            <h2 className="text-3xl font-black mb-2 text-center">
                <span className="gradient-text">How to Claim</span>
            </h2>
            <p className="text-center text-gray-400 mb-12">Get your $RIZZ in 3 simple steps</p>

            <div className="grid md:grid-cols-3 gap-6">
                {steps.map((step, idx) => (
                    <div key={idx} className="relative group">
                        {/* Card */}
                        <div className="card-elevated p-6 h-full flex flex-col items-center text-center space-y-4 hover:scale-105 transition-transform">
                            {/* Step Number */}
                            <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center font-black text-sm glow-purple">
                                {idx + 1}
                            </div>

                            {/* Icon */}
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-4xl glow-lime group-hover:scale-110 transition-transform`}>
                                {step.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-black text-white group-hover:gradient-text transition-all">
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-400 flex-1">
                                {step.description}
                            </p>
                        </div>

                        {/* Arrow (between cards, desktop only) */}
                        {idx < steps.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 -right-8 text-purple-500 text-3xl z-20">
                                →
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
