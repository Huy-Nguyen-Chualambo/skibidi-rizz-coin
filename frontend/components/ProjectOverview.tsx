"use client";

export default function ProjectOverview() {
    return (
        <div className="card-dark p-8 md:p-12 space-y-8">
            <div className="max-w-4xl mx-auto space-y-6 text-gray-300 leading-relaxed">
                <p className="text-xl font-medium text-white mb-8 border-l-4 border-lime-500 pl-6 italic">
                    "Skibidi Rizz is a combination of two popular meme concepts in modern Internet culture."
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-lime-500/30 transition-colors group">
                        <h3 className="text-2xl font-black gradient-text">Skibidi</h3>
                        <p className="text-sm">
                            Represents creative chaos, absurdity, and the highly viral nature of meme culture — content that may appear meaningless at first glance but is oddly addictive and attention-grabbing.
                        </p>
                    </div>

                    <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-colors group">
                        <h3 className="text-2xl font-black gradient-text-purple">Rizz</h3>
                        <p className="text-sm">
                            (Short for charisma) refers to natural charm, personal appeal, and the ability to connect with others and build community.
                        </p>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5">
                    <p>
                        When combined, <span className="text-white font-bold">Skibidi Rizz</span> can be understood as a form of unconventional yet captivating appeal — one that does not follow traditional norms, but instead reflects how the Internet and digital communities truly operate: freely, creatively, and through organic consensus and virality.
                    </p>
                </div>

                <div className="pt-6 border-t border-white/10">
                    <p>
                        Inspired by this spirit, <span className="gradient-text font-bold">SkibidiRizzToken (SRT)</span> is an ERC-20 token designed to bridge meme culture with blockchain technology. The token aims to function as a community-driven asset, where entertainment, virality, and the transparency of smart contracts coexist.
                    </p>
                </div>
            </div>
        </div>
    );
}
