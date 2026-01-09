import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export interface CMSIFrameBlock extends CMSBlockCommon {
  type: 'iframe';
  data: {
    url: string;
    width?: number;
    height?: number;
  };
}

export const cmsIFrameBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('iframe'),
  data: z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
});

export const iframeBlockShape: CMSIFrameBlock = {
  id: 'to_regenerate',
  type: 'iframe',
  data: {
    url: '',
  },
};
