import { ReactNode } from 'react';
import * as z from 'zod';

import { readImageSchema, updateImageSchema } from '../image';

export type CMSBlockData = {
  [key: string]: unknown;
} | null;

export interface CMSBlockCommon {
  id: string;
  type: string;
  data: CMSBlockData;
  editMode?: boolean;
}

export const cmsBlockCommonSchema = {
  id: z.string(),
  editMode: z.boolean().optional(),
};

// Image schemas for block definitions
export const imageSchema = z.object(readImageSchema).nullable();
export const upsertImageSchema = updateImageSchema.nullable();

// Re-export for convenience
export { readImageSchema, updateImageSchema };
export type { ReactNode };
