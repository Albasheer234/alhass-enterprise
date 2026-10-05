import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { generalWhatsAppUrl } from '@/lib/whatsapp';
import ProductCard from '@/components/products/ProductCard';
import ServiceIcon from '@/components/services/ServiceIcon';

export default async function HomePage() {
  const [s, services, featured] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);
  const wa = generalWhatsAppUrl(s.whatsapp_number);

  return (
    <>
      {/* Hero */}
      <section
        className="hero"
        style={s.hero_bg_image ? {
          backgroundImage: `url(${s.hero_bg_image})`,
        } : undefined}
      >
        <div className="container">
          <img className="hero__logo" src="/logo/alhass-logo.png" alt={`${s.business_name} logo`} width={110} height={125} />
          <h1>{s.business_name}</h1>
          <p className="hero__tagline">&ldquo;{s.tagline}&rdquo;</p>
          <p className="hero__desc">
            Your trusted one-stop shop in {s.address} — quality provisions, dependable POS
            services, affordable data &amp; airtime, and essential household products.
          </p>
          <div className="hero__actions">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
              Chat with us on WhatsApp
            </a>
            <Link href="/shop" className="btn btn--outline-light">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Core services */}
      <section className="section" aria-labelledby="services-heading">
        <div className="container">
          <h2 id="services-heading" className="section-title">Our Core Services</h2>
          <p className="section-subtitle">Everything you need, under one trusted roof.</p>
          <div className="grid grid--4">
            {services.map((svc) => (
              <div key={svc.id} className="service-tile">
                <div className="service-tile__icon"><ServiceIcon icon={svc.icon} /></div>
                <h3>{svc.name}</h3>
                <p>{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="section section--gray" aria-labelledby="featured-heading">
          <div className="container">
            <h2 id="featured-heading" className="section-title">Featured Products</h2>
            <p className="section-subtitle">A selection of what our customers love. Order any item directly on WhatsApp.</p>
            <div className="grid grid--3">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} whatsappNumber={s.whatsapp_number} />
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/shop" className="btn btn--navy">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* About intro */}
      <section className="section" aria-labelledby="about-heading">
        <div className="container" style={{ maxWidth: 820 }}>
          <h2 id="about-heading" className="section-title">Welcome to {s.business_name}</h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            {s.business_description ||
              `${s.business_name} proudly serves the ${s.address} community with quality products and reliable services. ${s.tagline} — that is the principle behind everything we do.`}
          </p>
          <div className="text-center mt-3">
            <Link href="/about" className="btn btn--outline">Learn More About Us</Link>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section section--navy" aria-labelledby="why-heading">
        <div className="container">
          <h2 id="why-heading" className="section-title">Why Choose ALHASS?</h2>
          <div className="feature-list mt-3">
            <div className="feature-item">
              <div className="feature-item__dot" aria-hidden="true">1</div>
              <div>
                <h3>Trusted Quality</h3>
                <p>Genuine products and dependable services you can rely on every day.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-item__dot" aria-hidden="true">2</div>
              <div>
                <h3>Fair &amp; Transparent</h3>
                <p>Clear prices and honest advice — confirmed with you directly before payment.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-item__dot" aria-hidden="true">3</div>
              <div>
                <h3>Easy WhatsApp Ordering</h3>
                <p>No accounts, no carts — just message us and we take care of the rest.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to Order?</h2>
            <p>Message us on WhatsApp for current prices, availability and quick assistance. We typically reply promptly during business hours.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section section--gray" aria-labelledby="location-heading">
        <div className="container">
          <h2 id="location-heading" className="section-title">Visit Us</h2>
          <p className="section-subtitle">Find us at {s.address}. Walk-ins are always welcome.</p>
          <div className={`grid ${s.email ? 'grid--4' : 'grid--3'}`}>
            <div className="info-block">
              <h3>📍 Address</h3>
              <p>{s.address}</p>
            </div>
            <div className="info-block">
              <h3>📞 Call Us</h3>
              {[s.whatsapp_number, s.contact_2, s.contact_3].filter(Boolean).map((c) => (
                <p key={c}><a href={`tel:${c.replace(/\s/g, '')}`}>{c}</a></p>
              ))}
            </div>
            <div className="info-block">
              <h3>💬 WhatsApp</h3>
              <p><a href={wa} target="_blank" rel="noopener noreferrer">{s.whatsapp_number}</a></p>
            </div>
            {s.email && (
              <div className="info-block">
                <h3>✉️ Email</h3>
                <p><a href={`mailto:${s.email}`}>{s.email}</a></p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
