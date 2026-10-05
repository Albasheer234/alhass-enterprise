# ALHASS INTEGRATED ENTERPRISE — Website V1

Business website + product catalogue + WhatsApp ordering + secure admin dashboard.

**Tagline:** Our Customers Our Priority
**Location:** Bulumkutu Abuja - Deeper Life
**WhatsApp:** 08121219528
**Email:** alhassintegratedenterprise@gmail.com

---

## Tech Stack

| Layer      | Choice                          |
|------------|---------------------------------|
| Framework  | Next.js 14 (App Router) + React 18 + TypeScript |
| Database   | SQLite (via Prisma ORM)         |
| Auth       | bcryptjs + signed httpOnly session cookie |
| Validation | Zod (server-side)               |
| Styling    | Custom CSS (no UI frameworks)   |

## What this system IS

- Public business website (Home, Shop, Services, About, Contact, Payment Details)
- Product catalogue organised in 4 categories, with search + category filters
- "Order on WhatsApp" buttons with pre-filled product messages (wa.me deep links)
- Secure admin dashboard (products, categories, services, payment details, settings, audit logs)

## What this system is NOT (V1 scope, by design)

No customer accounts, no cart, no prices on products, no stock/inventory, no online
payments, no reviews, no blog. Ordering happens **one product at a time via WhatsApp**;
payment details are displayed for reference only (manual transfer).

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    - Set AUTH_SECRET (run: openssl rand -base64 32)
#    - Set NEXT_PUBLIC_SITE_URL (your domain) in production

# 3. Create database + seed data (admin user, categories, services,
#    payment accounts, sample products, site settings)
npm run setup

# 4. Start development server
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/login

### Default admin credentials (CHANGE AFTER FIRST LOGIN)

| Field    | Value             |
|----------|-------------------|
| Email    | admin@alhass.com  |
| Password | ChangeMe123!      |

To change the password, update the `passwordHash` in the `AdminUser` table, or ask
your developer to run a one-off script using `bcrypt.hash(newPassword, 12)`.

### Adding the real ALHASS logo

Replace `public/logo/alhass-logo.svg` with the original logo file (keep the same
filename, or update the references in `components/layout/Header.tsx`,
`components/layout/Footer.tsx`, `app/page.tsx` and `app/admin/**`).

---

## Project Structure

```
app/
├── (public pages)   page, shop/[slug], services, about, contact, payment-details
├── admin/
│   ├── login/                     Admin sign-in
│   └── (protected)/               Sidebar layout: dashboard, products,
│                                  categories, services, payments, settings, audit-logs
├── api/
│   ├── products/                  JSON product search/filter for the shop
│   └── payment-accounts/          Public payment details
├── sitemap.ts, robots.ts, not-found.tsx, error.tsx
components/          Header, Footer, ProductCard, ShopBrowser, admin forms, etc.
lib/
├── prisma.ts          Prisma singleton
├── auth.ts            Session create/verify/destroy (HMAC-signed cookie)
├── rate-limit.ts      Login rate limiting
├── whatsapp.ts        wa.me link builders (0812... → 234812...)
├── settings.ts        Site settings with defaults
├── audit.ts           Audit log writer
├── validation.ts      Zod schemas (all server-side)
├── upload.ts          Image validation + storage
└── actions/           Server actions (auth, products, categories,
                       services, payments, settings)
prisma/
├── schema.prisma      7 models: AdminUser, Category, Product, Service,
│                      PaymentAccount, SiteSetting, AuditLog
└── seed.ts
middleware.ts          Protects /admin/* (redirects to /admin/login)
```

---

## Security Measures Implemented

