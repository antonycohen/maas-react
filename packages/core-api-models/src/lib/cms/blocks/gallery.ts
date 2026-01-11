import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export type CMSGalleryImage = {
  url: string;
  caption?: string | null;
};

export interface CMSGalleryBlock extends CMSBlockCommon {
  type: 'gallery';
  data: {
    images: CMSGalleryImage[];
  };
}

export const cmsGalleryBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('gallery'),
  data: z.object({
    images: z.array(
      z.object({
        url: z.string(),
        caption: z.string().nullable().optional(),
      })
    ),
  }),
});

export const galleryBlockShape: CMSGalleryBlock = {
  id: 'to_regenerate',
  type: 'gallery',
  data: {
    images: [],
  },
};
