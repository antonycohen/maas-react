import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

// Forward declaration - actual CMSBlock type will be imported from unions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CMSBlockChildren = any[];

export interface CMSFrameBlock extends CMSBlockCommon {
    type: 'frame';
    data: {
        title?: string | null;
        children: CMSBlockChildren;
    };
}

// Schema will be created with z.lazy() in unions.ts to handle circular reference
// This is a placeholder for the data schema structure
export const cmsFrameBlockDataSchema = z.object({
    title: z.string().nullish(),
    // children schema will be added via z.lazy() in unions.ts
});

// Factory function to create the full schema with children
export const createCmsFrameBlockSchema = (childrenSchema: z.ZodTypeAny) =>
    z.object({
        ...cmsBlockCommonSchema,
        type: z.literal('frame'),
        data: z.object({
            title: z.string().nullish(),
            children: z.array(childrenSchema),
        }),
    });

export const frameBlockShape: CMSFrameBlock = {
    id: 'to_regenerate',
    type: 'frame',
    data: {
        title: '',
        children: [],
    },
};
