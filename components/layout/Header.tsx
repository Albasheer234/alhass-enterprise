'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({
  businessName,
  tagline,
  whatsappUrl,
}: {
  businessName: string;
  tagline: string;
  whatsappUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label="ALHASS Integrated Enterprise - home">
          <img className="brand__logo" src="/logo/alhass-logo.png" alt={`${businessName} logo`} width={48} height={54} />
          <span className="brand__text">
            <span className="brand__name" aria-label="ALHASS">
              <span aria-hidden="true" className="brand__name-letters">
                <span>A</span><span>L</span><span>H</span><span>A</span><span>S</span><span>S</span>
              </span>
            </span>
            <span className="brand__sub">Integrated Enterprise</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? 'active' : ''}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--sm nav-cta">
          Chat on WhatsApp
        </a>

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <nav className={`mobile-menu container ${open ? 'open' : ''}`} aria-label="Mobile navigation">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp" style={{ marginTop: '0.5rem' }}>
          Chat on WhatsApp
        </a>
      </nav>
    </header>
  );
}
