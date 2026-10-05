import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category) notFound();
  return (
    <>
      <h1 className="admin-page-title">Edit Category</h1>
      <div className="panel"><div className="panel__body"><CategoryForm category={category} /></div></div>
    </>
  );
}
