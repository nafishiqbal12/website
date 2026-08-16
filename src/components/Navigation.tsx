import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button, Container, StatusIndicator } from './ui';
import { cn } from '../lib/cn';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'BUILD', path: 'build' },
    { name: 'AUTOMATE', path: 'automate' },
    { name: 'OPERATE', path: 'operate' },
    { name: 'GROW', path: 'grow' },
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-xl" aria-label="Primary navigation">
      <Container>
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigate('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('home')}
            aria-label="BlockWaveLab - Home"
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
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              BlockWave Lab
            </span>
            <span className="hidden lg:inline-flex">
              <StatusIndicator tone="online" label="v2 live" />
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-5">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  'bw-focus rounded-md px-2 py-1 text-sm font-medium transition-colors',
                  currentPage === item.path ? 'text-cyan-300' : 'text-slate-300 hover:text-cyan-300',
                )}
              >
                {item.name}
              </button>
            ))}
            <Button onClick={() => handleNavigate('build')} size="sm">Explore Pillars</Button>
          </div>

          <button
            className="bw-focus rounded-md p-1 text-slate-300 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {isOpen && (
        <div className="md:hidden border-t border-slate-700/60 bg-slate-950/95">
          <Container className="py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  'bw-focus block w-full rounded-lg px-4 py-2 text-left transition-colors',
                  currentPage === item.path
                    ? 'border border-cyan-400/30 bg-cyan-500/10 text-cyan-300'
                    : 'text-slate-300 hover:bg-slate-800/70',
                )}
              >
                {item.name}
              </button>
            ))}
            <Button full onClick={() => handleNavigate('build')}>Explore Pillars</Button>
          </Container>
        </div>
      )}
    </nav>
  );
}
