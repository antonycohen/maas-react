import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export type CMSCarouselImage = {
  url: string;
  caption?: string | null;
};

export interface CMSCarouselBlock extends CMSBlockCommon {
  type: 'carousel';
  data: {
    images: CMSCarouselImage[];
  };
}

export const cmsCarouselBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('carousel'),
  data: z.object({
    images: z.array(
      z.object({
        url: z.string(),
        caption: z.string().nullable().optional(),
      })
    ),
  }),
});

export const carouselBlockShape: CMSCarouselBlock = {
  id: 'to_regenerate',
  type: 'carousel',
  data: {
    images: [],
  },
};
