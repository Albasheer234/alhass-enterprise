import { prisma } from './prisma';

export const DEFAULT_SETTINGS: Record<string, string> = {
  business_name: 'ALHASS INTEGRATED ENTERPRISE',
  tagline: 'Our Customers Our Priority',
  address: 'Bulumkutu Abuja - Deeper Life',
  whatsapp_number: '08121219528',
  contact_2: '08169180866',
  contact_3: '09138146543',
  email: 'alhassintegratedenterprise@gmail.com',
  business_description: '',
  footer_note: '© ALHASS INTEGRATED ENTERPRISE. All rights reserved.',
  hero_bg_image: '',   // public URL path; empty = solid brand gradient
};

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}
