import { z } from 'zod';

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const clientSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  contact_person: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone_number: z.string()
    .regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number')
    .optional().or(z.literal('')),
  pan_number: z.string()
    .regex(panRegex, 'PAN must be in format: AAAAA9999A')
    .optional().or(z.literal('')),
  gstin: z.string()
    .regex(gstinRegex, 'Invalid GSTIN format')
    .optional().or(z.literal('')),
  address: z.string().optional(),
  state_code: z.string().length(2).optional().or(z.literal('')),
  client_status: z.enum(['active', 'inactive', 'onboarding']),
});

export const staffSchema = z.object({
  full_name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  phone_number: z.string().optional(),
  role: z.enum(['Admin', 'Manager', 'Article Assistant', 'Junior Auditor']),
});

export const onboardingSchema = z.object({
  firm_name: z.string().min(2, 'Firm name is required'),
  firm_email: z.string().email(),
  firm_phone: z.string().optional(),
  gstin: z.string().regex(gstinRegex, 'Invalid GSTIN format')
    .optional().or(z.literal('')),
  firm_address: z.string().optional(),
  contact_name: z.string().min(2, 'Your name is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type StaffFormData = z.infer<typeof staffSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
