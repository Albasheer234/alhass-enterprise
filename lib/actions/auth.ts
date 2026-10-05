'use server';

import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createSession, destroySession, getSession } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validation';
import { logAction } from '@/lib/audit';

export type AuthFormState = { error?: string };

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(`login:${ip}`, 10, 10 * 60 * 1000) ||
      !rateLimit(`login:${parsed.data.email}`, 5, 10 * 60 * 1000)) {
    return { error: 'Too many login attempts. Please try again in about 10 minutes.' };
  }

  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!valid) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(user.id);
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await logAction(user.id, 'ADMIN_LOGIN', 'AdminUser', user.id);

  redirect('/admin/dashboard');
}

export async function logoutAction(): Promise<void> {
  const admin = await getSession();
  if (admin) {
    await logAction(admin.id, 'ADMIN_LOGOUT', 'AdminUser', admin.id);
  }
  destroySession();
  redirect('/admin/login');
}

export async function getCsrfToken(): Promise<string> {
  // Signed CSRF token for state-changing admin forms
  const admin = await getSession();
  if (!admin) return '';
  const crypto = await import('node:crypto');
  const payload = `${admin.id}.${Date.now()}`;
  const sig = crypto.createHmac('sha256', process.env.AUTH_SECRET ?? '').update(payload).digest('base64url');
  cookies().set('alhass_csrf', `${payload}.${sig}`, { httpOnly: true, sameSite: 'lax', path: '/' });
  return sig;
}
