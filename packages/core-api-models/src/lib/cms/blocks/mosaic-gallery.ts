import * as z from 'zod';

import { Image } from '../../image';
import {
  CMSBlockCommon,
  cmsBlockCommonSchema,
  readImageSchema,
  updateImageSchema,
} from '../common';

export type CMSMosaicGalleryElement = {
  image: Image;
};

export interface CMSMosaicGalleryBlock extends CMSBlockCommon {
  type: 'mosaic-gallery';
  data: {
    elements: CMSMosaicGalleryElement[];
  };
}

const mosaicGalleryElementSchema = z.object({
  image: z.object(readImageSchema),
});

const upsertMosaicGalleryElementSchema = z.object({
  image: updateImageSchema,
});

export const cmsMosaicGalleryBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('mosaic-gallery'),
  data: z.object({
    elements: z.array(mosaicGalleryElementSchema),
  }),
});

export const upsertMosaicGalleryBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('mosaic-gallery'),
  data: z.object({
    elements: z.array(upsertMosaicGalleryElementSchema),
  }),
});

export const mosaicGalleryShape: CMSMosaicGalleryBlock = {
  id: 'to_regenerate',
  type: 'mosaic-gallery',
  data: {
    elements: [
      {
        image: {
          id: null,
          url: null,
          base64: null,
          resizedImages: null,
          originalFilename: null,
        },
      },
    ],
  },
};
