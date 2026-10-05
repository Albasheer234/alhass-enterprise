import CategoryForm from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <>
      <h1 className="admin-page-title">Add Category</h1>
      <div className="panel"><div className="panel__body"><CategoryForm /></div></div>
    </>
  );
}
