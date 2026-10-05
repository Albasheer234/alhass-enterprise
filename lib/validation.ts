import { z } from 'zod';

const phoneRegex = /^[0-9+\s()-]{7,20}$/;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters').max(120),
  categoryId: z.string().min(1, 'Please select a category'),
  description: z.string().trim().min(5, 'Description must be at least 5 characters').max(2000),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Category name must be at least 2 characters').max(80),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(1000),
  icon: z.string().trim().max(40).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const paymentAccountSchema = z.object({
  provider: z.string().trim().min(2, 'Provider is required').max(60),
  accountName: z.string().trim().min(2, 'Account name is required').max(120),
  accountNumber: z.string().trim().regex(/^[0-9]{6,20}$/, 'Enter a valid account number (digits only)'),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const settingsSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().max(160),
  address: z.string().trim().max(300),
  whatsapp_number: z.string().trim().regex(phoneRegex, 'Enter a valid WhatsApp number'),
  contact_2: z.string().trim().max(30).optional().or(z.literal('')),
  contact_3: z.string().trim().max(30).optional().or(z.literal('')),
  email: z.string().trim().email('Enter a valid email address').optional().or(z.literal('')),
  business_description: z.string().trim().max(2000),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type PaymentAccountInput = z.infer<typeof paymentAccountSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
