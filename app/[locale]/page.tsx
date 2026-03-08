import { getTranslations } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <>
      <Navigation locale={locale} />
      
      <main className="flex-1">
        {/* Hero Section with Video Background */}
        <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/Startseite.mp4"
          >
            <source src="/Startseite.mp4" type="video/mp4" />
          </video>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-custom text-center text-white relative z-10">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                {t('heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto drop-shadow-md">
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
                  {locale === 'de' ? 'Für Zwischenstopp durch zentrale Lage geeignet!' : 'Suitable for stopovers due to central location!'}
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  {locale === 'de' 
                    ? 'Unser Campingplatz bietet was Sie für einen Zwischenstopp benötigen zweckmäßige Einrichtung und ein freundliches Team.'
                    : 'Our campsite offers what you need for a stopover: functional facilities and a friendly team.'
                  }
                </p>
                <Link
                  href={`/${locale}/about`}
                  className="btn-secondary inline-block"
                >
                  {locale === 'de' ? 'Mehr über uns' : 'Learn more about us'}
                </Link>
              </div>
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/karte-einfahrt-natur-380x320.jpg" 
                  alt={locale === 'de' ? 'Ihr Zwischenstopp' : 'Your stopover'} 
                  className="w-full h-full object-cover"
                />
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
