import * as z from 'zod';

import { Image } from '../../image';
import {
  CMSBlockCommon,
  cmsBlockCommonSchema,
  imageSchema,
  upsertImageSchema,
} from '../common';
import { cardTextDataSchema, CMSCardTextBlock } from './card-text';

export interface CMSCardTextWithImageBlock extends CMSBlockCommon {
  type: 'card-text-with-image';
  data: CMSCardTextBlock['data'] & { image: Image | null };
}

export const cardTextWithImageDataSchema = cardTextDataSchema.extend({
  image: imageSchema,
});

export const upsertCardTextWithImageDataSchema = cardTextDataSchema.extend({
  image: upsertImageSchema,
});

export const cmsCardTextWithImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('card-text-with-image'),
  data: cardTextWithImageDataSchema,
});

export const upsertCardTextWithImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('card-text-with-image'),
  data: upsertCardTextWithImageDataSchema,
});

export const cardTextWithImageBlockShape: CMSCardTextWithImageBlock = {
  id: 'to_regenerate',
  type: 'card-text-with-image',
  data: {
    variant: 'white',
    title: 'Nouvelle card texte avec image',
    text: 'Lorem ipsum dolor sit amet.',
    image: {
      id: null,
      url: null,
      base64: null,
      resizedImages: null,
      originalFilename: null,
    },
  },
};
