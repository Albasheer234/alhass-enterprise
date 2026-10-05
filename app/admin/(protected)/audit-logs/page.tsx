import { prisma } from '@/lib/prisma';
import { formatDateTime } from '@/lib/utils';

const PAGE_SIZE = 50;

export default async function AuditLogsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { adminUser: { select: { name: true, email: true } } },
    }),
    prisma.auditLog.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <h1 className="admin-page-title">Audit Logs</h1>
      <div className="panel">
        <div className="panel__header"><h2>{total} recorded action{total === 1 ? '' : 's'}</h2></div>
        <div className="table-wrap">
          {logs.length === 0 ? (
            <div className="panel__body"><p style={{ color: 'var(--gray-500)', margin: 0 }}>No audit records yet.</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>When</th><th>Admin</th><th>Action</th><th>Entity</th><th>Metadata</th></tr></thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(log.createdAt)}</td>
                    <td>{log.adminUser.name}<br /><span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{log.adminUser.email}</span></td>
                    <td><span className="badge badge--gold">{log.action}</span></td>
                    <td>{log.entityType ?? '—'}{log.entityId ? <br /> : null}
                      <span style={{ color: 'var(--gray-500)', fontSize: '0.78rem' }}>{log.entityId ?? ''}</span></td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.82rem', maxWidth: 320, wordBreak: 'break-all' }}>{log.metadata ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {page > 1 && <a className="btn btn--navy btn--sm" href={`/admin/audit-logs?page=${page - 1}`}>← Newer</a>}
          <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Page {page} of {totalPages}</span>
          {page < totalPages && <a className="btn btn--navy btn--sm" href={`/admin/audit-logs?page=${page + 1}`}>Older →</a>}
        </div>
      )}
    </>
  );
}
