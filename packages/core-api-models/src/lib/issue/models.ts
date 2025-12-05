import * as z from 'zod';
import { ImageSchema } from '../image';
import { brandRefSchema } from '../brand';
import { folderRefSchema } from '../folder';

// Document schema for PDF files
export const documentSchema = z.object({
  id: z.string().nullable(),
  url: z.string().nullable(),
  downloadUrl: z.string().optional(),
  originalFilename: z.string().nullable(),
  mimeType: z.string().nullable(),
  size: z.number().nullable(),
});

export type Document = z.infer<typeof documentSchema>;

// Reference schema for issue (minimal fields)
export const issueRefSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
});

export type IssueRef = z.infer<typeof issueRefSchema>;

// Full issue schema for read operations
export const issueSchema = z.object({
  id: z.string(),
  brand: brandRefSchema.nullable(),
  title: z.string().max(255),
  description: z.string().max(5000).nullable(),
  issueNumber: z.string().max(50).nullable(),
  cover: z.object(ImageSchema).nullable(),
  publishedAt: z.string().nullable(), // ISO date string
  isPublished: z.boolean().nullable(),
  pdf: documentSchema.nullable(),
  pageCount: z.number().int().min(0).nullable(),
  folderCount: z.number().nullable(),
  articleCount: z.number().nullable(),
  folders: z.array(folderRefSchema).nullable(),
});

export type Issue = z.infer<typeof issueSchema>;

// Schema for creating an issue
export const createIssueSchema = z.object({
  brand: z.string().min(1), // brand ID
  title: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  issueNumber: z.string().max(50).nullable().optional(),
  cover: z.object(ImageSchema).nullable().optional(),
  pdf: documentSchema.nullable().optional(),
  pageCount: z.number().int().min(0).optional(),
});

export type CreateIssue = z.infer<typeof createIssueSchema>;

// Schema for updating an issue
export const updateIssueSchema = z.object({
  title: z.string().max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  issueNumber: z.string().max(50).nullable().optional(),
  cover: z.object(ImageSchema).nullable().optional(),
  publishedAt: z.string().nullable().optional(), // ISO date string
  isPublished: z.boolean().optional(),
  pdf: documentSchema.nullable().optional(),
  pageCount: z.number().int().min(0).optional(),
});

export type UpdateIssue = z.infer<typeof updateIssueSchema>;
