import * as z from 'zod';

import { CMSBlockCommon, cmsBlockCommonSchema } from '../common';

export type CMSPodcastIframeElement = {
    url: string;
    width?: string | null;
    height?: string | null;
};

export interface CMSPodcastCarouselBlock extends CMSBlockCommon {
    type: 'podcast-carousel';
    data: {
        podcasts: CMSPodcastIframeElement[];
    };
}

const podcastIframeElementSchema = z.object({
    url: z.string(),
    width: z.string().nullable().optional(),
    height: z.string().nullable().optional(),
});

export const cmsPodcastCarouselBlockSchema = z.object({
    ...cmsBlockCommonSchema,
    type: z.literal('podcast-carousel'),
    data: z.object({
        podcasts: z.array(podcastIframeElementSchema),
    }),
});

export const podcastCarouselShape: CMSPodcastCarouselBlock = {
    id: 'to_regenerate',
    type: 'podcast-carousel',
    data: {
        podcasts: [
            {
                url: 'https://open.spotify.com/embed/episode/0uWS0VqxxxzmpQLFmoHEat?si=caadf2bfedbe422d?utm_source=generator&theme=0',
            },
        ],
    },
};
