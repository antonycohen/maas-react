import * as z from 'zod';
import { readImageSchema, updateImageSchema, Image } from '../image';
import { articleRefSchema, articleSchema, Article } from '../article';
import { organizationRefSchema } from '../organizations';
import { issueSchema, Issue } from '../issue';

export const readFolderRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export type ReadFolderRef = z.infer<typeof readFolderRefSchema>;

// Define Folder type to break circular reference
export type Folder = {
  id: string;
  type: string | null;
  isDefault: boolean | null;
  issues: Issue[] | null;
  name: string;
  description: string | null;
  cover: Image | null;
  isPublished: boolean | null;
  metadata: Record<string, unknown> | null;
  articleCount: number | null;
  articles: Article[] | null;
  link: string | null;
};

// Full folder schema for read operations
export const folderSchema: z.ZodType<Folder> = z.object({
  id: z.string(),
  type: z.string().max(255).nullable(),
  isDefault: z.boolean().nullable(),
  issues: z.lazy(() => z.array(issueSchema).nullable()),
  name: z.string().max(255),
  description: z.string().max(2000).nullable(),
  cover: z.object(readImageSchema).nullable(),
  isPublished: z.boolean().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  articleCount: z.number().nullable(),
  articles: z.lazy(() => z.array(articleSchema).nullable()),
  link: z.string().nullable(),
});

// Schema for creating a folder
export const createFolderSchema = z.object({
  organization: organizationRefSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(2000).nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  isPublished: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  articles: z
    .array(z.lazy(() => articleRefSchema))
    .nullable()
    .optional(),
});

export type CreateFolder = z.infer<typeof createFolderSchema>;

// Schema for updating a folder
export const updateFolderSchema = z.object({
  name: z.string().max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  cover: updateImageSchema.nullable().optional(),
  isPublished: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  articles: z
    .array(z.lazy(() => articleRefSchema))
    .nullable()
    .optional(),
});

export type UpdateFolder = z.infer<typeof updateFolderSchema>;
