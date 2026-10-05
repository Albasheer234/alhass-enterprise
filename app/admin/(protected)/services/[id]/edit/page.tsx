import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ServiceForm from '@/components/admin/ServiceForm';

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) notFound();
  return (
    <>
      <h1 className="admin-page-title">Edit Service</h1>
      <div className="panel"><div className="panel__body"><ServiceForm service={service} /></div></div>
    </>
  );
}
