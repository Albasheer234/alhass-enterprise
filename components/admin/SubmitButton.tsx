'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--navy" disabled={pending} aria-disabled={pending}>
      {pending ? (pendingLabel ?? 'Saving…') : label}
    </button>
  );
}
