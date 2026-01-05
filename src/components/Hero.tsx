interface HeroProps {
  onStartGrowth?: () => void;
  onViewEcosystem?: () => void;
}

export default function Hero({ onStartGrowth, onViewEcosystem }: HeroProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Blob - Cyan */}
      <div
        className="absolute top-20 left-10 w-96 h-96 bg-neon-cyan rounded-full blur-3xl opacity-20 animate-blob"
        style={{
          filter: 'blur(120px)',
        }}
      />

      {/* Animated Blob - Purple */}
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple rounded-full blur-3xl opacity-20 animate-blob"
        style={{
          filter: 'blur(120px)',
          animationDelay: '2s',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          <span className="bg-gradient-to-r from-white to-neon-cyan bg-clip-text text-transparent">
            Scaling the Future of Web3
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The growth infrastructure for DeFi, Gaming, and L2s.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Start Growth Button - Solid Gradient */}
          <button
            onClick={onStartGrowth}
            className="relative px-8 py-4 rounded-lg font-semibold overflow-hidden group"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple"></div>

            {/* Glow Effect */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4), transparent 70%)',
                filter: 'blur(15px)',
                zIndex: -1,
              }}
            ></div>

            {/* Text */}
            <span className="relative z-10 text-white text-lg">
              Start Growth
            </span>
          </button>

          {/* View Ecosystem Button - Transparent Glass */}
          <button
            onClick={onViewEcosystem}
            className="relative px-8 py-4 rounded-lg font-semibold overflow-hidden group"
          >
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-0.5">
              <div className="absolute inset-0.5 rounded-lg bg-cyber-black/50 backdrop-blur-xl"></div>
            </div>

            {/* Static Border */}
            <div className="absolute inset-0 rounded-lg border border-white/20 group-hover:border-white/0 transition-colors duration-300"></div>

            {/* Glow Effect on Hover */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), transparent 70%)',
                filter: 'blur(15px)',
                zIndex: -1,
              }}
            ></div>

            {/* Text */}
            <span className="relative z-10 text-slate-300 group-hover:text-white transition-colors duration-300 text-lg">
              View Ecosystem
            </span>
          </button>
        </div>

        {/* Optional: Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-neon-cyan opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
