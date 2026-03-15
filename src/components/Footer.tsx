import { Twitter, Send, Mail, ArrowUp } from 'lucide-react';

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
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40"
        aria-label="Scroll to top of page"
      >
        <ArrowUp size={20} />
      </button>

      <footer className="bg-gray-900 text-white py-12" aria-label="Site footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <p className="text-gray-400 text-sm">
                Empowering Crypto Growth Through Influence
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm" role="list">
                <li role="listitem">
                  <button onClick={() => onNavigate('about')} className="hover:text-cyan-400 transition-colors">
                    About Us
                  </button>
                </li>
                <li role="listitem">
                  <button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors">
                    Services
                  </button>
                </li>
                <li role="listitem">
                  <button onClick={() => onNavigate('blog')} className="hover:text-cyan-400 transition-colors">
                    Blog
                  </button>
                </li>
                <li role="listitem">
                  <button onClick={() => onNavigate('cases')} className="hover:text-cyan-400 transition-colors">
                    Case Studies
                  </button>
                </li>
                <li role="listitem">
                  <button onClick={() => onNavigate('contact')} className="hover:text-cyan-400 transition-colors">
                    Contact
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
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-cyan-500 transition-colors"
                  aria-label="Telegram - Contact us on Telegram"
                  role="listitem"
                >
                  <Send size={20} />
                </a>
                <a
                  href="https://twitter.com/Blockwavelab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-cyan-500 transition-colors"
                  aria-label="Twitter - Follow us on Twitter"
                  role="listitem"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="mailto:hello@blockwavelab.com"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-cyan-500 transition-colors"
                  aria-label="Email - Send us a message"
                  role="listitem"
                >
                  <Mail size={20} />
                </a>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">
                  <Mail size={16} className="inline mr-2" aria-hidden="true" />
                  hello@blockwavelab.com
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {currentYear} BlockWave Lab - All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
