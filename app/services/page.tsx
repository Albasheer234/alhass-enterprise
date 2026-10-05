import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { generalWhatsAppUrl } from '@/lib/whatsapp';
import ServiceIcon from '@/components/services/ServiceIcon';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Provision store, POS services, data & airtime and household products — ALHASS Integrated Enterprise, Bulumkutu Abuja.',
};

export default async function ServicesPage() {
  const [services, s] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
    getSettings(),
  ]);
  const wa = generalWhatsAppUrl(s.whatsapp_number);

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="section-title">Our Services</h1>
          <p className="section-subtitle">
            Four core services, one convenient location at {s.address}.
          </p>
          <div className="grid grid--2">
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

      <section className="section section--gray">
        <div className="container">
          <div className="cta-band">
            <h2>Have a Question?</h2>
            <p>Reach out on WhatsApp and we will gladly tell you more about any of our services.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
