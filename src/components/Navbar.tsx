import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onConnect?: () => void;
}

export default function Navbar({ onConnect }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="bg-cyber-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative w-10 h-10 transform group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#06b6d4' }} />
                      <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="95" fill="url(#navLogoGrad)" />
                  <g>
                    <path d="M 60 80 Q 100 60, 140 80" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M 60 100 Q 100 80, 140 100" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M 60 120 Q 100 100, 140 120" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Web3Hub
              </span>
            </div>

            {/* Center Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-400 hover:text-neon-cyan transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Connect Button - Desktop */}
            <div className="hidden md:flex">
              <button
                onClick={onConnect}
                className="relative px-6 py-2 rounded-lg font-semibold overflow-hidden group"
              >
                {/* Gradient Border Background */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-0.5">
                  <div className="absolute inset-0.5 rounded-lg bg-cyber-black"></div>
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3), transparent 70%)',
                  filter: 'blur(10px)',
                  zIndex: -1,
                }}></div>

                {/* Text */}
                <span className="relative z-10 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent group-hover:text-white transition-all duration-300">
                  Connect Wallet
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-400 hover:text-neon-cyan transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden pb-4 border-t border-white/5">
              <div className="flex flex-col space-y-3 pt-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-slate-400 hover:text-neon-cyan transition-colors duration-200 text-sm font-medium px-2 py-2"
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    onConnect?.();
                    setIsOpen(false);
                  }}
                  className="relative px-4 py-2 rounded-lg font-semibold overflow-hidden group w-full text-left"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-0.5">
                    <div className="absolute inset-0.5 rounded-lg bg-cyber-black"></div>
                  </div>
                  <span className="relative z-10 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                    Connect Wallet
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
