import { getTranslations } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <Navigation locale={locale} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-primary-light py-20">
          <div className="container-custom">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
              {t('title')}
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container-custom">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t('noPosts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="card">
                    {post.image && (
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={locale === 'de' ? post.titleDe : post.titleEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(post.createdAt).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <h2 className="font-heading text-xl font-bold text-primary mb-3">
                        {locale === 'de' ? post.titleDe : post.titleEn}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {locale === 'de' ? post.excerptDe : post.excerptEn}
                      </p>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {t('readMore')} →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
