import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizeRichText } from '@/lib/sanitize';

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const contentDe = sanitizeRichText(body.contentDe || '');
    const contentEn = sanitizeRichText(body.contentEn || '');
    
    const page = await prisma.page.create({
      data: {
        slug: body.slug,
        titleDe: body.titleDe,
        titleEn: body.titleEn,
        contentDe,
        contentEn,
        image: body.image || null,
        published: body.published || false
      }
    });
    
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
