'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { logAction } from '@/lib/audit';
import { paymentAccountSchema } from '@/lib/validation';

export type FormState = { error?: string; success?: string };

async function requireAdmin() {
  const admin = await getSession();
  if (!admin) return { error: 'You must be logged in.' } as const;
  return { admin } as const;
}

function parse(formData: FormData) {
  return paymentAccountSchema.safeParse({
    provider: formData.get('provider'),
    accountName: formData.get('accountName'),
    accountNumber: formData.get('accountNumber'),
    isActive: formData.get('isActive') === 'on',
    displayOrder: formData.get('displayOrder') ?? 0,
  });
}

export async function createPaymentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdmin();
  if ('error' in auth) return auth;
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const acct = await prisma.paymentAccount.create({ data: parsed.data });
  await logAction(auth.admin.id, 'PAYMENT_CREATED', 'PaymentAccount', acct.id, {
    provider: acct.provider,
  });
  revalidatePath('/admin/payments');
  return { success: 'Payment account added.' };
}

export async function updatePaymentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdmin();
  if ('error' in auth) return auth;
  const id = String(formData.get('id') ?? '');
  if (!(await prisma.paymentAccount.findUnique({ where: { id } }))) {
    return { error: 'Payment account not found.' };
  }
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  await prisma.paymentAccount.update({ where: { id }, data: parsed.data });
  await logAction(auth.admin.id, 'PAYMENT_UPDATED', 'PaymentAccount', id, {
    provider: parsed.data.provider,
  });
  revalidatePath('/admin/payments');
  return { success: 'Payment account updated.' };
}

export async function deletePaymentAction(formData: FormData): Promise<void> {
  const auth = await requireAdmin();
  if ('error' in auth) return;
  const id = String(formData.get('id') ?? '');
  const existing = await prisma.paymentAccount.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.paymentAccount.delete({ where: { id } });
  await logAction(auth.admin.id, 'PAYMENT_DELETED', 'PaymentAccount', id, {
    provider: existing.provider,
  });
  revalidatePath('/admin/payments');
}
