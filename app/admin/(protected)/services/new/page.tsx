import ServiceForm from '@/components/admin/ServiceForm';

export default function NewServicePage() {
  return (
    <>
      <h1 className="admin-page-title">Add Service</h1>
      <div className="panel"><div className="panel__body"><ServiceForm /></div></div>
    </>
  );
}
