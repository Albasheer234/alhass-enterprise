import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteServiceAction } from '@/lib/actions/services';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { displayOrder: 'asc' } });
  return (
    <>
      <h1 className="admin-page-title">
        Services
        <Link href="/admin/services/new" className="btn btn--navy btn--sm">+ Add Service</Link>
      </h1>
      <div className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Order</th><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.id}>
                  <td>{svc.displayOrder}</td>
                  <td><strong>{svc.name}</strong></td>
                  <td style={{ maxWidth: 380, color: 'var(--gray-500)' }}>{svc.description}</td>
                  <td><span className={`badge ${svc.isActive ? 'badge--green' : 'badge--gray'}`}>{svc.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link href={`/admin/services/${svc.id}/edit`} className="btn btn--navy btn--sm">Edit</Link>{' '}
                    <DeleteButton action={deleteServiceAction} id={svc.id}
                      confirmMessage={`Delete service "${svc.name}"?`} />
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
