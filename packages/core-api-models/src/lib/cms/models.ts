import { ReactNode } from 'react';
import * as z from 'zod';

import { Image, readImageSchema } from '../image';

export type CMSBlockData = {
  [key: string]: unknown;
} | null;

export interface CMSBlockCommon {
  id: string;
  type: string;
  data: CMSBlockData;
  editMode?: boolean;
}

export interface CMSParagraphBlock extends CMSBlockCommon {
  type: 'paragraph';
  data: {
    text: string;
    spoiler?: boolean;
  };
}

export interface CMSExpendedParagraphBlock extends CMSBlockCommon {
  type: 'expended-paragraph';
  data: {
    title: string;
    content: string;
  };
}

export interface CMSInputsBlock extends CMSBlockCommon {
  type: 'inputs';
  data: null;
}

export interface CMSReactBlock extends CMSBlockCommon {
  type: 'react';
  children: ReactNode;
  data: null;
}

export interface CMSImageBlock extends CMSBlockCommon {
  type: 'images';
  data: {
    type: 'single' | 'carousel' | 'gallery';
    caption: string | null;
    image: Image | null;
    images: Image[] | null;
    withBorder: boolean | null;
    withBackground: boolean | null;
    stretched: boolean | null;
  };
}

export interface CMSImageAndTextBlock extends CMSBlockCommon {
  type: 'image-and-text';
  data: {
    image: Image | null;
    text: string;
    imagePlacement: 'left' | 'right';
  };
}

export interface CMSAlertBlock extends CMSBlockCommon {
  type: 'alert';
  data: {
    level: string | null;
    text: string | null;
    icon: unknown | null;
  };
}

export interface CMSHeadingBlock extends CMSBlockCommon {
  type: 'heading';
  data: {
    title: string | null;
    level: number | null;
    caption: string | null;
  };
}

export interface CMSListBlock extends CMSBlockCommon {
  type: 'list';
  data: {
    type: 'ordered' | 'unordered';
    date?: string;
    content: string[];
  };
}

export interface CMSCardTextBlock extends CMSBlockCommon {
  type: 'card-text';
  data: {
    variant?: 'white' | 'green';
    title?: string;
    text?: string;
  };
}

export interface CMSCardsTextBlock extends CMSBlockCommon {
  type: 'cards-text';
  data: {
    cards: CMSCardTextBlock['data'][];
  };
}

export interface CMSCardTextWithImageBlock extends CMSBlockCommon {
  type: 'card-text-with-image';
  data: CMSCardTextBlock['data'] & { image: Image | null };
}

export interface CMSCardsTextWithImageBlock extends CMSBlockCommon {
  type: 'cards-text-with-image';
  data: {
    cards: CMSCardTextWithImageBlock['data'][];
  };
}

export interface CMSCardTextWithImageAndChipBlock extends CMSBlockCommon {
  type: 'card-text-with-image-and-chip';
  data: CMSCardTextWithImageBlock['data'] & {
    chip?: {
      text: string;
      variant?: string;
    };
  };
}

export interface CMSCardsTextWithImageAndChipBlock extends CMSBlockCommon {
  type: 'cards-text-with-image-and-chip';
  data: {
    cards: CMSCardTextWithImageAndChipBlock['data'][];
  };
}

export type CMSCardsProfileBlockDataCard = {
  name: string;
  job: string;
  text: string;
  image: Image | null;
  linkedinProfileUrl?: string;
};

export interface CMSCardsProfileBlock extends CMSBlockCommon {
  type: 'cards-profile';
  data: {
    cards: CMSCardsProfileBlockDataCard[];
  };
}

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

export interface CMSTableBlock extends CMSBlockCommon {
  type: 'table';
  data: {
    title: string;
    content: [string, string][];
  };
}

export interface CMSCarouselBlock extends CMSBlockCommon {
  type: 'carousel';
  data: {
    images: { url: string; caption?: string }[];
  };
}

export interface CMSVideoBlock extends CMSBlockCommon {
  type: 'video';
  data: {
    url?: string;
    title?: string;
    height?: number;
    width?: number;
  };
}

export interface CMSGalleryBlock extends CMSBlockCommon {
  type: 'gallery';
  data: {
    title?: string;
    images: { url: string; caption?: string }[];
  };
}

export interface CMSButtonBlock extends CMSBlockCommon {
  type: 'button';
  data: {
    redirectTo: string;
    label: string;
  };
}

export interface CMSIFrameBlock extends CMSBlockCommon {
  type: 'iframe';
  data: {
    url: string;
    width?: number;
    height?: number;
  };
}

