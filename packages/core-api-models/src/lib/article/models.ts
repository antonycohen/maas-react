import * as z from 'zod';
import { readImageSchema, updateImageSchema } from '../image';
import { readFolderRefSchema, folderRefSchema } from '../folder';
import { readIssueRefSchema, issueRefSchema } from '../issue';
import { readDocumentSchema, updateDocumentSchema } from '../document';
import { readCategoryRefSchema } from '../category';
import { cmsBlockSchema } from '../cms';

// User reference schema for author
export const userRefSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

export type UserRef = z.infer<typeof userRefSchema>;

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

// Full article schema for read operations
export const articleSchema = z.object({
  id: z.string(),
  issue: readIssueRefSchema.nullable(),
  folder: readFolderRefSchema.nullable(),
  title: z.string().max(255),
  description: z.string().max(5000).nullable(),
  content: z.array(cmsBlockSchema).nullable(),
  author: userRefSchema.nullable(),
  featuredImage: z.object(readImageSchema).nullable(),
  cover: z.object(readImageSchema).nullable(),
  pdf: z.object(readDocumentSchema).nullable(),
  keywords: z.string().max(500).nullable(),
  type: z.string().max(50).nullable(),
  visibility: z.string().max(50).nullable(),
  position: z.number().int().min(0).nullable(),
  publishedAt: z.string().nullable(), // ISO date string
  isPublished: z.boolean().nullable(),
  isFeatured: z.boolean().nullable(),
  tags: z.array(tagSchema).nullable(),
  viewCount: z.number().nullable(),
  likeCount: z.number().nullable(),
  categories: z.array(readCategoryRefSchema).nullable(),
});

export type Article = z.infer<typeof articleSchema>;

// Schema for creating an article
export const createArticleSchema = z.object({
  issue: issueRefSchema,
  folder: folderRefSchema.nullable().optional(),
  title: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  content: z.array(cmsBlockSchema).nullable().optional(),
  author: z.string().nullable().optional(), // user ID
  featuredImage: updateImageSchema.nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  pdf: updateDocumentSchema.nullable().optional(),
  keywords: z.string().max(500).nullable().optional(),
  type: z.string().max(50).nullable().optional(),
  visibility: z.string().max(50).nullable().optional(),
  position: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).nullable().optional(), // tag IDs
  categories: z.array(z.string()).nullable().optional(), // category IDs
});

export type CreateArticle = z.infer<typeof createArticleSchema>;

// Schema for updating an article
export const updateArticleSchema = z.object({
  folder: folderRefSchema.nullable().optional(),
  title: z.string().max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  content: z.array(cmsBlockSchema).nullable().optional(),
  author: z.string().nullable().optional(), // user ID
  featuredImage: updateImageSchema.nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  pdf: updateDocumentSchema.nullable().optional(),
  keywords: z.string().max(500).nullable().optional(),
  type: z.string().max(50).nullable().optional(),
  visibility: z.string().max(50).nullable().optional(),
  position: z.number().int().min(0).optional(),
  publishedAt: z.string().nullable().optional(), // ISO date string
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).nullable().optional(), // tag IDs
  categories: z.array(z.string()).nullable().optional(), // category IDs
});

export type UpdateArticle = z.infer<typeof updateArticleSchema>;
