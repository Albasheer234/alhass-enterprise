'use client';

import { useFormState } from 'react-dom';
import { createCategoryAction, updateCategoryAction, type FormState } from '@/lib/actions/categories';
import SubmitButton from './SubmitButton';

type CategoryData = {
  id: string; name: string; description: string | null;
  isActive: boolean; displayOrder: number;
};

const initial: FormState = {};

export default function CategoryForm({ category }: { category?: CategoryData }) {
  const action = category ? updateCategoryAction : createCategoryAction;
  const [state, formAction] = useFormState(action, initial);
  return (
    <form action={formAction} className="form-grid">
      {state.error && <div className="alert alert--error" role="alert">{state.error}</div>}
      {state.success && <div className="alert alert--success" role="status">{state.success}</div>}
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="field">
        <label htmlFor="name">Category Name</label>
        <input id="name" name="name" type="text" required maxLength={80} defaultValue={category?.name} />
      </div>
      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" maxLength={500} defaultValue={category?.description ?? ''} />
      </div>
      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="displayOrder">Display Order</label>
          <input id="displayOrder" name="displayOrder" type="number" min={0} max={999}
            defaultValue={category?.displayOrder ?? 0} />
        </div>
        <div className="field" style={{ justifyContent: 'end' }}>
          <label className="checkbox-row" style={{ marginTop: '1.6rem' }}>
            <input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true} />
            Active
          </label>
        </div>
      </div>
      <div className="form-actions"><SubmitButton label={category ? 'Update Category' : 'Create Category'} /></div>
    </form>
  );
}
