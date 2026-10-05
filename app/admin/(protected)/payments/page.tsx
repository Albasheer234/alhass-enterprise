import { prisma } from '@/lib/prisma';
import PaymentForm from '@/components/admin/PaymentForm';
import { deletePaymentAction } from '@/lib/actions/payments';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminPaymentsPage() {
  const accounts = await prisma.paymentAccount.findMany({ orderBy: { displayOrder: 'asc' } });
  return (
    <>
      <h1 className="admin-page-title">Payment Details</h1>

      <div className="notice" role="note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        </svg>
        <span>These details are displayed publicly for customer reference only — this is <strong>not</strong> an online payment system.</span>
      </div>

      <div className="panel">
        <div className="panel__header"><h2>Published Payment Accounts</h2></div>
        <div className="table-wrap">
          {accounts.length === 0 ? (
            <div className="panel__body"><p style={{ color: 'var(--gray-500)', margin: 0 }}>No payment accounts configured.</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Order</th><th>Provider</th><th>Account Name</th><th>Account Number</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.displayOrder}</td>
                    <td><strong>{a.provider}</strong></td>
                    <td>{a.accountName}</td>
                    <td style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{a.accountNumber}</td>
                    <td><span className={`badge ${a.isActive ? 'badge--green' : 'badge--gray'}`}>{a.isActive ? 'Active' : 'Hidden'}</span></td>
                    <td><DeleteButton action={deletePaymentAction} id={a.id}
                      confirmMessage={`Delete ${a.provider} account ${a.accountNumber}?`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel__header"><h2>Add New Payment Account</h2></div>
        <div className="panel__body"><PaymentForm /></div>
      </div>
    </>
  );
}
