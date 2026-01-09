import * as z from 'zod';

import { Image } from '../../image';
import {
  CMSBlockCommon,
  cmsBlockCommonSchema,
  imageSchema,
  upsertImageSchema,
} from '../common';

export interface CMSEventBlock extends CMSBlockCommon {
  type: 'card-event';
  data: {
    topChipLabel?: string;
    title: string;
    description: string;
    subDescription: string;
    ctaLabel: string;
    ctaUrl: string;
    image: Image | null;
  };
}

export const cmsEventBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('card-event'),
  data: z.object({
    topChipLabel: z.string().optional(),
    title: z.string(),
    description: z.string(),
    subDescription: z.string(),
    ctaLabel: z.string(),
    ctaUrl: z.string(),
    image: imageSchema,
  }),
});

export const upsertEventBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('card-event'),
  data: z.object({
    topChipLabel: z.string().optional(),
    title: z.string(),
    description: z.string(),
    subDescription: z.string(),
    ctaLabel: z.string(),
    ctaUrl: z.string(),
    image: upsertImageSchema,
  }),
});

export const cardEventShape: CMSEventBlock = {
  id: 'to_regenerate',
  type: 'card-event',
  data: {
    topChipLabel: 'A venir',
    title: "Le titre de l'evenement",
    description: "Une description de l'evenement",
    subDescription: 'Lorem ipsum',
    ctaLabel: "S'inscrire",
    ctaUrl: 'https://poleditions.com',
    image: {
      id: null,
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      base64: null,
      resizedImages: null,
      originalFilename: null,
    },
  },
};
