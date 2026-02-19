import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export interface CMSCardTextBlock extends CMSBlockCommon {
    type: 'card-text';
    data: {
        variant?: 'white' | 'green';
        title?: string | null;
        text?: string;
    };
}

export const cardTextDataSchema = z.object({
    variant: z.enum(['white', 'green']).optional(),
    title: z.string().nullish(),
    text: z.string().optional(),
});

export const cmsCardTextBlockSchema = z.object({
    ...cmsBlockCommonSchema,
    type: z.literal('card-text'),
    data: cardTextDataSchema,
});

export const cardTextBlockShape: CMSCardTextBlock = {
    id: 'to_regenerate',
    type: 'card-text',
    data: {
        variant: 'white',
        title: 'Nouvelle card texte',
        text: 'Lorem ipsum dolor sit amet.',
    },
};
