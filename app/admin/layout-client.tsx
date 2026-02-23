'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/posts', label: 'Beiträge', icon: '📝' },
  { href: '/admin/pages', label: 'Seiten', icon: '📄' },
  { href: '/admin/bookings', label: 'Buchungen', icon: '📅' },
  { href: '/admin/media', label: 'Medien', icon: '🖼️' },
  { href: '/admin/settings', label: 'Einstellungen', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => {
        if (!res.ok) router.push('/admin');
      })
      .catch(() => router.push('/admin'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`bg-primary-dark text-white ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
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
              className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
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

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
