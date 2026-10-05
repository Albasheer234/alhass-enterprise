import { getSettings } from '@/lib/settings';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <h1 className="admin-page-title">Website Settings</h1>
      <div className="panel">
        <div className="panel__header">
          <h2>Business Information</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Changes apply across the whole website immediately.</span>
        </div>
        <div className="panel__body"><SettingsForm settings={settings} /></div>
      </div>
    </>
  );
}
