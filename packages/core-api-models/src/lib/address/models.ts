import * as z from 'zod';

export const addressSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    line1: z.string(),
    line2: z.string().nullable().optional(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
});

export type Address = z.infer<typeof addressSchema>;

export const createAddressSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().nullable().optional(),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(2, 'Country is required').max(2, 'Use ISO 3166-1 alpha-2 country code'),
});

export type CreateAddress = z.infer<typeof createAddressSchema>;
