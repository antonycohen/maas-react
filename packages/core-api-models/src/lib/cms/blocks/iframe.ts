import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

// Coerce empty string to null, keep strings and null as-is
const dimensionFieldSchema = z.preprocess((val) => {
    if (val === undefined || val === '') return null;
    if (val === null) return null;
    return String(val);
}, z.string().nullish());

export interface CMSIFrameBlock extends CMSBlockCommon {
    type: 'iframe';
    data: {
        url: string;
        width?: string | null;
        height?: string | null;
    };
}

export const cmsIFrameBlockSchema = z.object({
    ...cmsBlockCommonSchema,
    type: z.literal('iframe'),
    data: z.object({
        url: z.string(),
        width: dimensionFieldSchema,
        height: dimensionFieldSchema,
    }),
});

export const iframeBlockShape: CMSIFrameBlock = {
    id: 'to_regenerate',
    type: 'iframe',
    data: {
        url: '',
    },
};
