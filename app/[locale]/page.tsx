import { getTranslations } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const settings = await prisma.settings.findFirst();

  return (
    <>
      <Navigation locale={locale} />
      
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-primary via-primary-light to-secondary min-h-[600px] flex items-center">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container-custom relative z-10 text-white">
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                {t('heroSubtitle')}
              </p>
              <Link
                href={`/${locale}/calendar`}
                className="inline-block bg-accent text-primary-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-white transition-all shadow-lg hover:shadow-xl"
              >
                {t('cta')}
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container-custom">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-primary mb-4">
              {t('features.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🌲</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-4">
                  {t('features.nature.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.nature.desc')}
                </p>
              </div>

              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-4">
                  {t('features.family.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.family.desc')}
                </p>
              </div>

              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-4">
                  {t('features.comfort.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.comfort.desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                  {locale === 'de' ? 'Erholung für die ganze Familie' : 'Relaxation for the whole family'}
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  {locale === 'de' 
                    ? 'Unser Campingplatz bietet alles, was Sie für einen erholsamen Urlaub benötigen. Ruhige Lage, moderne Einrichtungen und ein freundliches Team erwarten Sie.'
                    : 'Our campsite offers everything you need for a relaxing holiday. Quiet location, modern facilities and a friendly team await you.'
                  }
                </p>
                <Link
                  href={`/${locale}/about`}
                  className="btn-secondary inline-block"
                >
                  {locale === 'de' ? 'Mehr über uns' : 'Learn more about us'}
                </Link>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl h-80 flex items-center justify-center">
                <span className="text-6xl">🏕️</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-accent/10">
          <div className="container-custom text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
              {locale === 'de' ? 'Noch Fragen?' : 'Any questions?'}
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              {locale === 'de' 
                ? 'Kontaktieren Sie uns gerne für weitere Informationen oder Anfragen.'
                : 'Feel free to contact us for more information or inquiries.'
              }
            </p>
            <Link
              href={`/${locale}/contact`}
              className="btn-primary inline-block"
            >
              {locale === 'de' ? 'Kontakt aufnehmen' : 'Get in touch'}
            </Link>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
