import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import { generalWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About ALHASS Integrated Enterprise — Our Customers Our Priority. Serving Bulumkutu Abuja with provisions, POS services, data & airtime and household products.',
};

export default async function AboutPage() {
  const s = await getSettings();
  const wa = generalWhatsAppUrl(s.whatsapp_number);

  return (
    <>
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <h1 className="section-title">About {s.business_name}</h1>
          <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
            &ldquo;{s.tagline}&rdquo;
          </p>
          <p>
            {s.business_description ||
              `${s.business_name} is a trusted local business located at ${s.address}. We are dedicated to serving our community with four essential offerings: a well-stocked provision store, reliable POS services, affordable data & airtime, and quality household products.`}
          </p>
          <p>
            Our approach is simple — no complicated sign-ups, no online checkout, no hidden fees.
            Browse our catalogue here, then reach out to us directly on WhatsApp. We confirm
            current prices and availability personally, so you always know exactly what you are
            getting before you pay.
          </p>
          <p>
            Whether you are stocking your kitchen, topping up your data, withdrawing cash or
            picking up household essentials, our team is ready to serve you with honesty,
            speed and a smile.
          </p>
          <div className="text-center mt-4">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="feature-list mt-3">
            <div className="feature-item">
              <div className="feature-item__dot" aria-hidden="true">✓</div>
              <div>
                <h3>Customer First</h3>
                <p>Your satisfaction drives every decision we make.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-item__dot" aria-hidden="true">✓</div>
              <div>
                <h3>Integrity</h3>
                <p>Honest prices, genuine products and clear communication.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-item__dot" aria-hidden="true">✓</div>
              <div>
                <h3>Reliability</h3>
                <p>Consistent, dependable service you can build a routine around.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
