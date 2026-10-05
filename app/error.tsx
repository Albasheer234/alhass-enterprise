'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section">
      <div className="container empty-state">
        <h1>Something went wrong</h1>
        <p>We hit an unexpected problem. Please try again — if it persists, contact us on WhatsApp.</p>
        <button onClick={reset} className="btn btn--navy mt-3">Try Again</button>
      </div>
    </section>
  );
}
