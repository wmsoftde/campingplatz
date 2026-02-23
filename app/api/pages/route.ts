import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      where: { published: true },
      select: {
        slug: true,
        titleDe: true,
        titleEn: true
      }
    });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
