import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizePlainText, sanitizeRichText } from '@/lib/sanitize';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const excerptDe = sanitizePlainText(body.excerptDe || '');
    const excerptEn = sanitizePlainText(body.excerptEn || '');
    const contentDe = sanitizeRichText(body.contentDe || '');
    const contentEn = sanitizeRichText(body.contentEn || '');
    
    const post = await prisma.post.update({
      where: { id },
      data: {
        slug: body.slug,
        titleDe: body.titleDe,
        titleEn: body.titleEn,
        excerptDe,
        excerptEn,
        contentDe,
        contentEn,
        image: body.image || null,
        published: body.published || false
      }
    });
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
