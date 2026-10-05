'use client';

import { useFormState } from 'react-dom';
import { createServiceAction, updateServiceAction, type FormState } from '@/lib/actions/services';
import SubmitButton from './SubmitButton';

type ServiceData = {
  id: string; name: string; description: string; icon: string | null;
  isActive: boolean; displayOrder: number;
};

const initial: FormState = {};

export default function ServiceForm({ service }: { service?: ServiceData }) {
  const action = service ? updateServiceAction : createServiceAction;
  const [state, formAction] = useFormState(action, initial);
  return (
    <form action={formAction} className="form-grid">
      {state.error && <div className="alert alert--error" role="alert">{state.error}</div>}
      {state.success && <div className="alert alert--success" role="status">{state.success}</div>}
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="field">
        <label htmlFor="name">Service Name</label>
        <input id="name" name="name" type="text" required maxLength={80} defaultValue={service?.name} />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required maxLength={1000} defaultValue={service?.description} />
      </div>
      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="icon">Icon Key (optional)</label>
          <select id="icon" name="icon" defaultValue={service?.icon ?? 'store'}>
            <option value="store">Store</option>
            <option value="pos">POS</option>
            <option value="data">Data</option>
            <option value="home">Home</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="displayOrder">Display Order</label>
          <input id="displayOrder" name="displayOrder" type="number" min={0} max={999}
            defaultValue={service?.displayOrder ?? 0} />
        </div>
      </div>
      <label className="checkbox-row">
        <input type="checkbox" name="isActive" defaultChecked={service?.isActive ?? true} />
        Active (shown on website)
      </label>
      <div className="form-actions"><SubmitButton label={service ? 'Update Service' : 'Create Service'} /></div>
    </form>
  );
}
