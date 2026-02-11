import { CMSEventBlock } from '@maas/core-api-models';
import { getImgSrc, sanitizeHtml } from '@maas/core-utils';
import { Badge, Button } from '@maas/web-components';

type CardEventBlockProps = {
    block: CMSEventBlock;
};

export const CardEventBlock = (props: CardEventBlockProps) => {
    const { image, topChipLabel, description, title, subDescription, ctaLabel, ctaUrl } = props.block.data;

    return (
        <div className="flex flex-col justify-start gap-6 rounded-lg border border-neutral-200 bg-white p-6 md:flex-row">
            {image && (
                <div className="hidden md:block md:max-w-[180px]">
                    <img alt="avatar" className="h-full w-full object-contain" src={getImgSrc(image)} />
                </div>
            )}
            <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
                <div className="flex flex-col items-center gap-1 md:items-start">
                    {topChipLabel && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                            {topChipLabel}
                        </Badge>
                    )}

                    <h4 className="font-bricolage font-[570] text-neutral-900">{title}</h4>
                    <p
                        className="font-montserrat text-sm font-semibold text-neutral-900"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
                    />

                    <span
                        className="font-montserrat text-xs font-normal text-neutral-900"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(subDescription) }}
                    />
                </div>
                <div>
                    <Button onClick={() => window.open(ctaUrl, '_blank')}>{ctaLabel}</Button>
                </div>
            </div>
        </div>
    );
};
