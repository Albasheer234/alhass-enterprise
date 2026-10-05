import type { Metadata } from 'next';
import './globals.css';
import { getSettings } from '@/lib/settings';
import { generalWhatsAppUrl } from '@/lib/whatsapp';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: {
      default: `${s.business_name} | Provision Store, POS, Data & Airtime`,
      template: `%s | ${s.business_name}`,
    },
    description: `${s.business_description || `${s.business_name} - ${s.tagline}. Quality provisions, POS services, data & airtime and household products in ${s.address}. Order via WhatsApp.`}`,
    openGraph: {
      type: 'website',
      siteName: s.business_name,
      title: `${s.business_name} | Provision Store, POS, Data & Airtime`,
      description: s.tagline,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const wa = generalWhatsAppUrl(s.whatsapp_number);
  const contacts = [s.whatsapp_number, s.contact_2, s.contact_3];

  return (
    <html lang="en">
      <body>
        <Header businessName={s.business_name} tagline={s.tagline} whatsappUrl={wa} />
        <main>{children}</main>
        <Footer
          businessName={s.business_name}
          tagline={s.tagline}
          address={s.address}
          contacts={contacts}
          email={s.email}
          whatsappUrl={wa}
          year={new Date().getFullYear()}
        />
        <WhatsAppFloat url={wa} />
      </body>
    </html>
  );
}
