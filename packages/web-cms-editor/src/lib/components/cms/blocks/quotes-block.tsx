import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@maas/web-components';
import { CMSCardsQuotesBlock } from '@maas/core-api-models';
import { sanitizeHtml } from '@maas/core-utils';

export const QuotesBlock = (props: { block: CMSCardsQuotesBlock }) => {
    const { block } = props;

    return (
        <Carousel className="mb-6 w-full">
            {block?.data?.cards && block?.data?.cards?.length > 1 && (
                <div className="mb-4 flex justify-end gap-1">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            )}
            <CarouselContent>
                {block?.data?.cards.map((card, index) => (
                    <CarouselItem key={index}>
                        <article className="border-primary-500 flex h-full border-l-4 bg-neutral-50 py-4 pr-4 pl-5">
                            <div className="flex flex-col gap-3">
                                <p
                                    className="text-base whitespace-pre-line text-neutral-900 italic"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(card.quote),
                                    }}
                                />
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-neutral-900">{card.name}</span>
                                    {card.job && (
                                        <>
                                            <span className="text-neutral-400">—</span>
                                            <span className="text-sm text-neutral-600">{card.job}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </article>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
};
