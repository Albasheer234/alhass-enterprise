import { randomBytes } from 'node:crypto';
import path from 'node:path';

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_HERO_SIZE = 6 * 1024 * 1024; // 6 MB

// Check if we're running on Vercel (read-only filesystem)
const isVercel = !!process.env.VERCEL || !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Validates and stores a product image upload.
 * Uses Vercel Blob in production, local filesystem in development.
 * Returns the public URL path, or throws with a user-safe message.
 */
export async function saveProductImage(file: File): Promise<string> {
  if (!ALLOWED_MIME[file.type]) {
    throw new Error('Only JPG, PNG, WEBP, GIF or SVG images are allowed.');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Image is too large. Maximum size is 2MB.');
  }

  const ext = ALLOWED_MIME[file.type];
  const name = `products/${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Reject SVGs containing script tags
  if (ext === '.svg' && /<script[\s>]/i.test(buffer.toString('utf8'))) {
    throw new Error('SVG files with embedded scripts are not allowed.');
  }

  if (isVercel) {
    // Use Vercel Blob in production
    const { put } = await import('@vercel/blob');
    const blob = await put(name, buffer, {
      access: 'public',
      contentType: file.type,
    });
    return blob.url;
  } else {
    // Use local filesystem in development
    const { mkdir, writeFile } = await import('node:fs/promises');
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    const filename = path.basename(name);
    await writeFile(path.join(dir, filename), buffer);
    return `/uploads/${filename}`;
  }
}

/**
 * Validates and stores a hero background image.
 * Uses Vercel Blob in production, local filesystem in development.
 * Returns the public URL.
 */
export async function saveHeroImage(file: File): Promise<string> {
  const allowed: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  if (!allowed[file.type]) {
    throw new Error('Hero background must be a JPG, PNG or WEBP image.');
  }
  if (file.size > MAX_HERO_SIZE) {
    throw new Error('Hero image is too large. Maximum size is 6 MB.');
  }

  const ext = allowed[file.type];
  const name = `hero/hero-${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isVercel) {
    // Use Vercel Blob in production
    const { put } = await import('@vercel/blob');
    const blob = await put(name, buffer, {
      access: 'public',
      contentType: file.type,
    });
    return blob.url;
  } else {
    // Use local filesystem in development
    const { mkdir, writeFile } = await import('node:fs/promises');
    const dir = path.join(process.cwd(), 'public', 'uploads', 'hero');
    await mkdir(dir, { recursive: true });
    const filename = path.basename(name);
    await writeFile(path.join(dir, filename), buffer);
    return `/uploads/hero/${filename}`;
  }
}
