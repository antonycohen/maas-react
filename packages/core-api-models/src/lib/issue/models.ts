import * as z from 'zod';
import { readImageSchema, updateImageSchema } from '../image';
import { brandRefSchema, readBrandRefSchema } from '../brand';
import { folderSchema } from '../folder';
import { readDocumentSchema, updateDocumentSchema } from '../document';
import { articleRefSchema } from '../article';

// Schema for folder with articles (used in issue create/update)
export const issueFolderRefSchema = z.object({
  id: z.string(),
  articles: z.array(z.lazy(() => articleRefSchema)).nullable().optional(),
});

export type IssueFolderRef = z.infer<typeof issueFolderRefSchema>;

export const readIssueRefSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
});

export const issueRefSchema = z.object({
  id: z.string(),
});

export type ReadIssueRef = z.infer<typeof readIssueRefSchema>;

// Full issue schema for read operations
export const issueSchema = z.object({
  id: z.string(),
  brand: readBrandRefSchema.nullable(),
  title: z.string().max(255),
  description: z.string().max(5000).nullable(),
  issueNumber: z.string().max(50).nullable(),
  cover: z.object(readImageSchema).nullable(),
  publishedAt: z.string().nullable(), // ISO date string
  isPublished: z.boolean().nullable(),
  pdf: z.object(readDocumentSchema).nullable(),
  pageCount: z.number().int().min(0).nullable(),
  folderCount: z.number().nullable(),
  articleCount: z.number().nullable(),
  folders: z.lazy(() => z.array(folderSchema).nullable()),
});

export type Issue = z.infer<typeof issueSchema>;

// Schema for creating an issue
export const createIssueSchema = z.object({
  brand: brandRefSchema,
  title: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  issueNumber: z.string().max(50).nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  pdf: updateDocumentSchema.nullable().optional(),
  pageCount: z.number().int().min(0).optional(),
});

export type CreateIssue = z.infer<typeof createIssueSchema>;

// Schema for updating an issue
export const updateIssueSchema = z.object({
  title: z.string().max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  issueNumber: z.string().max(50).nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  publishedAt: z.string().nullable().optional(), // ISO date string
  isPublished: z.boolean().optional(),
  pdf: updateDocumentSchema.nullable().optional(),
  pageCount: z.number().int().min(0).optional(),
  folders: z.array(issueFolderRefSchema).nullable().optional(),
});

export type UpdateIssue = z.infer<typeof updateIssueSchema>;
