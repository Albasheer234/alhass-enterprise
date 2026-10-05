import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty-state">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.2em' }}>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or may have been moved.</p>
        <div className="hero__actions mt-3">
          <Link href="/" className="btn btn--navy">Go to Home</Link>
          <Link href="/shop" className="btn btn--outline">Browse Products</Link>
        </div>
      </div>
    </section>
  );
}
