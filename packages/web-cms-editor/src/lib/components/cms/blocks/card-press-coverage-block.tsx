import { CMSCardPress, CMSCardPressCoverageBlock } from '@maas/core-api-models';
import { getImgSrc } from '@maas/core-utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@maas/web-components';

type CardPressCoverageBlockProps = {
  block: CMSCardPressCoverageBlock;
};

export const CardPressCoverageBlock = ({
  block,
}: CardPressCoverageBlockProps) => {
  return (
    <Carousel className="mb-6">
      {block.data.cards && block.data.cards?.length > 1 && (
        <div className="mb-4 flex justify-end gap-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      )}
      <CarouselContent>
        {block.data.cards.map((card, index) => (
          <CarouselItem>
            <CardPressCoverage
              key={index}
              image={card.image}
              content={card.content}
              date={card.date}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const CardPressCoverage = (props: CMSCardPress) => {
  const { image, content, date } = props;

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <img src={getImgSrc(image)} alt="press" className="max-h-14" />
        <div>
          <p dangerouslySetInnerHTML={{ __html: content }} />

          <p className="mt-1 text-sm text-neutral-800">
            le {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
