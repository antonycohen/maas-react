import * as z from 'zod';
import { readImageSchema, updateImageSchema } from '../image';
import { articleSchema } from '../article';
import { organizationRefSchema } from '../organizations';

export const readFolderRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export const folderRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export type ReadFolderRef = z.infer<typeof readFolderRefSchema>;

// Full folder schema for read operations
export const folderSchema = z.object({
  id: z.string(),
  type: z.string().max(255).nullable(),
  isDefault: z.boolean().nullable(),
  name: z.string().max(255),
  description: z.string().max(2000).nullable(),
  cover: z.object(readImageSchema).nullable(),
  isPublished: z.boolean().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  articleCount: z.number().nullable(),
  articles: z.lazy(() => z.array(articleSchema).nullable()),
  link: z.string().nullable().optional(),
});

export type Folder = z.infer<typeof folderSchema>;

// Schema for creating a folder
export const createFolderSchema = z.object({
  organization: organizationRefSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(2000).nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type CreateFolder = z.infer<typeof createFolderSchema>;

// Schema for updating a folder
export const updateFolderSchema = z.object({
  name: z.string().max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  isPublished: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type UpdateFolder = z.infer<typeof updateFolderSchema>;
