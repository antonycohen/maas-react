import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export interface CMSListBlock extends CMSBlockCommon {
  type: 'list';
  data: {
    type: 'ordered' | 'unordered';
    date?: string | null;
    content: string[];
  };
}

export const cmsListBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('list'),
  data: z.object({
    type: z.enum(['ordered', 'unordered']),
    date: z.string().nullable().optional(),
    content: z.array(z.string()),
  }),
});

export const listBlockShape: CMSListBlock = {
  id: 'to_regenerate',
  type: 'list',
  data: {
    type: 'unordered',
    date: null,
    content: [],
  },
};
