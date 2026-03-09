import { getTranslations } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';
import { renderContentHtml } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  // Force dynamic rendering by calling headers and noStore
  noStore();
  await headers();
  
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'prices' });
  
  // Use findUnique with 'default' to be sure
  const settings = await prisma.settings.findUnique({
    where: { id: 'default' }
  });

  const page = await prisma.page.findFirst({
    where: { slug: 'prices', published: true }
  });

  // Ensure these are treated as numbers
  const pricePlace = Number(settings?.pricePlace ?? 8);
  const priceAdult = Number(settings?.priceAdult ?? 5);
  const priceChild = Number(settings?.priceChild ?? 3);
  const priceElectricity = Number(settings?.priceElectricity ?? 3);

  return (
    <>
      <Navigation locale={locale} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-primary-light py-20">
          <div className="container-custom">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
              {page ? (locale === 'de' ? page.titleDe : page.titleEn) : t('title')}
            </h1>
            <p className="text-white/80 text-xl mt-4">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="card p-6 text-center border-2 border-primary">
                <div className="text-4xl mb-4">🏕️</div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  {t('place')}
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  €{pricePlace.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{t('perNight')}</p>
              </div>

              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="font-heading text-xl font-bold text-gray-700 mb-2">
                  {t('adult')}
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  €{priceAdult.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{t('perNight')}</p>
              </div>

              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">👶</div>
                <h3 className="font-heading text-xl font-bold text-gray-700 mb-2">
                  {t('child')}
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  €{priceChild.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{t('perNight')}</p>
              </div>

              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-heading text-xl font-bold text-gray-700 mb-2">
                  {t('electricity')}
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  €{priceElectricity.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{t('perNight')}</p>
              </div>
            </div>

            {page && (
              <div className="prose max-w-none mt-12">
                <h2>{t('info')}</h2>
                <div dangerouslySetInnerHTML={{ 
                  __html: renderContentHtml(locale === 'de' ? page.contentDe : page.contentEn)
                }} />
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container-custom max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-primary mb-8 underline decoration-accent decoration-4 underline-offset-8">
              {locale === 'de' ? 'Wichtige Preisinformationen' : 'Important Price Information'}
            </h2>
            <div className="bg-background rounded-2xl p-8 shadow-inner border border-primary/10">
              <div className="space-y-6 text-xl text-gray-700">
                <p className="font-bold text-primary italic">
                  {locale === 'de' 
                    ? 'Preise für Dauercamping auf Anfrage!' 
                    : 'Prices for long-term camping on request!'}
                </p>
                <div className="h-px bg-primary/20 w-1/2 mx-auto"></div>
                <p>
                  {locale === 'de' 
                    ? 'Alle Preise inkl. der gesetzlichen MwSt.' 
                    : 'All prices incl. statutory VAT.'}
                </p>
                <p className="font-medium">
                  {locale === 'de' 
                    ? 'Die Beträge sind bei Anmietung sofort fällig!' 
                    : 'Amounts are due immediately upon rental!'}
                </p>
                <div className="pt-6 text-sm text-gray-400">
                  {locale === 'de' ? 'Stand 02/2026' : 'As of 02/2026'}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
