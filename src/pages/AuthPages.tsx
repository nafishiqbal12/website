import { Bot, CloudCog, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { PageShell } from '../components/shells';
import { Alert, Button, Card, Container, TextField } from '../components/ui';
import { useAuth } from '../lib/auth/useAuth';
import { getCurrentProfile, updateCurrentProfile, type UserProfile } from '../lib/auth/profile';

type AuthPageProps = { onNavigate: (target: string) => void };

type AuthFrameProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function AuthFrame({ title, description, children }: AuthFrameProps) {
  return (
    <PageShell className="min-h-[calc(100vh-4rem)]">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,500px)] lg:items-stretch">
          <AuthBrandPanel />
          <Card className="order-first flex flex-col justify-center border-slate-700/80 bg-slate-900/90 p-6 sm:p-8 lg:order-last">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100">{title}</h1>
            <p className="mt-3 text-slate-300">{description}</p>
            <div className="mt-7">{children}</div>
          </Card>
        </div>
      </Container>
    </PageShell>
  );
}

function BrandMark() {
  return (
    <div className="h-11 w-11 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="authLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
            <stop offset="100%" style={{ stopColor: '#06B6D4' }} />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#authLogoGrad)" />
        <path d="M 60 80 Q 100 60, 140 80 M 60 100 Q 100 80, 140 100 M 60 120 Q 100 100, 140 120" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
        <g fill="white">
          <circle cx="50" cy="80" r="5" /><circle cx="150" cy="80" r="5" />
          <circle cx="50" cy="100" r="5" /><circle cx="150" cy="100" r="5" />
          <circle cx="50" cy="120" r="5" /><circle cx="150" cy="120" r="5" />
        </g>
      </svg>
    </div>
  );
}

function AuthBrandPanel() {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-7 shadow-[0_20px_70px_rgba(2,6,23,0.32)] sm:p-10 lg:p-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.8),rgba(8,47,73,0.35))]" />
      <div className="absolute right-8 top-8 -z-10 h-32 w-32 rounded-full border border-cyan-300/20" />
      <div className="absolute right-16 top-16 -z-10 h-16 w-16 rounded-full border border-blue-300/20" />
      <div className="flex items-center gap-3">
        <BrandMark />
        <div>
          <p className="text-xl font-bold tracking-tight text-slate-50">BlockWaveLab</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Infrastructure, automated</p>
        </div>
      </div>
      <div className="mt-16 max-w-xl lg:mt-24">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200"><Sparkles size={16} aria-hidden="true" /> Web3 delivery workspace</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">Start building with BlockWaveLab.</h2>
        <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">AI Automation &amp; DevOps Partner for Web3 Projects.</p>
        <p className="mt-3 max-w-lg text-slate-400">Start your 3-day free trial and explore the platform.</p>
      </div>
      <div className="mt-16 grid max-w-xl gap-3 sm:grid-cols-3 lg:mt-24">
        <div className="rounded-xl border border-slate-700/80 bg-slate-950/30 p-4"><CloudCog size={18} className="text-cyan-300" aria-hidden="true" /><p className="mt-3 text-xs font-semibold tracking-[0.16em] text-slate-300">BUILD</p></div>
        <div className="rounded-xl border border-slate-700/80 bg-slate-950/30 p-4"><Bot size={18} className="text-cyan-300" aria-hidden="true" /><p className="mt-3 text-xs font-semibold tracking-[0.16em] text-slate-300">AUTOMATE</p></div>
        <div className="rounded-xl border border-slate-700/80 bg-slate-950/30 p-4"><ShieldCheck size={18} className="text-cyan-300" aria-hidden="true" /><p className="mt-3 text-xs font-semibold tracking-[0.16em] text-slate-300">OPERATE + GROW</p></div>
      </div>
    </section>
  );
}

function ConfigurationNotice() {
  return (
    <Alert title="Authentication is not configured" tone="warning">
      This environment does not have the required Supabase browser configuration. No credentials are embedded in the application.
    </Alert>
  );
}

