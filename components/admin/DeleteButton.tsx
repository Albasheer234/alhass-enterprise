'use client';

import { useFormStatus } from 'react-dom';

export default function DeleteButton({
  action,
  id,
  confirmMessage = 'Are you sure you want to delete this item? This cannot be undone.',
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
      style={{ display: 'inline' }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn--danger btn--sm" disabled={pending} aria-disabled={pending}>
        {pending ? 'Deleting…' : 'Delete'}
      </button>
    </form>
  );
}
