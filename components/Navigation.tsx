'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import NavWeatherWidget from '@/components/NavWeatherWidget';

interface NavLink {
  id: string;
  labelDe: string;
  labelEn: string;
  url: string;
  position: number;
  parentId: string | null;
}

export function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [siteName, setSiteName] = useState(locale === 'de' ? 'Campingplatz' : 'Campsite');

  useEffect(() => {
    fetch('/api/navigation')
      .then(res => res.json())
      .then(data => setNavLinks(data.navbar || []))
      .catch(console.error);

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSiteName(locale === 'de' ? data.siteNameDe : data.siteNameEn);
        }
      })
      .catch(console.error);
  }, [locale]);

  // Only home is static, all other links come from database
  const staticHome = [
    { href: `/${locale}`, label: t('home'), position: -1 }
  ];

  const dynamicItems = navLinks
    .filter(l => !l.parentId)
    .sort((a, b) => a.position - b.position)
    .map(link => ({
      href: link.url.startsWith('/') ? `/${locale}${link.url}` : link.url,
      label: locale === 'de' ? link.labelDe : link.labelEn,
      position: link.position
    }));

  const navItems = [...staticHome, ...dynamicItems];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            {/* Weather Widget - Leftmost */}
            <div className="hidden sm:block">
              <NavWeatherWidget locale={locale} />
            </div>
            
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <span className="text-2xl">⛺</span>
              <span className="font-heading text-xl font-bold text-primary">
                {siteName}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
            
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              {t('admin')}
            </Link>

            <div className="flex items-center space-x-2 ml-4">
              <Link
                href={pathname.replace(`/${locale}`, '/de')}
                className={clsx(
                  'px-2 py-1 text-sm rounded',
                  locale === 'de' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                DE
              </Link>
              <Link
                href={pathname.replace(`/${locale}`, '/en')}
                className={clsx(
                  'px-2 py-1 text-sm rounded',
                  locale === 'en' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                EN
              </Link>
            </div>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'block py-2 font-medium',
                  isActive(item.href) ? 'text-primary' : 'text-gray-600'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex space-x-4 mt-4 pt-4 border-t">
              <Link
                href={pathname.replace(`/${locale}`, '/de')}
                className={clsx(
                  'px-3 py-2 text-sm rounded',
                  locale === 'de' ? 'bg-primary text-white' : 'bg-gray-100'
                )}
              >
                Deutsch
              </Link>
              <Link
                href={pathname.replace(`/${locale}`, '/en')}
                className={clsx(
                  'px-3 py-2 text-sm rounded',
                  locale === 'en' ? 'bg-primary text-white' : 'bg-gray-100'
                )}
              >
                English
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
