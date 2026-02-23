import { getTranslations } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/db';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  
  const page = await prisma.page.findFirst({
    where: { slug: 'about', published: true }
  });

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
            {page ? (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: locale === 'de' ? page.contentDe : page.contentEn 
                }}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-primary mb-6">
                    {locale === 'de' ? 'Willkommen bei uns' : 'Welcome to us'}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {locale === 'de' 
                      ? 'Unser Campingplatz wurde vor über 30 Jahren gegründet und wird heute in zweiter Generation geführt. Wir legen großen Wert auf Familienfreundlichkeit, Naturschutz und Gastfreundschaft.'
                      : 'Our campsite was founded over 30 years ago and is now run in the second generation. We place great emphasis on family-friendliness, nature conservation and hospitality.'
                    }
                  </p>
                  <p className="text-gray-600">
                    {locale === 'de' 
                      ? 'Die idyllische Lage am Waldrand, die modernen Einrichtungen und das vielfältige Freizeitangebot machen unseren Platz zu einem beliebten Reiseziel für Camper aus aller Welt.'
                      : 'The idyllic location at the edge of the forest, the modern facilities and the diverse leisure activities make our site a popular destination for campers from all over the world.'
                    }
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl h-96 flex items-center justify-center">
                  <span className="text-8xl">🏕️</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">
              {locale === 'de' ? 'Ausstattung' : 'Facilities'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: '🚿', de: 'Sanitär', en: 'Sanitary' },
                { icon: '⚡', de: 'Strom', en: 'Electricity' },
                { icon: '📶', de: 'WLAN', en: 'WiFi' },
                { icon: '🏪', de: 'Shop', en: 'Shop' },
                { icon: '🍳', de: 'Küche', en: 'Kitchen' },
                { icon: '🧺', de: 'Wäsche', en: 'Laundry' },
                { icon: '🐕', de: 'Haustier', en: 'Pets' },
                { icon: '🅿️', de: 'Parkplatz', en: 'Parking' },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6 bg-background rounded-xl">
                  <span className="text-4xl block mb-4">{item.icon}</span>
                  <span className="font-medium text-gray-700">
                    {locale === 'de' ? item.de : item.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
