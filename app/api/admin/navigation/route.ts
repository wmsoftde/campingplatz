import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const links = await prisma.navLink.findMany({
      orderBy: { position: 'asc' },
      include: { children: true }
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const link = await prisma.navLink.create({
      data: {
        labelDe: body.labelDe,
        labelEn: body.labelEn || '',
        url: body.url,
        position: body.position || 0,
        location: body.location || 'navbar',
        parentId: body.parentId || null
      }
    });
    
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating navigation link:', error);
    return NextResponse.json({ error: 'Failed to create navigation link' }, { status: 500 });
  }
}
