import { Link } from '../components/ui';

type PaymentResultProps = {
  kind: 'success' | 'cancel';
};

export default function PaymentResult({ kind }: PaymentResultProps) {
  const checkoutId = new URLSearchParams(window.location.search).get('checkout_id');
  const isSuccessRedirect = kind === 'success';

  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Payment</p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-50">
        {isSuccessRedirect ? 'Payment submitted' : 'Payment cancelled'}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-400">
        {isSuccessRedirect
          ? 'The provider redirect was received. Payment status is confirmed only after the trusted webhook reconciliation completes.'
          : 'No payment settlement was created. You can return to the authenticated workspace and retry when ready.'}
      </p>
      {checkoutId ? <p className="mt-6 text-xs text-slate-500">Checkout reference: {checkoutId}</p> : null}
      <Link className="mt-8 inline-flex" href={isSuccessRedirect ? '/dashboard' : '/dashboard'}>
        Return to dashboard
      </Link>
    </section>
  );
}
