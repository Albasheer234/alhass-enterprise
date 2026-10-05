'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { logAction } from '@/lib/audit';
import { productSchema } from '@/lib/validation';
import { saveProductImage } from '@/lib/upload';
import { slugify } from '@/lib/utils';

export type FormState = { error?: string; success?: string };

async function requireAdmin() {
  const admin = await getSession();
  if (!admin) return { error: 'You must be logged in.' } as const;
  return { admin } as const;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base) || 'product';
  let candidate = slug;
  let i = 2;
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    if (excludeId) {
      const existing = await prisma.product.findUnique({ where: { slug: candidate } });
      if (existing?.id === excludeId) return candidate;
    }
    candidate = `${slug}-${i++}`;
  }
  return candidate;
}

export async function createProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdmin();
  if ('error' in auth) return auth;

  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    categoryId: formData.get('categoryId'),
    description: formData.get('description'),
    isFeatured: formData.get('isFeatured') === 'on',
    isPublished: formData.get('isPublished') === 'on',
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return { error: 'Selected category does not exist.' };

  let imageUrl: string | null = null;
  const image = formData.get('image');
  if (image instanceof File && image.size > 0) {
    try {
      imageUrl = await saveProductImage(image);
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Image upload failed.' };
    }
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      slug: await uniqueSlug(parsed.data.name),
      imageUrl,
    },
  });
  await logAction(auth.admin.id, 'PRODUCT_CREATED', 'Product', product.id, { name: product.name });
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { success: 'Product created successfully.' };
}

export async function updateProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdmin();
  if ('error' in auth) return auth;

  const id = String(formData.get('id') ?? '');
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { error: 'Product not found.' };

  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    categoryId: formData.get('categoryId'),
    description: formData.get('description'),
    isFeatured: formData.get('isFeatured') === 'on',
    isPublished: formData.get('isPublished') === 'on',
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return { error: 'Selected category does not exist.' };

  let imageUrl = existing.imageUrl;
  const image = formData.get('image');
  if (image instanceof File && image.size > 0) {
    try {
      imageUrl = await saveProductImage(image);
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Image upload failed.' };
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      slug: existing.name === parsed.data.name ? existing.slug : await uniqueSlug(parsed.data.name, id),
      imageUrl,
    },
  });
  await logAction(auth.admin.id, 'PRODUCT_UPDATED', 'Product', id, { name: parsed.data.name });
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath(`/shop/${existing.slug}`);
  return { success: 'Product updated successfully.' };
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const auth = await requireAdmin();
  if ('error' in auth) return;
  const id = String(formData.get('id') ?? '');
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.product.delete({ where: { id } });
  await logAction(auth.admin.id, 'PRODUCT_DELETED', 'Product', id, { name: existing.name });
  revalidatePath('/admin/products');
  revalidatePath('/shop');
}
