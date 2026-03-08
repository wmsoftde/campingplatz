import { getTranslations } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PageRoute({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  const page = await prisma.page.findFirst({
    where: { slug, published: true }
  });

  if (!page) {
    notFound();
  }

  return (
    <>
      <Navigation locale={locale} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-primary-light py-20">
          <div className="container-custom">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
              {locale === 'de' ? page.titleDe : page.titleEn}
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container-custom">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: locale === 'de' ? page.contentDe : page.contentEn 
              }}
            />
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
