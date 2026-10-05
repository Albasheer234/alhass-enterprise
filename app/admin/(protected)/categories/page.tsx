import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteCategoryAction } from '@/lib/actions/categories';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <>
      <h1 className="admin-page-title">
        Categories
        <Link href="/admin/categories/new" className="btn btn--navy btn--sm">+ Add Category</Link>
      </h1>
      <div className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Order</th><th>Name</th><th>Products</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.displayOrder}</td>
                  <td><strong>{c.name}</strong><br /><span style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>/{c.slug}</span></td>
                  <td>{c._count.products}</td>
                  <td><span className={`badge ${c.isActive ? 'badge--green' : 'badge--gray'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link href={`/admin/categories/${c.id}/edit`} className="btn btn--navy btn--sm">Edit</Link>{' '}
                    <DeleteButton action={deleteCategoryAction} id={c.id}
                      confirmMessage={`Delete category "${c.name}"?`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
