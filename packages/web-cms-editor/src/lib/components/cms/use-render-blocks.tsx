import { useMemo } from 'react';
import { CMSBlock } from '@maas/core-api-models';

import { CardBlock } from './blocks/card-block';
import { CardEventBlock } from './blocks/card-event-block';
import { CardsBlock } from './blocks/cards-block';
import { HeadingBlock } from './blocks/heading-block';
import { HighlightBlock } from './blocks/highlight-block';
import { IFrameBlock } from './blocks/iframe-block';
import { ImageAndTextBlock } from './blocks/image-and-text-block';
import { ImageBlock } from './blocks/image-block';
import { MosaicGalleryBlock } from './blocks/mosaic-gallery-block';
import { ParagraphBlock } from './blocks/paragraph-block';
import { PodcastCarouselBlock } from './blocks/podcast-carousel-block';
import { QuotesBlock } from './blocks/quotes-block';
import { VideoBlock } from './blocks/video-block';

function renderBlock(block: CMSBlock): React.ReactNode {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock key={block.id} block={block} />;

    case 'paragraph':
      return <ParagraphBlock key={block.id} block={block} />;

    case 'images':
      return <ImageBlock key={block.id} block={block} />;

    case 'video':
      return <VideoBlock key={block.id} block={block} />;

    case 'iframe':
      return <IFrameBlock key={block.id} block={block} />;

    case 'highlight':
      return <HighlightBlock key={block.id} block={block} />;

    case 'image-and-text':
      return <ImageAndTextBlock key={block.id} block={block} />;

    case 'mosaic-gallery':
      return <MosaicGalleryBlock key={block.id} block={block} />;

    case 'podcast-carousel':
      return <PodcastCarouselBlock key={block.id} block={block} />;

    case 'cards-quote':
      return <QuotesBlock key={block.id} block={block} />;

    case 'card-event':
      return <CardEventBlock key={block.id} block={block} />;

    case 'card-text':
    case 'card-text-with-image':
      return <CardBlock key={block.id} block={block} />;

    case 'cards-text-with-image':
      return <CardsBlock key={block.id} block={block} />;

    case 'frame':
      return (
        <div key={block.id} className="space-y-4">
          {block.data.children?.map((child) => renderBlock(child))}
        </div>
      );

    default:
      return null;
  }
}

export { renderBlock };

export const useRenderBlocks = (cmsBlocks: CMSBlock[] | null | undefined) => {
  return useMemo(
    () => (cmsBlocks ?? []).map((block) => renderBlock(block)),
    [cmsBlocks],
  );
};
