import * as z from 'zod';

// Import all block types
import {
  CMSEventBlock,
  cmsEventBlockSchema,
  CMSVideoBlock,
  cmsVideoBlockSchema,
  upsertEventBlockSchema,
} from './blocks';
import { CMSCardTextBlock, cmsCardTextBlockSchema } from './blocks/card-text';
import {
  CMSCardTextWithImageBlock,
  cmsCardTextWithImageBlockSchema,
  upsertCardTextWithImageBlockSchema,
} from './blocks/card-text-with-image';

import {
  CMSCardsTextWithImageBlock,
  cmsCardsTextWithImageBlockSchema,
  upsertCardsTextWithImageBlockSchema,
} from './blocks/cards-text-with-image';

import { CMSHeadingBlock, cmsHeadingBlockSchema } from './blocks/heading';
import { CMSHighlightBlock, cmsHighlightBlockSchema } from './blocks/highlight';
import { CMSIFrameBlock, cmsIFrameBlockSchema } from './blocks/iframe';
import {
  CMSImageAndTextBlock,
  cmsImageAndTextBlockSchema,
  upsertImageAndTextBlockSchema,
} from './blocks/image-and-text';
import {
  CMSImageBlock,
  cmsImageBlockSchema,
  upsertImageBlockSchema,
} from './blocks/images';
import {
  CMSMosaicGalleryBlock,
  cmsMosaicGalleryBlockSchema,
  upsertMosaicGalleryBlockSchema,
} from './blocks/mosaic-gallery';
import { CMSParagraphBlock, cmsParagraphBlockSchema } from './blocks/paragraph';
import {
  CMSPodcastCarouselBlock,
  cmsPodcastCarouselBlockSchema,
} from './blocks/podcast-carousel';
import {
  CMSCardsQuotesBlock,
  cmsCardsQuotesBlockSchema,
} from './blocks/quotes';

// Union type for all CMS blocks
export type CMSBlock =
  | CMSCardTextBlock
  | CMSCardTextWithImageBlock
  | CMSCardsQuotesBlock
  | CMSCardsTextWithImageBlock
  | CMSEventBlock
  | CMSHeadingBlock
  | CMSHighlightBlock
  | CMSIFrameBlock
  | CMSImageAndTextBlock
  | CMSImageBlock
  | CMSMosaicGalleryBlock
  | CMSParagraphBlock
  | CMSPodcastCarouselBlock
  | CMSVideoBlock;

// Union schema for all CMS blocks (read)
export const cmsBlockSchema = z.discriminatedUnion('type', [
  cmsCardTextBlockSchema,
  cmsCardTextWithImageBlockSchema,
  cmsCardsQuotesBlockSchema,
  cmsCardsTextWithImageBlockSchema,
  cmsEventBlockSchema,
  cmsHeadingBlockSchema,
  cmsHighlightBlockSchema,
  cmsIFrameBlockSchema,
  cmsImageAndTextBlockSchema,
  cmsImageBlockSchema,
  cmsMosaicGalleryBlockSchema,
  cmsParagraphBlockSchema,
  cmsPodcastCarouselBlockSchema,
  cmsVideoBlockSchema,
]);

// Union schema for all CMS blocks (upsert)
export const upsertCmsBlockSchema = z.discriminatedUnion('type', [
  cmsCardTextBlockSchema,
  upsertCardTextWithImageBlockSchema,
  cmsCardsQuotesBlockSchema,
  upsertCardsTextWithImageBlockSchema,
  upsertEventBlockSchema,
  cmsHeadingBlockSchema,
  cmsHighlightBlockSchema,
  cmsIFrameBlockSchema,
  upsertImageAndTextBlockSchema,
  upsertImageBlockSchema,
  upsertMosaicGalleryBlockSchema,
  cmsParagraphBlockSchema,
  cmsPodcastCarouselBlockSchema,
  cmsVideoBlockSchema,
]);
