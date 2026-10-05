'use client';

import { useFormState } from 'react-dom';
import { createPaymentAction, updatePaymentAction, type FormState } from '@/lib/actions/payments';
import SubmitButton from './SubmitButton';

type PaymentData = {
  id: string; provider: string; accountName: string; accountNumber: string;
  isActive: boolean; displayOrder: number;
};

const initial: FormState = {};

export default function PaymentForm({ account }: { account?: PaymentData }) {
  const action = account ? updatePaymentAction : createPaymentAction;
  const [state, formAction] = useFormState(action, initial);
  return (
    <form action={formAction} className="form-grid">
      {state.error && <div className="alert alert--error" role="alert">{state.error}</div>}
      {state.success && <div className="alert alert--success" role="status">{state.success}</div>}
      {account && <input type="hidden" name="id" value={account.id} />}
      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="provider">Provider</label>
          <input id="provider" name="provider" type="text" required maxLength={60}
            defaultValue={account?.provider} placeholder="e.g. MONIEPOINT, OPAY" />
        </div>
        <div className="field">
          <label htmlFor="accountNumber">Account Number</label>
          <input id="accountNumber" name="accountNumber" type="text" required inputMode="numeric"
            pattern="[0-9]{6,20}" defaultValue={account?.accountNumber} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="accountName">Account Name</label>
        <input id="accountName" name="accountName" type="text" required maxLength={120}
          defaultValue={account?.accountName} />
      </div>
      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="displayOrder">Display Order</label>
          <input id="displayOrder" name="displayOrder" type="number" min={0} max={999}
            defaultValue={account?.displayOrder ?? 0} />
        </div>
        <div className="field" style={{ justifyContent: 'end' }}>
          <label className="checkbox-row" style={{ marginTop: '1.6rem' }}>
            <input type="checkbox" name="isActive" defaultChecked={account?.isActive ?? true} />
            Active (shown on website)
          </label>
        </div>
      </div>
      <div className="form-actions">
        <SubmitButton label={account ? 'Update Account' : 'Add Account'} />
      </div>
    </form>
  );
}