- Passwords hashed with bcrypt (cost 12); never stored or sent in plaintext
- HMAC-SHA256 signed, httpOnly, SameSite=Lax session cookies; Secure flag in production
- 8-hour session expiry; constant-time signature comparison
- Login rate limiting: 5 attempts / 10 min per email, 10 per IP
- All admin mutations are server actions that re-verify the session server-side
- Zod validation on every input, server-side (client validation is UX only)
- Image upload restrictions: MIME whitelist, 2MB limit, extension derived from MIME,
  SVG script rejection, random filenames
- Category deletion blocked when products would be orphaned
- Audit logging of all admin actions (login, logout, CRUD, settings)
- Secrets only via environment variables; `.env` is git-ignored

## Environment Variables

See `.env.example`:

| Variable                  | Purpose                                    |
|---------------------------|--------------------------------------------|
| `DATABASE_URL`            | SQLite file path, e.g. `file:./dev.db`     |
| `AUTH_SECRET`             | Session cookie signing secret (32+ chars)  |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public WhatsApp number (safe to expose) |
| `NEXT_PUBLIC_SITE_URL`    | Canonical URL for sitemap/OG metadata      |

---

## Deployment & SQLite Persistence (IMPORTANT)

SQLite requires **persistent filesystem storage**. Do NOT deploy to platforms that
reset the filesystem on each deploy/restart (e.g. standard Vercel/Netlify serverless,
some free-tier PaaS containers without persistent volumes).

Recommended options:

1. **VPS / dedicated server** (Ubuntu + Node + PM2 + Nginx). Simplest reliable setup —
   the SQLite file lives on the server's disk. Full control, cheap, ideal for V1.
2. **Docker container with a persistent volume** mounted at the database path.
3. Any host offering **persistent disk storage** for Node apps.

Migration path: the Prisma schema uses standard models — switching to PostgreSQL later
only requires changing the `datasource` block and `DATABASE_URL` (plus minor SQLite→
Postgres type adjustments), not an application rewrite.

### Production checklist

- [ ] `AUTH_SECRET` set to a long random value
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
- [ ] `NODE_ENV=production`
- [ ] Admin password changed from the seeded default
- [ ] `public/uploads/` backed up (product images live there)
- [ ] SQLite database file backed up regularly (e.g. nightly cron)
- [ ] HTTPS enforced (reverse proxy / host setting)
- [ ] Real ALHASS logo placed in `public/logo/`

### Build for production

```bash
npm run build   # runs prisma generate + db push, then next build
npm start       # production server on port 3000
```

---

## Testing Checklist (maps to acceptance criteria)

- [ ] Public pages load without login; no prices/stock anywhere
- [ ] Shop search + category filters update without page reload
- [ ] Product pages show image, name, category, description, WhatsApp button only
- [ ] WhatsApp buttons open wa.me/2348121219528 with the product name pre-filled
- [ ] `/admin/*` redirects to login when logged out; direct URL access blocked
- [ ] Wrong password rejected; repeated failures trigger rate limit message
- [ ] Product CRUD works incl. one image upload (type/size validation)
- [ ] Category delete blocked while it has products
- [ ] Payment details page shows seeded MONIEPOINT/OPAY accounts + warning notice
- [ ] Settings changes reflect on public pages immediately
- [ ] Audit logs record logins and all mutations
- [ ] Mobile: hamburger menu, touch-friendly buttons, responsive cards/tables
- [ ] 404 page works; no stack traces exposed to users

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `AUTH_SECRET is missing` | Copy `.env.example` → `.env` and set a secret |
| `PrismaClientInitializationError` | Run `npm run db:push` (database not created yet) |
| Login always fails | Ensure you ran `npm run db:seed`; use `admin@alhass.com` / `ChangeMe123!` |
| Images not showing after upload | Confirm the app has write access to `public/uploads/` |
| WhatsApp opens wrong number | Check `whatsapp_number` in Admin → Website Settings |
| Changes don't appear on site | Server actions call `revalidatePath`; hard-refresh (Ctrl+Shift+R) |

---

© ALHASS INTEGRATED ENTERPRISE. All rights reserved.
