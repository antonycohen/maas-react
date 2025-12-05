import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@maas/web-components';
import { CMSCarouselBlock } from '@maas/core-api-models';

type CarouselBlockProps = {
  block: CMSCarouselBlock;
  editMode?: boolean;
};

export function CarouselBlock(props: CarouselBlockProps) {
  const { block } = props;
  const { images } = block.data;

  return (
    <Carousel className="w-full">
      {images && images?.length > 1 && (
        <div className="mb-4 flex justify-end gap-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      )}
      <CarouselContent className="mb-4">
        {images?.map((img, index) => (
          <CarouselItem key={index} className="!md:basis-1/2">
            <img
              src={img.url}
              alt={img.caption || ""}
              className="max-h-[300px] w-full rounded-lg"
            />
            <p className="pt-1 text-sm text-neutral-900">{img.caption}</p>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
