import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import ShopBrowser from '@/components/products/ShopBrowser';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse products from ALHASS Integrated Enterprise — provision store, POS services, data & airtime and household products. Order via WhatsApp.',
};

export default async function ShopPage() {
  const [s, categories, products] = await Promise.all([
    getSettings(),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Our Products</h1>
        <p className="section-subtitle">
          Browse our catalogue and order any product directly on WhatsApp — no account needed.
        </p>
        <ShopBrowser categories={categories} whatsappNumber={s.whatsapp_number} initialProducts={products} />
      </div>
    </section>
  );
}
