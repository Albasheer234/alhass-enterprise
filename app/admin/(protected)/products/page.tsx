import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { deleteProductAction } from '@/lib/actions/products';
import DeleteButton from '@/components/admin/DeleteButton';

const PLACEHOLDER = '/images/product-placeholder.svg';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <h1 className="admin-page-title">
        Products
        <Link href="/admin/products/new" className="btn btn--navy btn--sm">+ Add Product</Link>
      </h1>
      <div className="panel">
        <div className="table-wrap">
          {products.length === 0 ? (
            <div className="panel__body"><p style={{ color: 'var(--gray-500)', margin: 0 }}>No products yet. Create your first product.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Category</th><th>Status</th><th>Featured</th><th>Created</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td><img className="thumb" src={p.imageUrl ?? PLACEHOLDER} alt={p.name} width={52} height={40} /></td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category.name}</td>
                    <td>
                      <span className={`badge ${p.isPublished ? 'badge--green' : 'badge--gray'}`}>
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{p.isFeatured ? <span className="badge badge--gold">Featured</span> : '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(p.createdAt)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link href={`/admin/products/${p.id}/edit`} className="btn btn--navy btn--sm">Edit</Link>{' '}
                      <DeleteButton action={deleteProductAction} id={p.id}
                        confirmMessage={`Delete "${p.name}" permanently?`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
