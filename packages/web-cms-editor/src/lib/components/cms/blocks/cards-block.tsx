import { CMSCardsTextWithImageBlock } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { CardBlock } from './card-block';

export const CardsBlock = (props: { block: CMSCardsTextWithImageBlock }) => {
    const { block } = props;
    const isPair = block.data.cards.length % 2 === 0;

    return (
        <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
            {block.data.cards.map((card, index) => (
                <div key={index} className={cn('bg-white', !isPair && index === 0 && 'col-span-1 @md:col-span-2')}>
                    <CardBlock block={card} />
                </div>
            ))}
        </div>
    );
};
