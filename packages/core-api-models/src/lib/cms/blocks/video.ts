import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export interface CMSVideoBlock extends CMSBlockCommon {
  type: 'video';
  data: {
    url?: string;
    title?: string;
    height?: number;
    width?: number;
  };
}

export const cmsVideoBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('video'),
  data: z.object({
    url: z.string().optional(),
    title: z.string().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
  }),
});

export const videoBlockShape: CMSVideoBlock = {
  id: 'to_regenerate',
  type: 'video',
  data: {
    url: '',
    title: 'Nouvelle video',
  },
};
