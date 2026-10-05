'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { logAction } from '@/lib/audit';
import { settingsSchema } from '@/lib/validation';
import { saveHeroImage } from '@/lib/upload';

export type FormState = { error?: string; success?: string };

const SETTING_KEYS = [
  'business_name',
  'tagline',
  'address',
  'whatsapp_number',
  'contact_2',
  'contact_3',
  'email',
  'business_description',
] as const;

export async function updateSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await getSession();
  if (!admin) return { error: 'You must be logged in.' };

  const raw: Record<string, string> = {};
  for (const key of SETTING_KEYS) raw[key] = String(formData.get(key) ?? '');

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };

  for (const key of SETTING_KEYS) {
    const val = parsed.data[key] ?? '';
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: val },
      create: { key, value: val },
    });
  }
  await logAction(admin.id, 'SETTINGS_UPDATED', 'SiteSetting', undefined, {
    keys: SETTING_KEYS,
  });
  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/contact');
  return { success: 'Settings saved.' };
}

/** Handles hero background image upload separately (multipart form). */
export async function updateHeroBgAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await getSession();
  if (!admin) return { error: 'You must be logged in.' };

  const action = String(formData.get('_action') ?? 'upload');

  if (action === 'remove') {
    // Clear the stored URL — hero falls back to gradient
    await prisma.siteSetting.upsert({
      where: { key: 'hero_bg_image' },
      update: { value: '' },
      create: { key: 'hero_bg_image', value: '' },
    });
    await logAction(admin.id, 'SETTINGS_UPDATED', 'SiteSetting', undefined, { keys: ['hero_bg_image'] });
    revalidatePath('/admin/settings');
    revalidatePath('/');
    return { success: 'Hero background removed.' };
  }

  const file = formData.get('hero_bg_image');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Please select an image file to upload.' };
  }

  let url: string;
  try {
    url = await saveHeroImage(file);
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload failed.' };
  }

  await prisma.siteSetting.upsert({
    where: { key: 'hero_bg_image' },
    update: { value: url },
    create: { key: 'hero_bg_image', value: url },
  });
  await logAction(admin.id, 'SETTINGS_UPDATED', 'SiteSetting', undefined, { keys: ['hero_bg_image'] });
  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { success: 'Hero background updated.' };
}
