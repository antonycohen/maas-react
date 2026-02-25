import * as z from 'zod';

export const invoiceStatusEnum = z.enum(['draft', 'open', 'paid', 'uncollectible', 'void']);
export type InvoiceStatus = z.infer<typeof invoiceStatusEnum>;

export const invoiceLineItemSchema = z.object({
    description: z.string().nullable(),
    quantity: z.number().nullable(),
    amount: z.number(),
});
export type InvoiceLineItem = z.infer<typeof invoiceLineItemSchema>;

export const invoiceSchema = z.object({
    id: z.string(),
    number: z.string().nullable(),
    status: invoiceStatusEnum.nullable(),
    amountDue: z.number(),
    amountPaid: z.number(),
    amountRemaining: z.number(),
    currency: z.string().nullable(),
    customerEmail: z.string().nullable(),
    subscriptionId: z.string().nullable(),
    hostedInvoiceUrl: z.string().nullable(),
    lineItems: z.array(invoiceLineItemSchema).nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    createdAt: z.string().nullable(),
});
export type Invoice = z.infer<typeof invoiceSchema>;

export const invoiceListResponseSchema = z.object({
    invoices: z.array(invoiceSchema),
});
export type InvoiceListResponse = z.infer<typeof invoiceListResponseSchema>;

export const invoicePayResponseSchema = z.object({
    paymentUrl: z.string(),
});
export type InvoicePayResponse = z.infer<typeof invoicePayResponseSchema>;
