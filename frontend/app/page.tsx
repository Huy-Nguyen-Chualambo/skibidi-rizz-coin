import ConnectButton from "@/components/ConnectButton";
import AirdropStats from "@/components/AirdropStats";
import ClaimAirdrop from "@/components/ClaimAirdrop";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🚀</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SkibidiRizz
                </h1>
                <p className="text-xs text-gray-400">DeFi Airdrop Platform</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              SkibidiRizz
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            The Next Generation DeFi Ecosystem
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Claim your free SRT tokens and join the future of decentralized finance.
            Get rewarded for being an early adopter! 🎁
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="mb-12">
          <AirdropStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Claim Section */}
          <div>
            <ClaimAirdrop />
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Tokenomics */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                📊 Tokenomics
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Total Supply", value: "1,000,000 SRT", percent: "100%" },
                  { label: "Airdrop Allocation", value: "400,000 SRT", percent: "40%" },
                  { label: "Liquidity Pool", value: "200,000 SRT", percent: "20%" },
                  { label: "Team & Development", value: "200,000 SRT", percent: "20%" },
                  { label: "Community Rewards", value: "150,000 SRT", percent: "15%" },
                  { label: "Marketing", value: "50,000 SRT", percent: "5%" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-xl">
                    <span className="text-gray-300">{item.label}</span>
                    <div className="text-right">
                      <div className="text-white font-semibold">{item.value}</div>
                      <div className="text-xs text-gray-400">{item.percent}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                ⚡ Key Features
              </h2>
              <div className="space-y-3">
                {[
                  { icon: "🔒", title: "Secure Smart Contracts", desc: "Audited and battle-tested code" },
                  { icon: "⚡", title: "Gas Optimized", desc: "Low transaction fees with Merkle proofs" },
                  { icon: "🎯", title: "Fair Distribution", desc: "One claim per address, no bots" },
                  { icon: "🌐", title: "Multi-chain Ready", desc: "Expandable to other networks" },
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                    <span className="text-3xl">{feature.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-800">
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Discord
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Telegram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 SkibidiRizz. All rights reserved. | Built with ❤️ on Ethereum
          </p>
        </div>
      </div>
    </div>
  );
}
