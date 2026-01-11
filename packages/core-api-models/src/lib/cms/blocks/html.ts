import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export interface CMSHtmlBlock extends CMSBlockCommon {
  type: 'html';
  data: {
    html: string;
  };
}

export const cmsHtmlBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('html'),
  data: z.object({
    html: z.string(),
  }),
});

export const htmlBlockShape: CMSHtmlBlock = {
  id: 'to_regenerate',
  type: 'html',
  data: {
    html: '',
  },
};
