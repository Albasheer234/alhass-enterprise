import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true },
  });
  return (
    <>
      <h1 className="admin-page-title">Add Product</h1>
      <div className="panel"><div className="panel__body">
        <ProductForm categories={categories} />
      </div></div>
    </>
  );
}
