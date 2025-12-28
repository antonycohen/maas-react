import * as z from 'zod';
import { readOrganizationRefSchema } from '../organizations';

// Schema for enum value items
export const enumValueSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type EnumValue = z.infer<typeof enumValueSchema>;

// Schema for reading an enum
export const enumSchema = z.object({
  id: z.string(),
  name: z.string().max(255),
  values: z.array(enumValueSchema).nullable(),
});

export type Enum = z.infer<typeof enumSchema>;

// Schema for creating an enum
export const createEnumSchema = z.object({
  name: z.string().min(1).max(255),
  values: z.array(enumValueSchema),
  organization: readOrganizationRefSchema.nullable()
});

export type CreateEnum = z.infer<typeof createEnumSchema>;

// Schema for updating an enum
export const updateEnumSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  values: z.array(enumValueSchema).optional(),
});

export type UpdateEnum = z.infer<typeof updateEnumSchema>;
