import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@maas/web-components';
import {
  CMSPodcastCarouselBlock,
  CMSPodcastIframeElement,
} from '@maas/core-api-models';

type PodcastCarouselBlockProps = {
  block: CMSPodcastCarouselBlock;
  isDragging?: boolean;
};

export const PodcastCarouselBlock = ({ block, isDragging }: PodcastCarouselBlockProps) => {
  return (
    <Carousel className="mb-6 w-full">
      {block.data.podcasts && block.data.podcasts?.length > 1 && (
        <div className="mb-4 flex justify-end gap-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      )}
      <CarouselContent>
        {block.data.podcasts.map((podcast, index) => (
          <CarouselItem key={index}>
            <PodcastElement
              url={podcast.url}
              width={podcast.width}
              height={podcast.height}
              isDragging={isDragging}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

type PodcastElementProps = CMSPodcastIframeElement & {
  isDragging?: boolean;
};

const PodcastElement = (props: PodcastElementProps) => {
  const { url, width, height, isDragging } = props;
  const getValidHeight = () => {
    if (!height || height < 50 || height > 1400) return 152;

    return height;
  };

  return (
    <div
      className="h-full w-full rounded-lg bg-neutral-100"
      style={{
        height: `${getValidHeight()}px`,
        width: width ? `${width}px` : '100%',
      }}
    >
      {url && !isDragging && (
        <iframe
          src={url}
          title="project-iframe-block"
          className="h-full w-full"
          allowFullScreen
        />
      )}
    </div>
  );
};