function AuthError({ message }: { message: string | null }) {
  return message ? <Alert title="Authentication request failed" tone="danger">{message}</Alert> : null;
}

function validateCredentials(email: string, password: string) {
  if (!email.trim() || !email.includes('@')) return 'Enter a valid email address.';
  if (password.length < 8) return 'Password must contain at least 8 characters.';
  return null;
}

export function LoginPage({ onNavigate }: AuthPageProps) {
  const { signIn, isConfigured, user, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) onNavigate('/dashboard');
  }, [isLoading, onNavigate, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateCredentials(email, password);
    if (validationError) return setError(validationError);
    setError(null);
    setIsSubmitting(true);
    const result = await signIn(email.trim(), password);
    setIsSubmitting(false);
    if (result.error) return setError(result.error.message);
    onNavigate('/dashboard');
  };

  return (
    <AuthFrame title="Log in to BlockWaveLab" description="Continue managing your Web3 project with AI automation and DevOps support.">
      {!isConfigured ? <ConfigurationNotice /> : null}
      <form className="space-y-4" onSubmit={submit} noValidate>
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <AuthError message={error} />
        <Button type="submit" full disabled={isSubmitting || !isConfigured}>{isSubmitting ? 'Signing in…' : 'Log in'}</Button>
      </form>
      <div className="mt-5 flex flex-wrap gap-4 text-sm">
        <button className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/forgot-password')}>Forgot password?</button>
        <span className="text-slate-400">New to BlockWaveLab? <button className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/signup')}>Start your 3-day free trial</button></span>
      </div>
    </AuthFrame>
  );
}

export function SignupPage({ onNavigate }: AuthPageProps) {
  const { signUp, isConfigured, user, isLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) onNavigate('/dashboard');
  }, [isLoading, onNavigate, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return setError('Enter your first and last name.');
    const validationError = validateCredentials(email, password);
    if (validationError) return setError(validationError);
    if (password !== confirmation) return setError('Passwords do not match.');
    setError(null);
    setIsSubmitting(true);
    const result = await signUp(email.trim(), password);
    setIsSubmitting(false);
    if (result.error) return setError(result.error.message);
    setSuccess(true);
  };

  return (
    <AuthFrame title="Create your BlockWaveLab account" description="Start your 3-day free trial and explore the platform.">
      {!isConfigured ? <ConfigurationNotice /> : null}
      {success ? (
        <Alert title="Check your email" tone="success">If email verification is enabled, follow the provider link before signing in.</Alert>
      ) : (
        <form className="space-y-4" onSubmit={submit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="First Name" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            <TextField label="Last Name" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </div>
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <TextField label="Password" type="password" autoComplete="new-password" hint="Use at least 8 characters." value={password} onChange={(event) => setPassword(event.target.value)} />
          <TextField label="Confirm Password" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
          <AuthError message={error} />
          <Button type="submit" full disabled={isSubmitting || !isConfigured}>{isSubmitting ? 'Creating account…' : 'Start Free Trial'}</Button>
        </form>
      )}
      <p className="mt-5 text-sm text-slate-400">Already have an account? <button className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/login')}>Log in</button></p>
    </AuthFrame>
  );
}

export function ForgotPasswordPage({ onNavigate }: AuthPageProps) {
  const { requestPasswordReset, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !email.includes('@')) return setError('Enter a valid email address.');
    setError(null);
    setIsSubmitting(true);
    const result = await requestPasswordReset(email.trim());
    setIsSubmitting(false);
    if (result.error) return setError(result.error.message);
    setMessage('If an account matches this email, a password reset link will be sent.');
  };

  return (
    <AuthFrame title="Reset your password" description="Request a secure password reset link. The application does not reveal whether an account exists.">
      {!isConfigured ? <ConfigurationNotice /> : null}
      <form className="space-y-4" onSubmit={submit} noValidate>
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        {message ? <Alert title="Request received" tone="success">{message}</Alert> : null}
        <AuthError message={error} />
        <Button type="submit" full disabled={isSubmitting || !isConfigured}>{isSubmitting ? 'Sending…' : 'Send reset link'}</Button>
      </form>
      <button className="bw-focus mt-5 rounded text-sm text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/login')}>Back to sign in</button>
    </AuthFrame>
  );
}

