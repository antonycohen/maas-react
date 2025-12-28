import * as z from 'zod';

// Enums
export const organizationType = z.enum(['INDIVIDUAL', 'BUSINESS']);
export type OrganizationType = z.infer<typeof organizationType>;

// Nested schemas
export const referralCodeSchema = z.object({
  id: z.uuid(),
  referralCode: z.string(),
});
export type ReferralCode = z.infer<typeof referralCodeSchema>;

// 1. Reference schema with label field (for dropdowns, selects, links)
export const readOrganizationRefSchema = z.object({
  id: z.uuid(),
  name: z.string().optional(),
});
export type ReadOrganizationRef = z.infer<typeof readOrganizationRefSchema>;

// 2. Minimal reference schema (for foreign keys)
export const organizationRefSchema = z.object({
  id: z.uuid(),
});
export type OrganizationRef = z.infer<typeof organizationRefSchema>;

// 3. Read schema - all properties nullable (API response)
export const readOrganizationSchema = z.object({
  id: z.uuid().nullable(),
  name: z.string().nullable(),
  type: organizationType.nullable(),
  createdAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime().nullable(),
  lastReferralCode: referralCodeSchema.nullable(),
});
export type ReadOrganization = z.infer<typeof readOrganizationSchema>;

// 4. Create schema - based on DTO serialization groups
export const createOrganizationSchema = z.object({
  name: z.string(),
  type: organizationType,
});
export type CreateOrganization = z.infer<typeof createOrganizationSchema>;

// 5. Update schema - based on DTO serialization groups
export const updateOrganizationSchema = createOrganizationSchema.partial();
export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;

// Legacy export for backward compatibility
export const organizationSchema = readOrganizationSchema;
export type Organization = ReadOrganization;
