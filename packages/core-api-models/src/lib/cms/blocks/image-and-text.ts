import * as z from 'zod';

import { Image } from '../../image';
import {
  CMSBlockCommon,
  cmsBlockCommonSchema,
  imageSchema,
  upsertImageSchema,
} from '../common';

export interface CMSImageAndTextBlock extends CMSBlockCommon {
  type: 'image-and-text';
  data: {
    image: Image | null;
    text: string;
    imagePlacement: 'left' | 'right';
  };
}

export const cmsImageAndTextBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('image-and-text'),
  data: z.object({
    image: imageSchema,
    text: z.string(),
    imagePlacement: z.enum(['left', 'right']),
  }),
});

export const upsertImageAndTextBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('image-and-text'),
  data: z.object({
    image: upsertImageSchema,
    text: z.string(),
    imagePlacement: z.enum(['left', 'right']),
  }),
});

export const imageAndTextBlockShape: CMSImageAndTextBlock = {
  id: 'to_regenerate',
  type: 'image-and-text',
  data: {
    image: {
      id: null,
      url: null,
      base64: null,
      resizedImages: null,
      originalFilename: null,
    },
    text: 'Nouveau texte',
    imagePlacement: 'left',
  },
};
