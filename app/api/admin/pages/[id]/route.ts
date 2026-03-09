import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizeRichText } from '@/lib/sanitize';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const contentDe = sanitizeRichText(body.contentDe || '');
    const contentEn = sanitizeRichText(body.contentEn || '');
    
    const page = await prisma.page.update({
      where: { id },
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
    
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
