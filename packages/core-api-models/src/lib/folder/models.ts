import * as z from 'zod';
import { ImageSchema } from '../image';

// Reference schema for issue (minimal fields for folder reference)
export const issueRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export type IssueRef = z.infer<typeof issueRefSchema>;

// Reference schema for folder (minimal fields)
export const folderRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export type FolderRef = z.infer<typeof folderRefSchema>;

// Article reference schema for folder's articles array
export const folderArticleRefSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
});

export type FolderArticleRef = z.infer<typeof folderArticleRefSchema>;

// Full folder schema for read operations
export const folderSchema = z.object({
  id: z.string(),
  issue: issueRefSchema.nullable(),
  name: z.string().max(255),
  description: z.string().max(2000).nullable(),
  position: z.number().int().min(0).nullable(),
  color: z
    .string()
    .max(7)
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .nullable(),
  cover: z.object(ImageSchema).nullable(),
  isPublished: z.boolean().nullable(),
  articleCount: z.number().nullable(),
  articles: z.array(folderArticleRefSchema).nullable(),
});

export type Folder = z.infer<typeof folderSchema>;

// Schema for creating a folder
export const createFolderSchema = z.object({
  issue: z.string().min(1), // issue ID
  name: z.string().min(1).max(255),
  description: z.string().max(2000).nullable().optional(),
  position: z.number().int().min(0).optional(),
  color: z
    .string()
    .max(7)
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .nullable()
    .optional(),
  cover: z.object(ImageSchema).nullable().optional(),
});

export type CreateFolder = z.infer<typeof createFolderSchema>;

// Schema for updating a folder
export const updateFolderSchema = z.object({
  name: z.string().max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  position: z.number().int().min(0).optional(),
  color: z
    .string()
    .max(7)
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .nullable()
    .optional(),
  cover: z.object(ImageSchema).nullable().optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateFolder = z.infer<typeof updateFolderSchema>;
