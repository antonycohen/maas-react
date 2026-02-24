import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

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
        height: z.string().nullish(),
        width: z.string().nullish(),
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
