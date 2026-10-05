'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { logAction } from '@/lib/audit';
import { categorySchema } from '@/lib/validation';
import { slugify } from '@/lib/utils';

export type FormState = { error?: string; success?: string };

async function requireAdmin() {
  const admin = await getSession();
  if (!admin) return { error: 'You must be logged in.' } as const;
  return { admin } as const;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || 'category';
  let candidate = root;
  let i = 2;
  for (;;) {
    const found = await prisma.category.findUnique({ where: { slug: candidate } });
    if (!found || found.id === excludeId) return candidate;
    candidate = `${root}-${i++}`;
  }
}

export async function createCategoryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdmin();
  if ('error' in auth) return auth;
  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    isActive: formData.get('isActive') === 'on',
    displayOrder: formData.get('displayOrder') ?? 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };

  const cat = await prisma.category.create({
    data: { ...parsed.data, slug: await uniqueSlug(parsed.data.name) },
  });
  await logAction(auth.admin.id, 'CATEGORY_CREATED', 'Category', cat.id, { name: cat.name });
  revalidatePath('/admin/categories');
  return { success: 'Category created successfully.' };
}

export async function updateCategoryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdmin();
  if ('error' in auth) return auth;
  const id = String(formData.get('id') ?? '');
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return { error: 'Category not found.' };

  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    isActive: formData.get('isActive') === 'on',
    displayOrder: formData.get('displayOrder') ?? 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };

  await prisma.category.update({
    where: { id },
    data: {
      ...parsed.data,
      slug: existing.name === parsed.data.name ? existing.slug : await uniqueSlug(parsed.data.name, id),
    },
  });
  await logAction(auth.admin.id, 'CATEGORY_UPDATED', 'Category', id, { name: parsed.data.name });
  revalidatePath('/admin/categories');
  return { success: 'Category updated successfully.' };
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const auth = await requireAdmin();
  if ('error' in auth) return;
  const id = String(formData.get('id') ?? '');
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return;
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.category.delete({ where: { id } });
  await logAction(auth.admin.id, 'CATEGORY_DELETED', 'Category', id, { name: existing.name });
  revalidatePath('/admin/categories');
}
