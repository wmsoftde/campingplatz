import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const link = await prisma.navLink.update({
      where: { id },
      data: {
        labelDe: body.labelDe,
        labelEn: body.labelEn || '',
        url: body.url,
        position: body.position || 0,
        location: body.location || 'navbar',
        parentId: body.parentId || null
      }
    });
    
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update navigation link' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.navLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete navigation link' }, { status: 500 });
  }
}
