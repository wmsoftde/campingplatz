import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import { getUploadDir } from '@/lib/uploads';

function getMime(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return map[ext] || 'application/octet-stream';
}

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeName = decodeURIComponent(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  const uploadDir = getUploadDir();
  const filePath = path.join(uploadDir, safeName);

  if (!filePath.startsWith(path.resolve(uploadDir))) {
    return new NextResponse('Bad request', { status: 400 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const stream = fs.createReadStream(filePath);
  // Convert Node stream to Web stream
  const body = Readable.toWeb(stream) as unknown as ReadableStream;

  return new NextResponse(body, {
    headers: {
      'Content-Type': getMime(filePath),
      // Safe caching for images; filename is unique (timestamp-prefixed)
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
