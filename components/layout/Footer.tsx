import Link from 'next/link';

export default function Footer({
  businessName,
  tagline,
  address,
  contacts,
  email,
  whatsappUrl,
  year,
}: {
  businessName: string;
  tagline: string;
  address: string;
  contacts: string[];
  email?: string;
  whatsappUrl: string;
  year: number;
}) {
  const services = ['Provision Store', 'POS Services', 'Data & Airtime', 'Household Products'];
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <img className="footer-brand__logo" src="/logo/alhass-logo.png" alt={`${businessName} logo`} width={44} height={50} />
            <strong>{businessName}</strong>
          </div>
          <p style={{ margin: '0 0 0.4rem', fontStyle: 'italic', color: 'var(--gold-400)' }}>
            &ldquo;{tagline}&rdquo;
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{address}</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/payment-details">Payment Details</Link></li>
          </ul>
        </div>

        <div>
          <h4>Our Services</h4>
          <ul>
            {services.map((s) => (
              <li key={s}><Link href="/services">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Contact Us</h4>
          <ul>
            {contacts.filter(Boolean).map((c) => (
              <li key={c}>
                <a href={`tel:${c.replace(/\s/g, '')}`}>{c}</a>
              </li>
            ))}
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {year} {businessName}. All rights reserved.
      </div>
    </footer>
  );
}
