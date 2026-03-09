import path from 'path';
import { mkdir } from 'fs/promises';

export function getUploadDir() {
  // IMPORTANT: On shared hosting, deployments may clean the git working tree.
  // Configure UPLOAD_DIR in Plesk to point to a persistent directory.
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
}

export async function ensureUploadDir() {
  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });
  return dir;
}

export function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}
