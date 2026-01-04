import * as z from 'zod';
import { readOrganizationRefSchema } from '../organizations';
import { enumRefSchema, readEnumRefSchema } from '../enum';
import { categoryRefSchema, readCategoryRefSchema } from '../category';

// Field type enum
export const articleTypeFieldTypeSchema = z.enum([
  'enum',
  'string',
  'text',
  'number',
  'cms',
  'category',
  'image',
  'video',
]);

export type ArticleTypeFieldType = z.infer<typeof articleTypeFieldTypeSchema>;

// Schema for field validators
export const articleTypeFieldValidatorSchema = z.object({
  type: z.string(),
  value: z.unknown().optional(),
});

export type ArticleTypeFieldValidator = z.infer<
  typeof articleTypeFieldValidatorSchema
>;

// Schema for article type fields
export const articleTypeFieldSchema = z.object({
  label: z.string(),
  key: z.string(),
  type: articleTypeFieldTypeSchema,
  enum: readEnumRefSchema.nullable().optional(),
  category: readCategoryRefSchema.nullable().optional(),
  isList: z.boolean().nullable().optional(),
  validators: z.array(articleTypeFieldValidatorSchema).nullable().optional(),
});

export type ArticleTypeField = z.infer<typeof articleTypeFieldSchema>;

// Schema for creating/updating article type fields
export const articleTypeFieldInputSchema = z.object({
  label: z.string(),
  key: z.string(),
  type: articleTypeFieldTypeSchema,
  enum: enumRefSchema.nullable().optional(),
  category: categoryRefSchema.nullable().optional(),
  isList: z.boolean().nullable().optional(),
  validators: z.array(articleTypeFieldValidatorSchema).nullable().optional(),
});

export type ArticleTypeFieldInput = z.infer<typeof articleTypeFieldInputSchema>;

// Ref schemas for article type references
export const articleTypeRefSchema = z.object({
  id: z.string(),
});

export const readArticleTypeRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export type ArticleTypeRef = z.infer<typeof articleTypeRefSchema>;
export type ReadArticleTypeRef = z.infer<typeof readArticleTypeRefSchema>;

// Schema for reading an article type
export const articleTypeSchema = z.object({
  id: z.string(),
  name: z.string().max(255),
  fields: z.array(articleTypeFieldSchema).nullable(),
  isActive: z.boolean().nullable(),
});

export type ArticleType = z.infer<typeof articleTypeSchema>;

// Schema for creating an article type
export const createArticleTypeSchema = z.object({
  name: z.string().min(1).max(255),
  fields: z.array(articleTypeFieldInputSchema).nullable().optional(),
  isActive: z.boolean().optional(),
  organization: readOrganizationRefSchema.nullable(),
});

export type CreateArticleType = z.infer<typeof createArticleTypeSchema>;

// Schema for updating an article type
export const updateArticleTypeSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  fields: z.array(articleTypeFieldInputSchema).nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateArticleType = z.infer<typeof updateArticleTypeSchema>;
