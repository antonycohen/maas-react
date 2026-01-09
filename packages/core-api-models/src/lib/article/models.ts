import * as z from 'zod';
import { readImageSchema, updateImageSchema } from '../image';
import { readFolderRefSchema } from '../folder';
import { readIssueRefSchema } from '../issue';
import { readDocumentSchema, updateDocumentSchema } from '../document';
import { categoryRefSchema, readCategoryRefSchema } from '../category';
import { cmsBlockSchema, upsertCmsBlockSchema } from '../cms';
import { readUserRefSchema, userRefSchema } from '../users';
import {
  organizationRefSchema,
  readOrganizationRefSchema,
} from '../organizations';
import { articleTypeRefSchema, articleTypeSchema } from '../article-type';

// Video schema for custom fields (based on VideoDto)
export const videoSchema = z.object({
  url: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  height: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
});

export type Video = z.infer<typeof videoSchema>;

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

// Reference schema for article (for reads/display)
export const readArticleRefSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
});

export type ReadArticleRef = z.infer<typeof readArticleRefSchema>;

// Custom fields schema (dynamic key-value pairs based on article type)
// Using z.unknown() for values since custom fields are dynamic and
// their structure depends on the article type definition
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
  createdAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime().nullable(),
});

export type Article = z.infer<typeof articleSchema>;

// Schema for creating an article
export const createArticleSchema = z.object({
  organization: organizationRefSchema,
  title: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  content: z.array(upsertCmsBlockSchema).nullable().optional(),
  author: userRefSchema.nullable().optional(),
  featuredImage: updateImageSchema.nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  pdf: updateDocumentSchema.nullable().optional(),
  keywords: z.array(z.string().max(500)).nullable(),
  type: articleTypeRefSchema.nullable().refine((data) => data?.id, {
    message: 'Please select an article type',
  }),
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
  content: z.array(upsertCmsBlockSchema).nullable().optional(),
  author: userRefSchema.nullable().optional(),
  featuredImage: updateImageSchema.nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  pdf: updateDocumentSchema.nullable().optional(),
  keywords: z.array(z.string().max(500)).nullable(),
  type: articleTypeRefSchema.nullable().refine((data) => data?.id, {
    message: 'Please select an article type',
  }),
  visibility: z.string().max(50).nullable().optional(),
  customFields: articleCustomFieldsSchema.nullable().optional(),
  publishedAt: z.string().nullable().optional(), // ISO date string
  isPublished: z.boolean().optional(),
  tags: z.array(z.string()).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  categories: z.array(categoryRefSchema).nullable().optional(),
});

export type UpdateArticle = z.infer<typeof updateArticleSchema>;
