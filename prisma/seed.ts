import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SETTINGS: Record<string, string> = {
  business_name: 'ALHASS INTEGRATED ENTERPRISE',
  tagline: 'Our Customers Our Priority',
  address: 'Bulumkutu Abuja - Deeper Life',
  whatsapp_number: '08121219528',
  contact_2: '08169180866',
  contact_3: '09138146543',
  email: 'alhassintegratedenterprise@gmail.com',
  business_description:
    'ALHASS Integrated Enterprise is your trusted neighbourhood business in Bulumkutu, Abuja. We provide quality provisions, reliable POS services, affordable data & airtime, and essential household products — with our customers as our priority.',
  footer_note: '© ALHASS INTEGRATED ENTERPRISE. All rights reserved.',
};

const CATEGORIES = [
  { name: 'Provision Store', description: 'Everyday food and grocery provisions.', displayOrder: 1 },
  { name: 'POS Services', description: 'Reliable POS and payment agent services.', displayOrder: 2 },
  { name: 'Data & Airtime', description: 'Affordable data bundles and airtime for all networks.', displayOrder: 3 },
  { name: 'Household Products', description: 'Essential household and cleaning products.', displayOrder: 4 },
];

const SERVICES = [
  {
    name: 'Provision Store',
    description:
      'Quality foodstuffs and grocery provisions for your everyday needs — grains, pasta, oils, spices and more.',
    icon: 'store',
    displayOrder: 1,
  },
  {
    name: 'POS Services',
    description:
      'Fast and dependable POS services — withdrawals, transfers and bill payments you can trust.',
    icon: 'pos',
    displayOrder: 2,
  },
  {
    name: 'Data & Airtime',
    description:
      'Affordable data bundles and instant airtime top-up for MTN, Glo, Airtel and 9mobile.',
    icon: 'data',
    displayOrder: 3,
  },
  {
    name: 'Household Products',
    description:
      'Essential household and cleaning products to keep your home running smoothly.',
    icon: 'home',
    displayOrder: 4,
  },
];

const PAYMENT_ACCOUNTS = [
  {
    provider: 'MONIEPOINT',
    accountName: 'Alhass Integrated Enterprise',
    accountNumber: '6655002328',
    displayOrder: 1,
  },
  {
    provider: 'MONIEPOINT',
    accountName: 'Alhass Integrated Enterprise',
    accountNumber: '5659269010',
    displayOrder: 2,
  },
  {
    provider: 'OPAY',
    accountName: 'Bashir Alhassan',
    accountNumber: '8121219528',
    displayOrder: 3,
  },
];

const PRODUCTS = [
  {
    name: 'Golden Penny Spaghetti',
    category: 'Provision Store',
    description: 'Quality spaghetti suitable for everyday meals.',
    isFeatured: true,
  },
  {
    name: 'Golden Penny Semovita',
    category: 'Provision Store',
    description: 'Premium semovita for smooth, delicious swallow meals.',
    isFeatured: true,
  },
  {
    name: 'POS Withdrawal & Transfer',
    category: 'POS Services',
    description: 'Fast and secure cash withdrawal and transfer services at our Bulumkutu location.',
    isFeatured: true,
  },
  {
    name: 'MTN Data Bundles',
    category: 'Data & Airtime',
    description: 'Affordable MTN data bundles of all sizes, delivered instantly.',
    isFeatured: false,
  },
  {
    name: 'Airtime Top-Up (All Networks)',
    category: 'Data & Airtime',
    description: 'Instant airtime top-up for MTN, Glo, Airtel and 9mobile.',
    isFeatured: false,
  },
  {
    name: 'Dishwashing Liquid',
    category: 'Household Products',
    description: 'Effective dishwashing liquid for sparkling clean dishes.',
    isFeatured: false,
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  // Admin user — CHANGE THE PASSWORD AFTER FIRST LOGIN
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@alhass.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@alhass.com',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Admin user ready:', admin.email);

  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  const categoryIds = new Map<string, string>();
  for (const c of CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { slug: slugify(c.name) },
      update: { description: c.description, displayOrder: c.displayOrder },
      create: { name: c.name, slug: slugify(c.name), description: c.description, displayOrder: c.displayOrder },
    });
    categoryIds.set(c.name, cat.id);
  }

  for (const s of SERVICES) {
    await prisma.service.upsert({
      where: { slug: slugify(s.name) },
      update: { description: s.description, icon: s.icon, displayOrder: s.displayOrder },
      create: {
        name: s.name,
        slug: slugify(s.name),
        description: s.description,
        icon: s.icon,
        displayOrder: s.displayOrder,
      },
    });
  }

  for (const p of PAYMENT_ACCOUNTS) {
    const existing = await prisma.paymentAccount.findFirst({
      where: { provider: p.provider, accountNumber: p.accountNumber },
    });
    if (existing) {
      await prisma.paymentAccount.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.paymentAccount.create({ data: p });
    }
  }

  for (const p of PRODUCTS) {
    const slug = slugify(p.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          slug,
          description: p.description,
          categoryId: categoryIds.get(p.category)!,
          isFeatured: p.isFeatured,
          isPublished: true,
        },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
