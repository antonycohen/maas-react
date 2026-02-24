import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

// Coerce empty string to null, keep strings and null as-is
const dimensionFieldSchema = z.preprocess((val) => {
    if (val === undefined || val === '') return null;
    if (val === null) return null;
    return String(val);
}, z.string().nullish());

export interface CMSVideoBlock extends CMSBlockCommon {
    type: 'video';
    data: {
        url?: string;
        title?: string | null;
        height?: string | null;
        width?: string | null;
    };
}

export const cmsVideoBlockSchema = z.object({
    ...cmsBlockCommonSchema,
    type: z.literal('video'),
    data: z.object({
        url: z.string().optional(),
        title: z.string().nullish(),
        height: dimensionFieldSchema,
        width: dimensionFieldSchema,
    }),
});

export const videoBlockShape: CMSVideoBlock = {
    id: 'to_regenerate',
    type: 'video',
    data: {
        url: '',
        title: 'Nouvelle video',
    },
};
