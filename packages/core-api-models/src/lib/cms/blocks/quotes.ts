import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export type CMSBlockQuoteCard = {
  quote: string;
  name: string;
  job: string;
};

export interface CMSCardsQuotesBlock extends CMSBlockCommon {
  type: 'cards-quote';
  data: {
    cards: CMSBlockQuoteCard[];
  };
}

const blockQuoteCardSchema = z.object({
  quote: z.string(),
  name: z.string(),
  job: z.string(),
});

export const cmsCardsQuotesBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('cards-quote'),
  data: z.object({
    cards: z.array(blockQuoteCardSchema),
  }),
});

export const cardsQuotesBlockShape: CMSCardsQuotesBlock = {
  id: 'to_regenerate',
  type: 'cards-quote',
  data: {
    cards: [
      {
        quote: 'Nouvelle card citation',
        name: 'John',
        job: 'Quote expert',
      },
    ],
  },
};
