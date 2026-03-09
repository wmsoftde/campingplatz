import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { ensureUploadDir, getUploadDir, safeFilename } from '@/lib/uploads';

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `${Date.now()}-${safeFilename(file.name)}`;
    const uploadDir = await ensureUploadDir();
    
    await writeFile(path.join(uploadDir, filename), buffer);
    
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        // Use API route so it works even if nginx doesn't serve /uploads
        path: `/api/uploads/${filename}`
      }
    });
    
    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await prisma.media.findUnique({ where: { id } });
    
    if (!media) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const uploadDir = getUploadDir();
    const rel = (media.path || '').replace(/^\/+/, '');
    const fileName = rel.split('/').pop() || '';
    const filePath = path.join(uploadDir, fileName);
    
    try {
      await unlink(filePath);
    } catch {
      console.warn('File not found on disk:', filePath);
    }
    
    await prisma.media.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
