import { Twitter, Send, Mail, ArrowUp } from 'lucide-react';
import { Badge, Button, Container } from './ui';

interface FooterProps {
  onNavigate: (target: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 h-11 w-11 rounded-full p-0"
        aria-label="Scroll to top of page"
      >
        <ArrowUp size={20} />
      </Button>

      <footer className="border-t border-slate-800 bg-slate-950 text-white" aria-label="Site footer">
        <Container className="py-12 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
                        <stop offset="100%" style={{ stopColor: '#06B6D4' }} />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="95" fill="url(#footerLogoGrad)" />
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
                <span className="text-xl font-bold">BlockWave Lab</span>
              </div>
              <p className="text-slate-300 text-sm">
                AI Automation and DevOps Partner for Web3 Projects
              </p>
              <div className="mt-4">
                <Badge tone="info">Build • Automate • Operate • Grow</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-300 text-sm" role="list">
                <li role="listitem">
                  <button onClick={() => onNavigate('build')} className="bw-focus rounded-sm hover:text-cyan-300 transition-colors">
                    BUILD
                  </button>
                </li>
                <li role="listitem">
                  <button onClick={() => onNavigate('automate')} className="bw-focus rounded-sm hover:text-cyan-300 transition-colors">
                    AUTOMATE
                  </button>
                </li>
                <li role="listitem">
                  <button onClick={() => onNavigate('operate')} className="bw-focus rounded-sm hover:text-cyan-300 transition-colors">
                    OPERATE
                  </button>
                </li>
                <li role="listitem">
                  <button onClick={() => onNavigate('grow')} className="bw-focus rounded-sm hover:text-cyan-300 transition-colors">
                    GROW
                  </button>
                </li>
                <li role="listitem">
                  <button onClick={() => onNavigate('/blog')} className="bw-focus rounded-sm hover:text-cyan-300 transition-colors">
                    Blog
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4" role="list">
                <a
                  href="https://t.me/Alex_TNH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bw-focus flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 transition-colors hover:bg-cyan-500"
                  aria-label="Telegram - Contact us on Telegram"
                  role="listitem"
                >
                  <Send size={20} />
                </a>
                <a
                  href="https://twitter.com/Blockwavelab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bw-focus flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 transition-colors hover:bg-cyan-500"
                  aria-label="Twitter - Follow us on Twitter"
                  role="listitem"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="mailto:hello@blockwavelab.com"
                  className="bw-focus flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 transition-colors hover:bg-cyan-500"
                  aria-label="Email - Send us a message"
                  role="listitem"
                >
                  <Mail size={20} />
                </a>
              </div>
              <div className="mt-4">
                <p className="text-slate-300 text-sm">
                  <Mail size={16} className="inline mr-2" aria-hidden="true" />
                  hello@blockwavelab.com
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; {currentYear} BlockWave Lab - All Rights Reserved.</p>
          </div>
        </Container>
      </footer>
    </>
  );
}
