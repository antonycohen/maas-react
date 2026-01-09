import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export interface CMSParagraphBlock extends CMSBlockCommon {
  type: 'paragraph';
  data: {
    text: string;
    spoiler?: boolean;
  };
}

export const cmsParagraphBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('paragraph'),
  data: z.object({
    text: z.string(),
    spoiler: z.boolean().optional(),
  }),
});

export const paragraphBlockShape: CMSParagraphBlock = {
  id: 'to_regenerate',
  type: 'paragraph',
  data: {
    text: 'Nouveau texte',
  },
};
