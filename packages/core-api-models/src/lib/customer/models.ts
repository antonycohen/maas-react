import * as z from 'zod';
import { readOrganizationRefSchema } from '../organizations';
import { readUserRefSchema } from '../users';

// Enums
export const taxExemptEnum = z.enum(['none', 'exempt', 'reverse']);
export type TaxExempt = z.infer<typeof taxExemptEnum>;

// Nested schemas
export const taxIdSchema = z.object({
    type: z.string(),
    value: z.string(),
});
export type TaxId = z.infer<typeof taxIdSchema>;

// 1. Minimal reference schema (for foreign keys)
export const customerRefSchema = z.object({
    id: z.string(),
});
export type CustomerRef = z.infer<typeof customerRefSchema>;

// 2. Reference schema with label fields (for dropdowns, selects, links)
export const readCustomerRefSchema = z.object({
    id: z.string(),
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    refId: z.string().nullable().optional(),
});
export type ReadCustomerRef = z.infer<typeof readCustomerRefSchema>;

// 3. Read schema - full API response
export const readCustomerSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    description: z.string().nullable(),
    addressLine1: z.string().nullable(),
    addressLine2: z.string().nullable(),
    addressCity: z.string().nullable(),
    addressState: z.string().nullable(),
    addressPostalCode: z.string().nullable(),
    addressCountry: z.string().nullable(),
    currency: z.string().nullable(),
    balance: z.number().nullable(),
    taxExempt: taxExemptEnum.nullable(),
    taxIds: z.array(taxIdSchema).nullable(),
    invoicePrefix: z.string().nullable(),
    invoiceSettings: z.record(z.string(), z.unknown()).nullable(),
    nextInvoiceSequence: z.number().nullable(),
    defaultPaymentMethodId: z.string().nullable(),
    delinquent: z.boolean().nullable(),
    refType: z.string().nullable(),
    refId: z.string().nullable(),
    organization: readOrganizationRefSchema.nullable().optional(),
    user: readUserRefSchema.nullable().optional(),
    preferredLocales: z.array(z.string()).nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});
export type ReadCustomer = z.infer<typeof readCustomerSchema>;

// 4. Create schema
export const createCustomerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    addressLine1: z.string().nullable().optional(),
    addressLine2: z.string().nullable().optional(),
    addressCity: z.string().nullable().optional(),
    addressState: z.string().nullable().optional(),
    addressPostalCode: z.string().nullable().optional(),
    addressCountry: z.string().nullable().optional(),
    currency: z.string().optional(),
    taxExempt: taxExemptEnum.optional(),
    taxIds: z.array(taxIdSchema).nullable().optional(),
    invoicePrefix: z.string().nullable().optional(),
    invoiceSettings: z.record(z.string(), z.unknown()).nullable().optional(),
    defaultPaymentMethodId: z.string().nullable().optional(),
    refType: z.string().nullable().optional(),
    refId: z.string().nullable().optional(),
    preferredLocales: z.array(z.string()).nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});
export type CreateCustomer = z.infer<typeof createCustomerSchema>;

// 5. Update schema
export const updateCustomerSchema = createCustomerSchema.partial();
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;

// Legacy exports
export const customerSchema = readCustomerSchema;
export type Customer = ReadCustomer;
