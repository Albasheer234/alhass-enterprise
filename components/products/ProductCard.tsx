import Link from 'next/link';
import type { Product, Category } from '@prisma/client';
import { productWhatsAppUrl } from '@/lib/whatsapp';

const PLACEHOLDER = '/images/product-placeholder.svg';

export default function ProductCard({
  product,
  whatsappNumber,
}: {
  product: Pick<Product, 'name' | 'slug' | 'description' | 'imageUrl' | 'isFeatured'> & {
    category: Pick<Category, 'name'>;
  };
  whatsappNumber: string;
}) {
  return (
    <article className="card">
      <div className="card__media">
        {product.isFeatured && <span className="card__badge">Featured</span>}
        <Link href={`/shop/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <img
            src={product.imageUrl ?? PLACEHOLDER}
            alt={product.imageUrl ? product.name : `${product.name} (image coming soon)`}
            loading="lazy"
            width={800}
            height={600}
          />
        </Link>
      </div>
      <div className="card__body">
        <div className="card__category">{product.category.name}</div>
        <h3 className="card__title">
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="card__desc">{product.description}</p>
        <div className="card__actions">
          <a
            href={productWhatsAppUrl(whatsappNumber, product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp btn--sm"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
