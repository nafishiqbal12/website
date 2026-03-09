import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'About', path: 'about' },
    { name: 'Services', path: 'services' },
    { name: 'Blog', path: 'blog' },
    { name: 'Case Studies', path: 'cases' },
    { name: 'Contact', path: 'contact' },
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 left-0 right-0 bg-gradient-to-b from-[#0B0E14]/95 to-[#0B0E14]/80 backdrop-blur-xl z-50 border-b border-white/5 shadow-2xl" aria-label="Primary navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigate('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('home')}
            aria-label="BlockWave Lab - Home"
          >
            <div className="relative w-10 h-10 transform group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
                    <stop offset="100%" style={{ stopColor: '#06B6D4' }} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#logoGrad)" />
                <g>
                  <path d="M 60 80 Q 100 60, 140 80" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <path d="M 60 100 Q 100 80, 140 100" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <path d="M 60 120 Q 100 100, 140 120" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <circle cx="50" cy="80" r="5" fill="white" />
                  <circle cx="150" cy="80" r="5" fill="white" />
                  <circle cx="50" cy="100" r="5" fill="white" />
                  <circle cx="150" cy="100" r="5" fill="white" />
                  <circle cx="50" cy="120" r="5" fill="white" />
                  <circle cx="150" cy="120" r="5" fill="white" />
                </g>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              BlockWave Lab
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.path
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => handleNavigate('contact')}
              className="relative px-6 py-2 rounded-lg font-medium overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur rounded-lg border border-white/20 group-hover:border-white/40 group-hover:bg-white/15 transition-all"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style={{
                backgroundImage: 'radial-gradient(circle at 0% 0%, #00D9FF 0%, transparent 50%)',
                filter: 'blur(8px)'
              }}></div>
              <span className="relative z-10 text-white">Get Started</span>
            </button>
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#0B0E14]/95 to-[#0B0E14]/90 border-t border-white/5">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.path
                    ? 'bg-white/10 text-cyan-400'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => handleNavigate('contact')}
              className="w-full relative px-6 py-2 rounded-lg font-medium overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur rounded-lg border border-white/20 group-hover:border-white/40 group-hover:bg-white/15 transition-all"></div>
              <span className="relative z-10 text-white">Get Started</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
