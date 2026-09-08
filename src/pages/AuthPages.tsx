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
    <PageShell>
      <Container narrow>
        <Card className="mx-auto max-w-xl">
          <h1 className="text-3xl font-semibold text-slate-100">{title}</h1>
          <p className="mt-3 text-slate-300">{description}</p>
          <div className="mt-7">{children}</div>
        </Card>
      </Container>
    </PageShell>
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
    if (!isLoading && user) onNavigate('/profile');
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
    onNavigate('/profile');
  };

  return (
    <AuthFrame title="Sign in" description="Access your BlockWaveLab profile foundation.">
      {!isConfigured ? <ConfigurationNotice /> : null}
      <form className="space-y-4" onSubmit={submit} noValidate>
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <AuthError message={error} />
        <Button type="submit" full disabled={isSubmitting || !isConfigured}>{isSubmitting ? 'Signing in…' : 'Sign in'}</Button>
      </form>
      <div className="mt-5 flex flex-wrap gap-4 text-sm">
        <button className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/forgot-password')}>Forgot password?</button>
        <button className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/signup')}>Create an account</button>
      </div>
    </AuthFrame>
  );
}

export function SignupPage({ onNavigate }: AuthPageProps) {
  const { signUp, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateCredentials(email, password);
    if (validationError) return setError(validationError);
    setError(null);
    setIsSubmitting(true);
    const result = await signUp(email.trim(), password);
    setIsSubmitting(false);
    if (result.error) return setError(result.error.message);
    setSuccess(true);
  };

  return (
    <AuthFrame title="Create your account" description="Create an identity first. Organizations, projects, and roles will be added in later platform phases.">
      {!isConfigured ? <ConfigurationNotice /> : null}
      {success ? (
        <Alert title="Check your email" tone="success">If email verification is enabled, follow the provider link before signing in.</Alert>
      ) : (
        <form className="space-y-4" onSubmit={submit} noValidate>
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <TextField label="Password" type="password" autoComplete="new-password" hint="Use at least 8 characters." value={password} onChange={(event) => setPassword(event.target.value)} />
          <AuthError message={error} />
          <Button type="submit" full disabled={isSubmitting || !isConfigured}>{isSubmitting ? 'Creating account…' : 'Create account'}</Button>
        </form>
      )}
      <button className="bw-focus mt-5 rounded text-sm text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/login')}>Back to sign in</button>
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
