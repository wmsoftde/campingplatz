import { getTranslations } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/db';
import Link from 'next/link';

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
        {/* Hero Section with Video Background */}
        <section className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/DOM-ZOOM1.mp4"
          >
            <source src="/DOM-ZOOM1.mp4" type="video/mp4" />
          </video>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-custom text-center text-white relative z-10">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                {page ? (locale === 'de' ? page.titleDe : page.titleEn) : t('title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto drop-shadow-md">
                {t('subtitle')}
              </p>
            </div>
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
                      ? 'Der Campingplatz liegt auf einem ca. 18000qm großem Grundstück und ist ein Saison-Campingplatz. Der Campingplatz ist von Anfang April bis Ende Oktober geöffnet. Ein Teil des Platzes ist fest an Dauercamper vermietet der andere Teil steht unseren reisenden Gästen zur Verfügung.'
                      : 'The campsite is located on an approx. 18,000 sqm plot and is a seasonal campsite. The campsite is open from the beginning of April to the end of October. Part of the site is permanently rented out to long-term campers, while the other part is available to our traveling guests.'
                    }
                  </p>
                  <p className="text-gray-600">
                    {locale === 'de' 
                      ? <>Für die Reservierung eines Stellplatzes können Reisende und Touristen unser <Link href={`/${locale}/calendar`} className="text-primary font-bold hover:underline">Online-Buchungsanfragesystem</Link> nutzen.</>
                      : <>Travelers and tourists can use our <Link href={`/${locale}/calendar`} className="text-primary font-bold hover:underline">online booking request system</Link> to reserve a pitch.</>
                    }
                  </p>
                </div>
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="/bild1680x720-1-585x500.jpg" 
                    alt={locale === 'de' ? 'Unser Campingplatz' : 'Our campsite'} 
                    className="w-full h-full object-cover"
                  />
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
