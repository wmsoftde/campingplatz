import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const post = await prisma.post.create({
      data: {
        slug: body.slug,
        titleDe: body.titleDe,
        titleEn: body.titleEn,
        excerptDe: body.excerptDe || '',
        excerptEn: body.excerptEn || '',
        contentDe: body.contentDe || '',
        contentEn: body.contentEn || '',
        image: body.image || null,
        published: body.published || false
      }
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
