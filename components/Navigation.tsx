'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import NavWeatherWidget from '@/components/NavWeatherWidget';

interface NavLink {
  id: string;
  labelDe: string;
  labelEn: string;
  url: string;
  position: number;
  parentId: string | null;
  children?: NavLink[];
}

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

export function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [siteName, setSiteName] = useState(locale === 'de' ? 'Campingplatz' : 'Campsite');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/navigation')
      .then(res => res.json())
      .then(data => setNavLinks(data.navbar || []))
      .catch(console.error);

    fetch(`/api/settings?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSiteName(locale === 'de' ? data.siteNameDe : data.siteNameEn);
        }
      })
      .catch(console.error);
  }, [locale]);

  const navItems: NavItem[] = useMemo(() => {
    const rootLinks = navLinks
      .filter(l => !l.parentId)
      .sort((a, b) => a.position - b.position);

    // Guard against duplicate URLs/entries in the DB
    const seenRoot = new Set<string>();
    const uniqueRootLinks = rootLinks.filter((l) => {
      const key = `${l.url}|${l.parentId || ''}`;
      if (seenRoot.has(key)) return false;
      seenRoot.add(key);
      return true;
    });

    return uniqueRootLinks.map(link => {
      const childrenRaw = navLinks
        .filter(child => child.parentId === link.id)
        .sort((a, b) => a.position - b.position)
        .map(child => ({
          href: child.url.startsWith('/') ? `/${locale}${child.url}` : child.url,
          label: locale === 'de' ? child.labelDe : child.labelEn,
        }));

      const seenChild = new Set<string>();
      const children = childrenRaw.filter((c) => {
        if (seenChild.has(c.href)) return false;
        seenChild.add(c.href);
        return true;
      });

      return {
        href: link.url.startsWith('/') ? `/${locale}${link.url}` : link.url,
        label: locale === 'de' ? link.labelDe : link.labelEn,
        children: children.length > 0 ? children : undefined
      };
    });
  }, [navLinks, locale]);

  const isActive = (href: string) => pathname === href || (pathname.startsWith(href) && href !== `/${locale}`);

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

          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item) => (
              <div 
                key={item.href} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={clsx(
                    'font-medium transition-colors flex items-center gap-1 py-5',
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-primary'
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} className={clsx("transition-transform", activeDropdown === item.href && "rotate-180")} />}
                </Link>

                {item.children && (
                  <div className={clsx(
                    "absolute top-full left-0 w-52 bg-white shadow-xl rounded-b-lg border-t-2 border-primary py-2 transition-[opacity,transform] duration-300 ease-out transform origin-top-left z-50",
                    activeDropdown === item.href 
                      ? "opacity-100 translate-y-0 scale-100 visible pointer-events-auto" 
                      : "opacity-0 -translate-y-2 scale-95 invisible pointer-events-none"
                  )}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={clsx(
                          "block px-4 py-2 text-sm transition-colors",
                          isActive(child.href) 
                            ? "text-primary font-bold bg-primary/5" 
                            : "text-gray-600 hover:text-primary hover:bg-gray-50"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
          <div className="md:hidden py-4 border-t max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.href} className="border-b border-gray-50 last:border-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex-1 py-3 font-medium',
                      isActive(item.href) ? 'text-primary' : 'text-gray-600'
                    )}
                    onClick={() => !item.children && setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                      className="p-3 text-gray-400"
                    >
                      <ChevronDown size={20} className={clsx("transition-transform", activeDropdown === item.href && "rotate-180")} />
                    </button>
                  )}
                </div>
                
                {item.children && activeDropdown === item.href && (
                  <div className="bg-gray-50 px-4 py-2 space-y-2 mb-2 rounded-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={clsx(
                          "block py-2 text-sm",
                          isActive(child.href) ? "text-primary font-bold" : "text-gray-600"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
