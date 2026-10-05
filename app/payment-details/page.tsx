'use client';

import { useEffect, useState } from 'react';

type Account = {
  id: string;
  provider: string;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
  displayOrder: number;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn btn--navy btn--sm payment-card__copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? 'Copied!' : 'Copy Account Number'}
    </button>
  );
}

export default function PaymentDetailsPage() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  useEffect(() => {
    fetch('/api/payment-accounts')
      .then((r) => (r.ok ? r.json() : []))
      .then(setAccounts)
      .catch(() => setAccounts([]));
  }, []);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <h1 className="section-title">Payment Details</h1>
        <p className="section-subtitle">
          These are our official bank accounts for transfers. Always confirm your order with us on
          WhatsApp before making payment.
        </p>

        <div className="notice" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          <span><strong>Please verify the account name before making payment.</strong> If anything looks different from what you expected, contact us on WhatsApp first.</span>
        </div>

        {accounts === null ? (
          <p className="text-center" style={{ color: 'var(--gray-500)' }}>Loading payment details…</p>
        ) : accounts.length === 0 ? (
          <div className="empty-state"><p>Payment details will be published here soon.</p></div>
        ) : (
          <div className="grid" style={{ gap: '1.25rem' }}>
            {accounts.map((a) => (
              <div key={a.id} className="payment-card">
                <div className="payment-card__provider">{a.provider}</div>
                <div className="payment-card__number">{a.accountNumber}</div>
                <div className="payment-card__name">Account Name: <strong>{a.accountName}</strong></div>
                <CopyButton text={a.accountNumber} />
              </div>
            ))}
          </div>
        )}

        <p className="text-center mt-4" style={{ color: 'var(--gray-500)', fontSize: '0.92rem' }}>
          After making a transfer, please send your payment confirmation to us on WhatsApp so we
          can process your order quickly.
        </p>
      </div>
    </section>
  );
}
