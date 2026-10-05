'use client';

import { useFormState } from 'react-dom';
import {
  createProductAction,
  updateProductAction,
  type FormState,
} from '@/lib/actions/products';
import SubmitButton from './SubmitButton';

type CategoryOption = { id: string; name: string };
type ProductData = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
};

const initial: FormState = {};

export default function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ProductData;
}) {
  const action = product ? updateProductAction : createProductAction;
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="form-grid" encType="multipart/form-data">
      {state.error && <div className="alert alert--error" role="alert">{state.error}</div>}
      {state.success && <div className="alert alert--success" role="status">{state.success}</div>}
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="name">Product Name</label>
          <input id="name" name="name" type="text" required maxLength={120}
            defaultValue={product?.name} placeholder="e.g. Golden Penny Spaghetti" />
        </div>
        <div className="field">
          <label htmlFor="categoryId">Category</label>
          <select id="categoryId" name="categoryId" required defaultValue={product?.categoryId ?? ''}>
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required maxLength={2000}
          defaultValue={product?.description}
          placeholder="Describe the product — quality, use cases, pack size, etc. (no prices here)" />
      </div>

      <div className="field">
        <label htmlFor="image">Product Image</label>
        {product?.imageUrl && (
          <img src={product.imageUrl} alt="Current product" className="thumb" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8 }} />
        )}
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" />
        <span className="hint">
          {product
            ? 'Leave empty to keep the current image. JPG, PNG, WEBP, GIF or SVG — max 2MB. One image per product.'
            : 'Optional. JPG, PNG, WEBP, GIF or SVG — max 2MB. One image per product.'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <label className="checkbox-row">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} />
          Featured product
        </label>
        <label className="checkbox-row">
          <input type="checkbox" name="isPublished" defaultChecked={product?.isPublished ?? true} />
          Published (visible on website)
        </label>
      </div>

      <div className="form-actions">
        <SubmitButton label={product ? 'Update Product' : 'Create Product'} />
      </div>
    </form>
  );
}
