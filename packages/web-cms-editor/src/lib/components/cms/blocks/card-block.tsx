import { CMSCardTextBlock, CMSCardTextWithImageBlock } from '@maas/core-api-models';
import { getImgSrc, sanitizeHtml } from '@maas/core-utils';

type CardData = CMSCardTextBlock['data'] | CMSCardTextWithImageBlock['data'];

export type CardBlockProps = {
    block: { data: CardData } | CardData;
};

export const CardBlock = (props: CardBlockProps) => {
    const { block } = props;
    const data = 'data' in block ? block.data : block;

    const imgUrl = getImgSrc('image' in data ? data.image : undefined);
    const title = data?.title;
    const description = data?.text;

    return (
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white p-6">
            {imgUrl && <img alt="track record logo" className="max-h-24" src={imgUrl} />}
            {title && <p className="font-montserrat font-semibold text-neutral-900">{title}</p>}
            {description && (
                <p
                    className="text-xs text-neutral-900"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
                />
            )}
        </div>
    );
};
