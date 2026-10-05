import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSettings } from '@/lib/settings';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await getSession();
  if (admin) redirect('/admin/dashboard');
  const s = await getSettings();

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="brand">
          <img className="brand__logo" src="/logo/alhass-logo.png" alt={`${s.business_name} logo`} width={48} height={54} />
          <span>
            <span className="brand__name" style={{ color: 'var(--navy-800)' }}>{s.business_name}</span>
            <br />
            <span className="brand__tagline" style={{ color: 'var(--gold-500)' }}>Admin Dashboard</span>
          </span>
        </div>
        <h1>Administrator Sign In</h1>
        <LoginForm />
        <p className="login-note">Authorized administrators only. All actions are logged.</p>
      </div>
    </div>
  );
}
