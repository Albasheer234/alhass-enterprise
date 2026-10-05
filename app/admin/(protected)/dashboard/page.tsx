import { prisma } from '@/lib/prisma';
import { formatDateTime } from '@/lib/utils';

export default async function DashboardPage() {
  const [products, categories, services, featured, published, recentLogs] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.service.count(),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { adminUser: { select: { name: true, email: true } } },
    }),
  ]);

  const stats = [
    { label: 'Total Products', value: products },
    { label: 'Categories', value: categories },
    { label: 'Services', value: services },
    { label: 'Featured', value: featured },
    { label: 'Published', value: published },
  ];

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel__header"><h2>Recent Admin Activity</h2></div>
        <div className="table-wrap">
          {recentLogs.length === 0 ? (
            <div className="panel__body"><p style={{ color: 'var(--gray-500)', margin: 0 }}>No activity recorded yet.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>When</th><th>Admin</th><th>Action</th><th>Details</th></tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(log.createdAt)}</td>
                    <td>{log.adminUser.name}</td>
                    <td><span className="badge badge--gold">{log.action}</span></td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
                      {log.entityType ?? '—'} {log.metadata ? `· ${log.metadata.slice(0, 80)}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
