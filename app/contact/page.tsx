import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import { generalWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact ALHASS Integrated Enterprise — Bulumkutu Abuja - Deeper Life. Call, email, or chat on WhatsApp: 08121219528.',
};

export default async function ContactPage() {
  const s = await getSettings();
  const wa = generalWhatsAppUrl(s.whatsapp_number);
  const phones = [s.whatsapp_number, s.contact_2, s.contact_3].filter(Boolean);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">
          We would love to hear from you. Reach out by phone, email, or WhatsApp — {s.tagline}.
        </p>
        <div className={`grid ${s.email ? 'grid--4' : 'grid--3'}`}>
          <div className="info-block">
            <h3>📍 Our Address</h3>
            <p>{s.address}</p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Walk-ins welcome during business hours.</p>
          </div>
          <div className="info-block">
            <h3>📞 Phone Numbers</h3>
            {phones.map((p) => (
              <p key={p}>
                <a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a>
              </p>
            ))}
          </div>
          <div className="info-block">
            <h3>💬 WhatsApp</h3>
            <p>Fastest way to reach us:</p>
            <p><a href={wa} target="_blank" rel="noopener noreferrer">{s.whatsapp_number}</a></p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--sm mt-2">
              Chat on WhatsApp
            </a>
          </div>
          {s.email && (
            <div className="info-block">
              <h3>✉️ Email</h3>
              <p>Send us an email:</p>
              <p><a href={`mailto:${s.email}`}>{s.email}</a></p>
              <a href={`mailto:${s.email}`} className="btn btn--outline btn--sm mt-2">
                Send Email
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
