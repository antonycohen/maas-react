import * as z from 'zod';

// Import all block types
import {
  CMSEventBlock,
  cmsEventBlockSchema,
  CMSVideoBlock,
  cmsVideoBlockSchema,
  upsertEventBlockSchema,
  CMSFrameBlock,
  createCmsFrameBlockSchema,
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
import { CMSHtmlBlock, cmsHtmlBlockSchema } from './blocks/html';
import { CMSIFrameBlock, cmsIFrameBlockSchema } from './blocks/iframe';
import { CMSListBlock, cmsListBlockSchema } from './blocks/list';
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

// Union type for all CMS blocks (excluding frame for non-recursive contexts)
export type CMSBlockWithoutFrame =
  | CMSCardTextBlock
  | CMSCardTextWithImageBlock
  | CMSCardsQuotesBlock
  | CMSCardsTextWithImageBlock
  | CMSEventBlock
  | CMSHeadingBlock
  | CMSHighlightBlock
  | CMSHtmlBlock
  | CMSIFrameBlock
  | CMSImageAndTextBlock
  | CMSImageBlock
  | CMSListBlock
  | CMSMosaicGalleryBlock
  | CMSParagraphBlock
  | CMSPodcastCarouselBlock
  | CMSVideoBlock;

// Union type for all CMS blocks (including frame)
export type CMSBlock = CMSBlockWithoutFrame | CMSFrameBlock;

// Schema for blocks that can be nested inside a frame (excludes frame itself)
export const cmsBlockWithoutFrameSchema = z.discriminatedUnion('type', [
  cmsCardTextBlockSchema,
  cmsCardTextWithImageBlockSchema,
  cmsCardsQuotesBlockSchema,
  cmsCardsTextWithImageBlockSchema,
  cmsEventBlockSchema,
  cmsHeadingBlockSchema,
  cmsHighlightBlockSchema,
  cmsHtmlBlockSchema,
  cmsIFrameBlockSchema,
  cmsImageAndTextBlockSchema,
  cmsImageBlockSchema,
  cmsListBlockSchema,
  cmsMosaicGalleryBlockSchema,
  cmsParagraphBlockSchema,
  cmsPodcastCarouselBlockSchema,
  cmsVideoBlockSchema,
]);

// Frame block schema with children limited to non-frame blocks (1 level nesting)
export const cmsFrameBlockSchema = createCmsFrameBlockSchema(
  cmsBlockWithoutFrameSchema
);

// Schema for blocks that can be nested inside a frame (upsert version - excludes frame itself)
export const upsertCmsBlockWithoutFrameSchema = z.discriminatedUnion('type', [
  cmsCardTextBlockSchema,
  upsertCardTextWithImageBlockSchema,
  cmsCardsQuotesBlockSchema,
  upsertCardsTextWithImageBlockSchema,
  upsertEventBlockSchema,
  cmsHeadingBlockSchema,
  cmsHighlightBlockSchema,
  cmsHtmlBlockSchema,
  cmsIFrameBlockSchema,
  cmsListBlockSchema,
  upsertImageAndTextBlockSchema,
  upsertImageBlockSchema,
  upsertMosaicGalleryBlockSchema,
  cmsParagraphBlockSchema,
  cmsPodcastCarouselBlockSchema,
  cmsVideoBlockSchema,
]);

// Frame block schema for upsert (children use upsert schemas)
export const upsertCmsFrameBlockSchema = createCmsFrameBlockSchema(
  upsertCmsBlockWithoutFrameSchema
);

// Union schema for all CMS blocks (read) - includes frame
export const cmsBlockSchema = z.discriminatedUnion('type', [
  cmsCardTextBlockSchema,
  cmsCardTextWithImageBlockSchema,
  cmsCardsQuotesBlockSchema,
  cmsCardsTextWithImageBlockSchema,
  cmsEventBlockSchema,
  cmsFrameBlockSchema,
  cmsHeadingBlockSchema,
  cmsHighlightBlockSchema,
  cmsHtmlBlockSchema,
  cmsIFrameBlockSchema,
  cmsImageAndTextBlockSchema,
  cmsImageBlockSchema,
  cmsListBlockSchema,
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
  upsertCmsFrameBlockSchema,
  cmsHeadingBlockSchema,
  cmsHighlightBlockSchema,
  cmsHtmlBlockSchema,
  cmsIFrameBlockSchema,
  cmsListBlockSchema,
  upsertImageAndTextBlockSchema,
  upsertImageBlockSchema,
  upsertMosaicGalleryBlockSchema,
  cmsParagraphBlockSchema,
  cmsPodcastCarouselBlockSchema,
  cmsVideoBlockSchema,
]);
