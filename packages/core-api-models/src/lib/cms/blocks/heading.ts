import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export interface CMSHeadingBlock extends CMSBlockCommon {
  type: 'heading';
  data: {
    title: string | null;
    level: string | null;
    caption: string | null;
  };
}

export const cmsHeadingBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('heading'),
  data: z.object({
    title: z.string().nullable(),
    level: z.string().nullable(),
    caption: z.string().nullable(),
  }),
});

export const headingBlockShape: CMSHeadingBlock = {
  id: 'to_regenerate',
  type: 'heading',
  data: {
    title: 'Nouveau titre',
    level: '1',
    caption: '',
  },
};
