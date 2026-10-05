import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { productWhatsAppUrl } from '@/lib/whatsapp';

const PLACEHOLDER = '/images/product-placeholder.svg';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!product || !product.isPublished) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, s] = await Promise.all([
    prisma.product.findUnique({ where: { slug: params.slug }, include: { category: true } }),
    getSettings(),
  ]);
  if (!product || !product.isPublished) notFound();

  const wa = productWhatsAppUrl(s.whatsapp_number, product.name);

  return (
    <section className="section">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-detail__image">
            <img
              src={product.imageUrl ?? PLACEHOLDER}
              alt={product.imageUrl ? product.name : `${product.name} (image coming soon)`}
              width={1200}
              height={900}
            />
          </div>
          <div>
            <div className="product-detail__category">{product.category.name}</div>
            <h1>{product.name}</h1>
            <p className="product-detail__desc">{product.description}</p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>
              Prices and availability are confirmed instantly when you message us on WhatsApp.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
                Order on WhatsApp
              </a>
              <Link href="/shop" className="btn btn--outline">Back to Shop</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
