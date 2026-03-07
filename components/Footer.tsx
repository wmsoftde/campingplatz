'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavLink {
  id: string;
  labelDe: string;
  labelEn: string;
  url: string;
  position: number;
}

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const [footerLinks, setFooterLinks] = useState<NavLink[]>([]);
  const [siteName, setSiteName] = useState(locale === 'de' ? 'Campingplatz' : 'Campsite');

  useEffect(() => {
    fetch('/api/navigation')
      .then(res => res.json())
      .then(data => setFooterLinks(data.footer || []))
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

  return (
    <footer className="bg-primary-dark text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">
              {siteName}
            </h3>
            <p className="text-gray-300 text-sm">
              {locale === 'de' 
                ? 'Ihr familienfreundlicher Campingplatz mit zentraler Lage'
                : 'Your family-friendly campsite with a central location'
              }
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">
              {locale === 'de' ? 'Navigation' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href={`/${locale}`} className="hover:text-white">{t('home')}</Link></li>
              {footerLinks.sort((a, b) => a.position - b.position).map(link => (
                <li key={link.id}>
                  <Link 
                    href={link.url.startsWith('/') ? `/${locale}${link.url}` : link.url} 
                    className="hover:text-white"
                  >
                    {locale === 'de' ? link.labelDe : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">
              {locale === 'de' ? 'Rechtliches' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href={`/${locale}/agb`} className="hover:text-white">AGB</Link></li>
              <li><Link href={`/${locale}/datenschutz`} className="hover:text-white">
                {locale === 'de' ? 'Datenschutz' : 'Privacy'}
              </Link></li>
              <li><Link href={`/${locale}/impressum`} className="hover:text-white">
                {locale === 'de' ? 'Impressum' : 'Imprint'}
              </Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">
              {locale === 'de' ? 'Kontakt' : 'Contact'}
            </h4>
            <p className="text-sm text-gray-300">
              {locale === 'de' ? 'Wir freuen uns auf Sie!' : 'We look forward to hearing from you!'}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {siteName}. {locale === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
