import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export type CMSHighlightElement = {
  content: string;
};

export interface CMSHighlightBlock extends CMSBlockCommon {
  type: 'highlight';
  data: {
    elements: CMSHighlightElement[];
  };
}

const highlightElementSchema = z.object({
  content: z.string(),
});

export const cmsHighlightBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('highlight'),
  data: z.object({
    elements: z.array(highlightElementSchema),
  }),
});

export const highlightShape: CMSHighlightBlock = {
  id: 'to_regenerate',
  type: 'highlight',
  data: {
    elements: [
      {
        content:
          'LE TRAIN est le 1er operateur francais et prive de Train a Grande Vitesse pense pour les regions loremp isupm dolore',
      },
    ],
  },
};
