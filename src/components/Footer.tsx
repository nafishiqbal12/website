import { Twitter, Send, Mail, ArrowUp, ArrowRight } from 'lucide-react';
import { Button, Container } from './ui';
import { useAuth } from '../lib/auth/useAuth';

interface FooterProps {
  onNavigate: (target: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

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
        <Container className="py-14 lg:py-16">
          {!user ? <div className="mb-14 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] p-7 sm:p-9"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Ready to get started?</p><h2 className="mt-2 text-2xl font-semibold text-slate-50">Start your 3-day free trial.</h2></div><Button onClick={() => onNavigate('/signup')}>Start Free Trial <ArrowRight size={16} /></Button></div></div> : null}
          <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10"><svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true"><defs><linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: '#3B82F6' }} /><stop offset="100%" style={{ stopColor: '#06B6D4' }} /></linearGradient></defs><circle cx="100" cy="100" r="95" fill="url(#footerLogoGrad)" /><g><path d="M 60 80 Q 100 60, 140 80" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" /><path d="M 60 100 Q 100 80, 140 100" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" /><path d="M 60 120 Q 100 100, 140 120" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" /><circle cx="50" cy="80" r="5" fill="white" /><circle cx="150" cy="80" r="5" fill="white" /><circle cx="50" cy="100" r="5" fill="white" /><circle cx="150" cy="100" r="5" fill="white" /><circle cx="50" cy="120" r="5" fill="white" /><circle cx="150" cy="120" r="5" fill="white" /></g></svg></div><span className="text-xl font-bold text-slate-50">BlockWave Lab</span>
              </div>
              <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">AI Automation and DevOps Partner for Web3 Projects. Build reliable systems, automate practical workflows, and operate with clarity.</p>
              <div className="mt-6 flex gap-3" role="list" aria-label="Social links"><a href="https://t.me/Alex_TNH" target="_blank" rel="noopener noreferrer" className="bw-focus flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-colors hover:bg-cyan-400 hover:text-slate-950" aria-label="Telegram"><Send size={17} /></a><a href="https://twitter.com/Blockwavelab" target="_blank" rel="noopener noreferrer" className="bw-focus flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-colors hover:bg-cyan-400 hover:text-slate-950" aria-label="Twitter"><Twitter size={17} /></a><a href="mailto:hello@blockwavelab.com" className="bw-focus flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-colors hover:bg-cyan-400 hover:text-slate-950" aria-label="Email"><Mail size={17} /></a></div>
            </div>
            <FooterColumn title="BUILD" links={[['Cloud & DevOps Infrastructure', '/build'], ['Infrastructure Reliability & Security', '/build']]} onNavigate={onNavigate} />
            <FooterColumn title="AUTOMATE" links={[['Custom AI Agents', '/automate'], ['Community & Social Automation', '/automate'], ['DevOps & Monitoring Automation', '/automate']]} onNavigate={onNavigate} />
            <FooterColumn title="OPERATE" links={[['Managed DevOps Operations', '/operate'], ['Security & Performance Operations', '/operate']]} onNavigate={onNavigate} />
            <FooterColumn title="GROW" links={[['Content & Community Automation', '/grow'], ['Growth Analytics & SEO Support', '/grow'], ['Campaign & Content Distribution', '/grow']]} onNavigate={onNavigate} />
            <div><h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">PLATFORM</h3><ul className="mt-5 space-y-3 text-sm" role="list">{(user ? [['Dashboard', '/dashboard'], ['Profile', '/profile']] : [['Log in', '/login'], ['Start Free Trial', '/signup']]).map(([label, path]) => <li key={path}><button onClick={() => onNavigate(path)} className="bw-focus rounded text-left text-slate-300 transition-colors hover:text-cyan-300">{label}</button></li>)}</ul></div>
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>&copy; {currentYear} BlockWave Lab</p><div className="flex flex-wrap gap-5"><span>Privacy Policy</span><span>Terms</span><a href="mailto:hello@blockwavelab.com" className="bw-focus rounded transition-colors hover:text-cyan-300">Contact</a></div></div>
        </Container>
      </footer>
    </>
  );
}

function FooterColumn({ title, links, onNavigate }: { title: string; links: Array<[string, string]>; onNavigate: (target: string) => void }) {
  return <div><h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3><ul className="mt-5 space-y-3 text-sm" role="list">{links.map(([label, path]) => <li key={`${title}-${label}`}><button onClick={() => onNavigate(path)} className="bw-focus rounded text-left text-slate-300 transition-colors hover:text-cyan-300">{label}</button></li>)}</ul></div>;
}
