import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { prisma } from './prisma';

const COOKIE_NAME = 'alhass_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

type SessionPayload = { adminId: string; exp: number };

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error('AUTH_SECRET is missing or too short. Set it in .env');
  }
  return s;
}

function sign(data: string): string {
  return crypto.createHmac('sha256', secret()).update(data).digest('base64url');
}

export async function createSession(adminId: string): Promise<void> {
  const payload: SessionPayload = { adminId, exp: Date.now() + SESSION_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  cookies().set(COOKIE_NAME, `${body}.${sign(body)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export const getSession = cache(async () => {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot <= 0) return null;
  const body = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(body);
  // Constant-time comparison to prevent timing attacks
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload;
    if (!payload.adminId || typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return null;
    }
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.adminId },
      select: { id: true, name: true, email: true, role: true },
    });
    return admin;
  } catch {
    return null;
  }
});

export async function requireAdmin() {
  const admin = await getSession();
  if (!admin) redirect('/admin/login');
  return admin;
}

export function destroySession(): void {
  cookies().delete(COOKIE_NAME);
}