export interface CMSAutoBlock extends CMSBlockCommon {
  type: 'auto';
  data: {
    type: 'company' | 'modalities';
  };
}

export interface CMSIAudioBlock extends CMSBlockCommon {
  type: 'audio';
  data: {
    url: string;
    width?: number;
    height?: number;
  };
}

export interface CMSChronologyElement {
  date: string;
  title: string;
  text?: string;
  image: Image | null;
  imageCaption?: string;
}

export interface CMSChronologyBlock extends CMSBlockCommon {
  type: 'chronology';
  data: {
    chronology: CMSChronologyElement[];
  };
}

export interface CMSHtmlBlock extends CMSBlockCommon {
  type: 'html';
  data: {
    html: string;
  };
}

export interface CMSClubTrackRecordBlock extends CMSBlockCommon {
  type: 'club-track-record';
  data: null;
}

export interface CMSClubTeamLeadersBlock extends CMSBlockCommon {
  type: 'club-team-leaders';
  data: null;
}

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

export interface CMSClubMediaCarouselBlock extends CMSBlockCommon {
  type: 'club-medias-carousel';
  data: null;
}

export interface CMSClubProjectsBlock extends CMSBlockCommon {
  type: 'club-projects';
  data: null;
}

export type CMSCardPress = {
  image: Image;
  content: string;
  date: string;
};

export interface CMSCardPressCoverageBlock extends CMSBlockCommon {
  type: 'card-press-coverage';
  data: {
    cards: CMSCardPress[];
  };
}

export type CMSPodcastIframeElement = {
  url: string;
  width?: number;
  height?: number;
};

export interface CMSPodcastCarouselBlock extends CMSBlockCommon {
  type: 'podcast-carousel';
  data: {
    podcasts: CMSPodcastIframeElement[];
  };
}

export type CMSMosaicGalleryElement = {
  image: Image;
};

export interface CMSMosaicGalleryBlock extends CMSBlockCommon {
  type: 'mosaic-gallery';
  data: {
    elements: CMSMosaicGalleryElement[];
  };
}

export interface CMSClubLeaderList extends CMSBlockCommon {
  type: 'club-leader-list';
  data: null;
}

export interface CMSClubOrganizationCard extends CMSBlockCommon {
  type: 'club-organization-card';
  data: null;
}

export interface CMSClubModalitiesCard extends CMSBlockCommon {
  type: 'club-modalities-card';
  data: null;
}

export type CMSFrequentlyAskedQuestionItem = {
  question: string;
  answer: string;
};

export interface CMSFrequentlyAskedQuestion extends CMSBlockCommon {
  type: 'faq-block';
  data: {
    elements: CMSFrequentlyAskedQuestionItem[];
  };
}

export type CMSAnalyzeContent = {
  author: string;
  subtitle: string;
  content: string;
  image: Image;
};

export interface CMSAnalyzeBlock extends CMSBlockCommon {
  type: 'analyze';
  data: CMSAnalyzeContent;
}

export type CMSHighlightElement = {
  content: string;
};

export interface CMSHighlightBlock extends CMSBlockCommon {
  type: 'highlight';
  data: {
    elements: CMSHighlightElement[];
  };
}

export interface CMSSectionAnswersBlock extends CMSBlockCommon {
  type: 'section-answers';
  data: null;
}

export type CMSBlock =
  | CMSAlertBlock
  | CMSButtonBlock
  | CMSCardTextBlock
  | CMSCardsTextBlock
  | CMSCardsTextWithImageBlock
  | CMSCardTextWithImageAndChipBlock
  | CMSCardsTextWithImageAndChipBlock
  | CMSCarouselBlock
  | CMSChronologyBlock
  | CMSGalleryBlock
  | CMSHeadingBlock
  | CMSImageBlock
  | CMSImageAndTextBlock
  | CMSInputsBlock
  | CMSReactBlock
  | CMSListBlock
  | CMSParagraphBlock
  | CMSExpendedParagraphBlock
  | CMSCardsQuotesBlock
  | CMSTableBlock
  | CMSCardsProfileBlock
  | CMSVideoBlock
  | CMSIFrameBlock
  | CMSIAudioBlock
  | CMSHtmlBlock
  | CMSAutoBlock
  | CMSClubTrackRecordBlock
  | CMSClubTeamLeadersBlock
  | CMSEventBlock
  | CMSClubMediaCarouselBlock
  | CMSClubProjectsBlock
  | CMSCardPressCoverageBlock
  | CMSPodcastCarouselBlock
  | CMSMosaicGalleryBlock
  | CMSClubLeaderList
  | CMSClubOrganizationCard
  | CMSClubModalitiesCard
  | CMSFrequentlyAskedQuestion
  | CMSAnalyzeBlock
  | CMSHighlightBlock
  | CMSSectionAnswersBlock;

