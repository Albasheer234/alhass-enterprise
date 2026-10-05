'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { logAction } from '@/lib/audit';
import { serviceSchema } from '@/lib/validation';
import { slugify } from '@/lib/utils';

export type FormState = { error?: string; success?: string };

async function requireAdmin() {
  const admin = await getSession();
  if (!admin) return { error: 'You must be logged in.' } as const;
  return { admin } as const;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || 'service';
  let candidate = root;
  let i = 2;
  for (;;) {
    const found = await prisma.service.findUnique({ where: { slug: candidate } });
    if (!found || found.id === excludeId) return candidate;
    candidate = `${root}-${i++}`;
  }
}

function parse(formData: FormData) {
  return serviceSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    icon: formData.get('icon'),
    isActive: formData.get('isActive') === 'on',
    displayOrder: formData.get('displayOrder') ?? 0,
  });
}

export async function createServiceAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdmin();
  if ('error' in auth) return auth;
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const svc = await prisma.service.create({
    data: { ...parsed.data, slug: await uniqueSlug(parsed.data.name) },
  });
  await logAction(auth.admin.id, 'SERVICE_CREATED', 'Service', svc.id, { name: svc.name });
  revalidatePath('/admin/services');
  return { success: 'Service created successfully.' };
}

export async function updateServiceAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdmin();
  if ('error' in auth) return auth;
  const id = String(formData.get('id') ?? '');
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { error: 'Service not found.' };
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  await prisma.service.update({
    where: { id },
    data: {
      ...parsed.data,
      slug: existing.name === parsed.data.name ? existing.slug : await uniqueSlug(parsed.data.name, id),
    },
  });
  await logAction(auth.admin.id, 'SERVICE_UPDATED', 'Service', id, { name: parsed.data.name });
  revalidatePath('/admin/services');
  return { success: 'Service updated successfully.' };
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const auth = await requireAdmin();
  if ('error' in auth) return;
  const id = String(formData.get('id') ?? '');
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.service.delete({ where: { id } });
  await logAction(auth.admin.id, 'SERVICE_DELETED', 'Service', id, { name: existing.name });
  revalidatePath('/admin/services');
}
