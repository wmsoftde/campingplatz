import { getTranslations } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const post = await prisma.post.findUnique({
    where: { slug, published: true }
  });

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navigation locale={locale} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-primary-light py-12">
          <div className="container-custom">
            <Link 
              href={`/${locale}/blog`}
              className="text-white/80 hover:text-white mb-4 inline-block"
            >
              ← {t('title')}
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">
              {locale === 'de' ? post.titleDe : post.titleEn}
            </h1>
            <p className="text-white/80 mt-2">
              {new Date(post.createdAt).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom">
            <article className="max-w-3xl mx-auto">
              {post.image && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={locale === 'de' ? post.titleDe : post.titleEn}
                    className="w-full h-auto"
                  />
                </div>
              )}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: locale === 'de' ? post.contentDe : post.contentEn 
                }}
              />
            </article>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
