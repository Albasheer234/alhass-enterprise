'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ProductCard from './ProductCard';

type ProductItem = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  isFeatured: boolean;
  category: { name: string };
};

export default function ShopBrowser({
  categories,
  whatsappNumber,
  initialProducts,
}: {
  categories: { id: string; name: string }[];
  whatsappNumber: string;
  initialProducts: ProductItem[];
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (q: string, cat: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (cat) params.set('category', cat);
      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) setProducts(await res.json());
    } catch {
      // keep previous results on network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchProducts(search, category), 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [search, category, fetchProducts]);

  return (
    <>
      <div className="shop-toolbar">
        <div style={{ flex: 1, maxWidth: 480 }}>
          <label htmlFor="product-search" className="sr-only" style={{ position: 'absolute', left: -9999 }}>
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <div className="chip-row" role="group" aria-label="Filter by category">
          <button
            className={`chip ${category === '' ? 'active' : ''}`}
            onClick={() => setCategory('')}
            aria-pressed={category === ''}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`chip ${category === c.id ? 'active' : ''}`}
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" style={{ minHeight: '2rem', marginBottom: '1rem', color: 'var(--gray-500)', fontSize: '0.9rem' }}>
        {loading ? 'Loading products…' : `${products.length} product${products.length === 1 ? '' : 's'} found`}
      </div>

      {products.length === 0 && !loading ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <h3>No products found</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className={`grid grid--3 ${loading ? 'opacity-50' : ''}`}>
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      )}
    </>
  );
}
