import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'default' }
    });
    
    if (!settings) {
      const newSettings = await prisma.settings.create({
        data: { id: 'default' }
      });
      return NextResponse.json(newSettings, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
    
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // Remove id from body to avoid prisma issues if it's passed differently
    const { id, ...data } = body;
    
    const settings = await prisma.settings.upsert({
      where: { id: 'default' },
      update: data,
      create: { ...data, id: 'default' }
    });
    
    // Revalidate multiple paths
    revalidatePath('/', 'layout');
    revalidatePath('/[locale]/prices', 'page');
    revalidatePath('/[locale]/contact', 'page');
    revalidatePath('/de/prices', 'page');
    revalidatePath('/en/prices', 'page');
    revalidatePath('/de/contact', 'page');
    revalidatePath('/en/contact', 'page');
    revalidatePath('/de', 'page');
    revalidatePath('/en', 'page');
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
