'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/posts', label: 'Beiträge', icon: '📝' },
  { href: '/admin/pages', label: 'Seiten', icon: '📄' },
  { href: '/admin/navigation', label: 'Navigation', icon: '🔗' },
  { href: '/admin/bookings', label: 'Buchungen', icon: '📅' },
  { href: '/admin/media', label: 'Medien', icon: '🖼️' },
  { href: '/admin/settings', label: 'Einstellungen', icon: '⚙️' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run on admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip auth check for non-admin routes
    if (!isAdminRoute || !mounted) {
      return;
    }

    setLoading(true);
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          router.push('/login');
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
        setLoading(false);
      });
  }, [pathname, router, isAdminRoute, mounted]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Show loading during auth check
  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Laden...</div>
      </div>
    );
  }

  // Don't render admin shell on non-admin routes
  if (!isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className={`bg-primary-dark text-white ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 fixed h-full`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/admin/dashboard" className="font-heading text-xl font-bold">
              ⛺ Admin
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors ${
                pathname === item.href ? 'bg-white/10' : ''
              }`}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full hover:bg-red-600 transition-colors rounded"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 p-8 overflow-auto ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}