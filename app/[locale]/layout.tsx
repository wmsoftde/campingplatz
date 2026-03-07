import '../globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  noStore();
  const { locale } = await params;
  const settings = await prisma.settings.findFirst();
  const siteName = settings ? (locale === 'de' ? settings.siteNameDe : settings.siteNameEn) : 'Campingplatz';

  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: locale === 'de' ? 'Familienfreundlicher Campingplatz' : 'Family-friendly campsite',
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
