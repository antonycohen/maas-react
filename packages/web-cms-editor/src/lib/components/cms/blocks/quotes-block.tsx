import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@maas/web-components';
import { CMSCardsQuotesBlock } from '@maas/core-api-models';

const QuoteLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 11H6C6 7.691 8.691 5 12 5V3C7.582 3 4 6.582 4 11V19H10V11ZM20 11H16C16 7.691 18.691 5 22 5V3C17.582 3 14 6.582 14 11V19H20V11Z" fill="currentColor" className="text-primary-200" />
  </svg>
);

const QuoteRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 13H18C18 16.309 15.309 19 12 19V21C16.418 21 20 17.418 20 13V5H14V13ZM4 13H8C8 16.309 5.309 19 2 19V21C6.418 21 10 17.418 10 13V5H4V13Z" fill="currentColor" className="text-primary-200" />
  </svg>
);

export const QuotesBlock = (props: { block: CMSCardsQuotesBlock }) => {
  const { block } = props;

  return (
    <Carousel className="mb-6">
      {block?.data?.cards && block?.data?.cards?.length > 1 && (
        <div className="mb-4 flex justify-end gap-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      )}
      <CarouselContent>
        {block?.data?.cards.map((card, index) => (
          <CarouselItem key={index}>
            <article className="flex h-full flex-col items-center justify-evenly gap-2 rounded-lg border border-neutral-800 p-4 text-sm">
              <div className="flex items-stretch gap-5">
                <div className="flex w-5 items-start justify-center">
                  <QuoteLeftIcon />
                </div>
                <p
                  className="text-center font-semibold text-neutral-900"
                  dangerouslySetInnerHTML={{
                    __html: card.quote,
                  }}
                />
                <div className="flex w-5 items-end justify-center">
                  <QuoteRightIcon />
                </div>
              </div>
              <p className="font-normal text-neutral-900">{card.name}</p>
              <p className="font-semibold text-neutral-900">{card.job}</p>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
