import { EditorSettings } from '../../../types';
import { CMSImageBlock, Image } from '@maas/core-api-models';
import { cn, getImgSrc } from '@maas/core-utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@maas/web-components';

type ImageBlockProps = {
  block: CMSImageBlock;
  editMode?: boolean;
  editorSettings?: EditorSettings;
};

export function ImageBlock(props: ImageBlockProps) {
  const { block } = props;
  const { data } = block;
  const { image, caption, images } = data;

  switch (data.type) {
    case 'single': {
      const src = getImgSrc(image);
      const alt = caption || image?.originalFilename || '';

      if (caption) {
        return (
          <div className="flex w-full flex-col gap-2">
            <img
              src={src}
              alt={alt}
              className={cn('rounded-lg bg-neutral-200 ', {
                'min-h-[315px] w-full': !src,
              })}
            />
            <span className="text-sm font-medium text-neutral-700">{caption}</span>
          </div>
        );
      }

      return src ? (
        <img src={src} alt={alt} className="rounded-lg" />
      ) : (
        <div className="min-h-[315px] w-full rounded-lg bg-neutral-100"></div>
      );
    }

    case 'carousel': {
      return <ImageCarousel images={images} />;
    }

    case 'gallery': {
      return (
        <div className="@md:grid-cols-2 @lg:grid-cols-3 grid grid-cols-1 gap-4">
          {images?.map((image, index) => {
            const src = getImgSrc(image);
            const alt = caption || image?.originalFilename || '';

            return (
              <img
                key={`gallery-${index}`}
                src={src}
                alt={alt}
                className="h-auto max-w-full rounded-lg"
              />
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

function ImageCarousel({ images }: { images: Image[] | null }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        slidesToScroll: 'auto',
      }}
    >
      {images && images?.length > 1 && (
        <div className="mb-4 flex justify-end gap-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      )}
      <CarouselContent className="mb-4 flex">
        {images?.map(
          (img, index) =>
            getImgSrc(img) && (
              <CarouselItem key={index} className="md:basis-1/2">
                <img
                  src={getImgSrc(img)}
                  alt=""
                  style={{ height: 300 }}
                  className="w-full rounded-lg object-cover"
                />
              </CarouselItem>
            ),
        )}
      </CarouselContent>
    </Carousel>
  );
}
