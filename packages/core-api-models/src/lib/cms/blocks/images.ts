import * as z from 'zod';

import { Image } from '../../image';
import {
  CMSBlockCommon,
  cmsBlockCommonSchema,
  imageSchema,
  upsertImageSchema,
  readImageSchema,
  updateImageSchema,
} from '../common';

export interface CMSImageBlock extends CMSBlockCommon {
  type: 'images';
  data: {
    type: 'single' | 'carousel' | 'gallery';
    caption: string | null;
    image: Image | null;
    images: Image[] | null;
    withBorder: boolean | null;
    withBackground: boolean | null;
    stretched: boolean | null;
  };
}

export const cmsImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('images'),
  data: z.object({
    type: z.enum(['single', 'carousel', 'gallery']),
    caption: z.string().nullable(),
    image: imageSchema.nullable(),
    images: z.array(z.object(readImageSchema)).nullable(),
    withBorder: z.boolean().nullable(),
    withBackground: z.boolean().nullable(),
    stretched: z.boolean().nullable(),
  }),
});

export const upsertImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('images'),
  data: z.object({
    type: z.enum(['single', 'carousel', 'gallery']),
    caption: z.string().nullable(),
    image: upsertImageSchema.nullable().optional(),
    images: z.array(updateImageSchema).nullable().optional(),
    withBorder: z.boolean().nullable(),
    withBackground: z.boolean().nullable(),
    stretched: z.boolean().nullable(),
  }),
});

export const imageBlockShape: CMSImageBlock = {
  id: 'to_regenerate',
  type: 'images',
  data: {
    type: 'single',
    caption: null,
    image: {
      id: null,
      url: null,
      base64: null,
      resizedImages: null,
      originalFilename: null,
    },
    images: [
      {
        id: null,
        url: null,
        base64: null,
        resizedImages: null,
        originalFilename: null,
      },
    ],
    withBorder: false,
    withBackground: false,
    stretched: false,
  },
};
