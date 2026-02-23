import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const links = await prisma.navLink.findMany({
      orderBy: { position: 'asc' }
    });

    const navbar = links.filter(l => l.location === 'navbar');
    const footer = links.filter(l => l.location === 'footer');

    return NextResponse.json({
      navbar,
      footer
    });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json({ navbar: [], footer: [] });
  }
}