export function ResetPasswordPage({ onNavigate }: AuthPageProps) {
  const { updatePassword, recoveryMode, isConfigured } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return setError('Password must contain at least 8 characters.');
    if (password !== confirmation) return setError('Passwords do not match.');
    setError(null);
    setIsSubmitting(true);
    const result = await updatePassword(password);
    setIsSubmitting(false);
    if (result.error) return setError(result.error.message);
    setSuccess(true);
  };

  return (
    <AuthFrame title="Set a new password" description="Use the secure recovery link from your email to update your password.">
      {!isConfigured ? <ConfigurationNotice /> : null}
      {!recoveryMode && isConfigured ? <Alert title="Recovery link required" tone="warning">Open this page from a valid password recovery email.</Alert> : null}
      {success ? <Alert title="Password updated" tone="success">Your password was updated. You can now sign in.</Alert> : null}
      <form className="mt-4 space-y-4" onSubmit={submit} noValidate>
        <TextField label="New password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <TextField label="Confirm password" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        <AuthError message={error} />
        <Button type="submit" full disabled={isSubmitting || !isConfigured || !recoveryMode}>{isSubmitting ? 'Updating…' : 'Update password'}</Button>
      </form>
      <button className="bw-focus mt-5 rounded text-sm text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/login')}>Back to sign in</button>
    </AuthFrame>
  );
}

export function ProfilePage({ onNavigate }: AuthPageProps) {
  const { user, isLoading, isConfigured, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [locale, setLocale] = useState(navigator.language);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) onNavigate('/login');
  }, [isLoading, onNavigate, user]);

  useEffect(() => {
    if (!user) return;
    void getCurrentProfile(user.id).then((result) => {
      if (result.error) return setError(result.error.message);
      setProfile(result.profile);
      setDisplayName(result.profile?.displayName ?? '');
      setTimezone((currentTimezone) => result.profile?.timezone ?? currentTimezone);
      setLocale((currentLocale) => result.profile?.locale ?? currentLocale);
    });
  }, [user]);

  if (isLoading || !user) {
    return <PageShell><Container narrow><p className="text-center text-slate-300">Loading profile…</p></Container></PageShell>;
  }

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);
    const result = await updateCurrentProfile(user.id, { displayName: displayName.trim() || null, timezone: timezone.trim() || null, locale: locale.trim() || null });
    setIsSaving(false);
    if (result.error) return setError(result.error.message);
    setProfile(result.profile);
    setMessage('Profile updated.');
  };

  const logout = async () => {
    const result = await signOut();
    if (result.error) return setError(result.error.message);
    onNavigate('/');
  };

  return (
    <PageShell>
      <Container narrow>
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">Your identity profile</h1>
              <p className="mt-2 text-sm text-slate-300">{user.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
          </div>
          {!isConfigured ? <div className="mt-6"><ConfigurationNotice /></div> : null}
          <form className="mt-7 space-y-4" onSubmit={save}>
            <TextField label="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            <TextField label="Timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} />
            <TextField label="Locale" value={locale} onChange={(event) => setLocale(event.target.value)} />
            {profile ? <p className="text-xs text-slate-400">Profile created {new Date(profile.createdAt).toLocaleDateString()}.</p> : null}
            {message ? <Alert title="Saved" tone="success">{message}</Alert> : null}
            <AuthError message={error} />
            <Button type="submit" disabled={isSaving || !isConfigured}>{isSaving ? 'Saving…' : 'Save profile'}</Button>
          </form>
        </Card>
      </Container>
    </PageShell>
  );
}
