import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { logoutAction } from '@/lib/actions/auth';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/admin/products', label: 'Products', icon: '▤' },
  { href: '/admin/categories', label: 'Categories', icon: '◫' },
  { href: '/admin/services', label: 'Services', icon: '✦' },
  { href: '/admin/payments', label: 'Payment Details', icon: '₦' },
  { href: '/admin/settings', label: 'Website Settings', icon: '⚙' },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: '☰' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getSession();
  if (!admin) redirect('/admin/login');

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src="/logo/alhass-logo.png" alt="ALHASS logo" width={40} height={45} />
          <span>ALHASS<br />Admin Panel</span>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          <div className="admin-nav__section">Manage</div>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </Link>
          ))}
          <div className="admin-nav__section">Session</div>
          <form action={logoutAction}>
            <button type="submit"><span aria-hidden="true">⏻</span> Logout</button>
          </form>
        </nav>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <strong style={{ color: 'var(--navy-800)' }}>Administrator Dashboard</strong>
          <span className="admin-topbar__admin">
            Signed in as <strong>{admin.name}</strong> ({admin.email})
          </span>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
