import * as z from 'zod';

import {
  CMSBlockCommon,
  cmsBlockCommonSchema,
} from '../common';
import {
  CMSCardTextWithImageBlock,
  cardTextWithImageDataSchema,
  upsertCardTextWithImageDataSchema,
} from './card-text-with-image';

export interface CMSCardsTextWithImageBlock extends CMSBlockCommon {
  type: 'cards-text-with-image';
  data: {
    cards: CMSCardTextWithImageBlock['data'][];
  };
}

export const cmsCardsTextWithImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('cards-text-with-image'),
  data: z.object({
    cards: z.array(cardTextWithImageDataSchema),
  }),
});

export const upsertCardsTextWithImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('cards-text-with-image'),
  data: z.object({
    cards: z.array(upsertCardTextWithImageDataSchema),
  }),
});

export const cardsTextWithImageBlockShape: CMSCardsTextWithImageBlock = {
  id: 'to_regenerate',
  type: 'cards-text-with-image',
  data: {
    cards: [
      {
        variant: 'white',
        title: 'Nouvelle card texte avec image',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra malesuada hendrerit.',
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
