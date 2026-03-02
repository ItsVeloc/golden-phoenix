'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  function handleLogout() {
    document.cookie = 'gp-admin-session=; path=/; max-age=0';
    router.push('/admin/login');
  }

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/tables', label: 'Tables' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">Golden Phoenix</div>
        <nav>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            style={{
              display: 'block',
              padding: '12px 24px',
              fontSize: '13px',
              color: 'var(--cream-dim)',
              letterSpacing: '1px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'var(--sans)',
              width: '100%',
              transition: 'all 0.2s',
              marginTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '20px',
            }}
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
