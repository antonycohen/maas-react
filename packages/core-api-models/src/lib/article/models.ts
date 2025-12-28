import * as z from 'zod';
import { readImageSchema, updateImageSchema } from '../image';
import { readFolderRefSchema } from '../folder';
import { readIssueRefSchema } from '../issue';
import { readDocumentSchema, updateDocumentSchema } from '../document';
import { categoryRefSchema, readCategoryRefSchema } from '../category';
import { cmsBlockSchema } from '../cms';
import { readUserRefSchema, userRefSchema } from '../users';
import {
  organizationRefSchema,
  readOrganizationRefSchema,
} from '../organizations';
import { articleTypeRefSchema, articleTypeSchema } from '../article-type';

// Tag schema
export const tagSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export type Tag = z.infer<typeof tagSchema>;

// Reference schema for article (for writes/updates)
export const articleRefSchema = z.object({
  id: z.string(),
});

export type ArticleRef = z.infer<typeof articleRefSchema>;

// Custom fields schema (dynamic key-value pairs based on article type)
export const articleCustomFieldsSchema = z.record(z.string(), z.unknown());

export type ArticleCustomFields = z.infer<typeof articleCustomFieldsSchema>;

// Full article schema for read operations
export const articleSchema = z.object({
  id: z.string(),
  issues: z.array(readIssueRefSchema).nullable(),
  organization: readOrganizationRefSchema.nullable(),
  folders: z.array(readFolderRefSchema).nullable(),
  title: z.string().max(255),
  description: z.string().max(5000).nullable(),
  content: z.array(cmsBlockSchema).nullable(),
  author: readUserRefSchema.nullable(),
  featuredImage: z.object(readImageSchema).nullable(),
  cover: z.object(readImageSchema).nullable(),
  pdf: z.object(readDocumentSchema).nullable(),
  keywords: z.array(z.string().max(500)).nullable(),
  type: articleTypeSchema.nullable(),
  visibility: z.string().max(50).nullable(),
  customFields: articleCustomFieldsSchema.nullable(),
  publishedAt: z.string().nullable(), // ISO date string
  isPublished: z.boolean().nullable(),
  tags: z.array(tagSchema).nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  viewCount: z.number().nullable(),
  likeCount: z.number().nullable(),
  categories: z.array(readCategoryRefSchema).nullable(),
});

export type Article = z.infer<typeof articleSchema>;

// Schema for creating an article
export const createArticleSchema = z.object({
  organization: organizationRefSchema,
  title: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  content: z.array(cmsBlockSchema).nullable().optional(),
  author: userRefSchema.nullable().optional(),
  featuredImage: updateImageSchema.nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  pdf: updateDocumentSchema.nullable().optional(),
  keywords: z.array(z.string().max(500)).nullable(),
  type: articleTypeRefSchema.nullable().optional(),
  visibility: z.string().max(50).nullable().optional(),
  customFields: articleCustomFieldsSchema.nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  categories: z.array(categoryRefSchema).nullable().optional(),
});

export type CreateArticle = z.infer<typeof createArticleSchema>;

// Schema for updating an article
export const updateArticleSchema = z.object({
  title: z.string().max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  content: z.array(cmsBlockSchema).nullable().optional(),
  author: userRefSchema.nullable().optional(),
  featuredImage: updateImageSchema.nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  pdf: updateDocumentSchema.nullable().optional(),
  keywords: z.array(z.string().max(500)).nullable(),
  type: articleTypeRefSchema.nullable().optional(),
  visibility: z.string().max(50).nullable().optional(),
  customFields: articleCustomFieldsSchema.nullable().optional(),
  publishedAt: z.string().nullable().optional(), // ISO date string
  isPublished: z.boolean().optional(),
  tags: z.array(z.string()).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  categories: z.array(categoryRefSchema).nullable().optional(),
});

export type UpdateArticle = z.infer<typeof updateArticleSchema>;
