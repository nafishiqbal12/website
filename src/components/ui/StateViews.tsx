import { Card } from './Card';

export function LoadingState({ label = 'Loading content…' }: { label?: string }) {
  return (
    <Card>
      <div className="animate-pulse space-y-3" aria-live="polite" aria-busy="true">
        <div className="h-3 w-28 rounded bg-slate-700" />
        <div className="h-6 w-2/3 rounded bg-slate-700" />
        <div className="h-4 w-full rounded bg-slate-800" />
      </div>
      <p className="mt-4 text-sm text-slate-300">{label}</p>
    </Card>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{message}</p>
    </Card>
  );
}

export function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <Card className="border-rose-400/30 bg-rose-500/10">
      <h3 className="text-lg font-semibold text-rose-100">{title}</h3>
      <p className="mt-2 text-sm text-rose-100/80">{message}</p>
    </Card>
  );
}
