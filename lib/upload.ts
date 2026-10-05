import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_HERO_SIZE = 6 * 1024 * 1024; // 6 MB — hero images may be larger

/**
 * Validates and stores a product image upload.
 * Returns the public URL path, or throws with a user-safe message.
 */
export async function saveProductImage(file: File): Promise<string> {
  if (!ALLOWED_MIME[file.type]) {
    throw new Error('Only JPG, PNG, WEBP, GIF or SVG images are allowed.');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Image is too large. Maximum size is 2MB.');
  }
  // Extra safety: never trust the extension, derive it from the MIME type
  const ext = ALLOWED_MIME[file.type];
  const name = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;

  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());

  // Reject SVGs containing script tags (SVG can carry JS)
  if (ext === '.svg' && /\<script[\s>]/i.test(buffer.toString('utf8'))) {
    throw new Error('SVG files with embedded scripts are not allowed.');
  }

  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}

/**
 * Validates and stores a hero background image.
 * Saved to public/uploads/hero/. Returns the public URL path.
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
  const name = `hero-${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', 'hero');
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/hero/${name}`;
}
