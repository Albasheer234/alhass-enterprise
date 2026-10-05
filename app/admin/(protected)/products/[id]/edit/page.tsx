import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <h1 className="admin-page-title">Edit Product</h1>
      <div className="panel"><div className="panel__body">
        <ProductForm categories={categories} product={product} />
      </div></div>
    </>
  );
}