// Zod Schemas

const imageSchema = z.object(readImageSchema).nullable();

const cmsBlockCommonSchema = {
  id: z.string(),
  editMode: z.boolean().optional(),
};

export const cmsParagraphBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('paragraph'),
  data: z.object({
    text: z.string(),
    spoiler: z.boolean().optional(),
  }),
});

export const cmsExpendedParagraphBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('expended-paragraph'),
  data: z.object({
    title: z.string(),
    content: z.string(),
  }),
});

export const cmsInputsBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('inputs'),
  data: z.null(),
});

export const cmsImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('images'),
  data: z.object({
    type: z.enum(['single', 'carousel', 'gallery']),
    caption: z.string().nullable(),
    image: imageSchema,
    images: z.array(z.object(readImageSchema)).nullable(),
    withBorder: z.boolean().nullable(),
    withBackground: z.boolean().nullable(),
    stretched: z.boolean().nullable(),
  }),
});

export const cmsImageAndTextBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('image-and-text'),
  data: z.object({
    image: imageSchema,
    text: z.string(),
    imagePlacement: z.enum(['left', 'right']),
  }),
});

export const cmsAlertBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('alert'),
  data: z.object({
    level: z.string().nullable(),
    text: z.string().nullable(),
    icon: z.unknown().nullable(),
  }),
});

export const cmsHeadingBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('heading'),
  data: z.object({
    title: z.string().nullable(),
    level: z.number().nullable(),
    caption: z.string().nullable(),
  }),
});

export const cmsListBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('list'),
  data: z.object({
    type: z.enum(['ordered', 'unordered']),
    date: z.string().optional(),
    content: z.array(z.string()),
  }),
});

const cardTextDataSchema = z.object({
  variant: z.enum(['white', 'green']).optional(),
  title: z.string().optional(),
  text: z.string().optional(),
});

export const cmsCardTextBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('card-text'),
  data: cardTextDataSchema,
});

export const cmsCardsTextBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('cards-text'),
  data: z.object({
    cards: z.array(cardTextDataSchema),
  }),
});

const cardTextWithImageDataSchema = cardTextDataSchema.extend({
  image: imageSchema,
});

export const cmsCardTextWithImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('card-text-with-image'),
  data: cardTextWithImageDataSchema,
});

export const cmsCardsTextWithImageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('cards-text-with-image'),
  data: z.object({
    cards: z.array(cardTextWithImageDataSchema),
  }),
});

const cardTextWithImageAndChipDataSchema = cardTextWithImageDataSchema.extend({
  chip: z
    .object({
      text: z.string(),
      variant: z.string().optional(),
    })
    .optional(),
});

export const cmsCardTextWithImageAndChipBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('card-text-with-image-and-chip'),
  data: cardTextWithImageAndChipDataSchema,
});

export const cmsCardsTextWithImageAndChipBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('cards-text-with-image-and-chip'),
  data: z.object({
    cards: z.array(cardTextWithImageAndChipDataSchema),
  }),
});

const cardsProfileDataCardSchema = z.object({
  name: z.string(),
  job: z.string(),
  text: z.string(),
  image: imageSchema,
  linkedinProfileUrl: z.string().optional(),
});

export const cmsCardsProfileBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('cards-profile'),
  data: z.object({
    cards: z.array(cardsProfileDataCardSchema),
  }),
});

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

export const cmsTableBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('table'),
  data: z.object({
    title: z.string(),
    content: z.array(z.tuple([z.string(), z.string()])),
  }),
});

const carouselImageSchema = z.object({
  url: z.string(),
  caption: z.string().optional(),
});

export const cmsCarouselBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('carousel'),
  data: z.object({
    images: z.array(carouselImageSchema),
  }),
});

export const cmsVideoBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('video'),
  data: z.object({
    url: z.string().optional(),
    title: z.string().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
  }),
});

export const cmsGalleryBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('gallery'),
  data: z.object({
    title: z.string().optional(),
    images: z.array(carouselImageSchema),
  }),
});

export const cmsButtonBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('button'),
  data: z.object({
    redirectTo: z.string(),
    label: z.string(),
  }),
});

export const cmsIFrameBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('iframe'),
  data: z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
});

export const cmsAutoBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('auto'),
  data: z.object({
    type: z.enum(['company', 'modalities']),
  }),
});

export const cmsAudioBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('audio'),
  data: z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
});

const chronologyElementSchema = z.object({
  date: z.string(),
  title: z.string(),
  text: z.string().optional(),
  image: imageSchema,
  imageCaption: z.string().optional(),
});

export const cmsChronologyBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('chronology'),
  data: z.object({
    chronology: z.array(chronologyElementSchema),
  }),
});

export const cmsHtmlBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('html'),
  data: z.object({
    html: z.string(),
  }),
});

export const cmsClubTrackRecordBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('club-track-record'),
  data: z.null(),
});

export const cmsClubTeamLeadersBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('club-team-leaders'),
  data: z.null(),
});

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

export const cmsClubMediaCarouselBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('club-medias-carousel'),
  data: z.null(),
});

export const cmsClubProjectsBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('club-projects'),
  data: z.null(),
});

const cardPressSchema = z.object({
  image: z.object(readImageSchema),
  content: z.string(),
  date: z.string(),
});

export const cmsCardPressCoverageBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('card-press-coverage'),
  data: z.object({
    cards: z.array(cardPressSchema),
  }),
});

const podcastIframeElementSchema = z.object({
  url: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const cmsPodcastCarouselBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('podcast-carousel'),
  data: z.object({
    podcasts: z.array(podcastIframeElementSchema),
  }),
});

const mosaicGalleryElementSchema = z.object({
  image: z.object(readImageSchema),
});

export const cmsMosaicGalleryBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('mosaic-gallery'),
  data: z.object({
    elements: z.array(mosaicGalleryElementSchema),
  }),
});

export const cmsClubLeaderListBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('club-leader-list'),
  data: z.null(),
});

export const cmsClubOrganizationCardBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('club-organization-card'),
  data: z.null(),
});

export const cmsClubModalitiesCardBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('club-modalities-card'),
  data: z.null(),
});

const frequentlyAskedQuestionItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const cmsFrequentlyAskedQuestionBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('faq-block'),
  data: z.object({
    elements: z.array(frequentlyAskedQuestionItemSchema),
  }),
});

const analyzeContentSchema = z.object({
  author: z.string(),
  subtitle: z.string(),
  content: z.string(),
  image: z.object(readImageSchema),
});

export const cmsAnalyzeBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('analyze'),
  data: analyzeContentSchema,
});

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

export const cmsSectionAnswersBlockSchema = z.object({
  ...cmsBlockCommonSchema,
  type: z.literal('section-answers'),
  data: z.null(),
});

// Union schema for all CMS blocks
export const cmsBlockSchema = z.discriminatedUnion('type', [
  cmsParagraphBlockSchema,
  cmsExpendedParagraphBlockSchema,
  cmsInputsBlockSchema,
  cmsImageBlockSchema,
  cmsImageAndTextBlockSchema,
  cmsAlertBlockSchema,
  cmsHeadingBlockSchema,
  cmsListBlockSchema,
  cmsCardTextBlockSchema,
  cmsCardsTextBlockSchema,
  cmsCardTextWithImageBlockSchema,
  cmsCardsTextWithImageBlockSchema,
  cmsCardTextWithImageAndChipBlockSchema,
  cmsCardsTextWithImageAndChipBlockSchema,
  cmsCardsProfileBlockSchema,
  cmsCardsQuotesBlockSchema,
  cmsTableBlockSchema,
  cmsCarouselBlockSchema,
  cmsVideoBlockSchema,
  cmsGalleryBlockSchema,
  cmsButtonBlockSchema,
  cmsIFrameBlockSchema,
  cmsAutoBlockSchema,
  cmsAudioBlockSchema,
  cmsChronologyBlockSchema,
  cmsHtmlBlockSchema,
  cmsClubTrackRecordBlockSchema,
  cmsClubTeamLeadersBlockSchema,
  cmsEventBlockSchema,
  cmsClubMediaCarouselBlockSchema,
  cmsClubProjectsBlockSchema,
  cmsCardPressCoverageBlockSchema,
  cmsPodcastCarouselBlockSchema,
  cmsMosaicGalleryBlockSchema,
  cmsClubLeaderListBlockSchema,
  cmsClubOrganizationCardBlockSchema,
  cmsClubModalitiesCardBlockSchema,
  cmsFrequentlyAskedQuestionBlockSchema,
  cmsAnalyzeBlockSchema,
  cmsHighlightBlockSchema,
  cmsSectionAnswersBlockSchema,
]);

// Array schema for CMS content
export const cmsBlockArraySchema = z.array(cmsBlockSchema);
