import { ImageBlock } from './image-block';
import { CMSImageAndTextBlock } from '@maas/core-api-models';
import { cn, sanitizeHtml } from '@maas/core-utils';

type ImageAndTextBlockProps = {
    block: CMSImageAndTextBlock;
    editMode?: boolean;
};

export function ImageAndTextBlock(props: ImageAndTextBlockProps) {
    const { block } = props;
    const { image, imagePlacement } = block.data;

    return (
        <div
            className={cn('flex flex-col gap-4 @md:flex-row', {
                '@md:flex-row-reverse': imagePlacement === 'right',
            })}
        >
            <div className="@md:w-1/2">
                <ImageBlock
                    block={{
                        id: block.id,
                        type: 'images',
                        data: {
                            type: 'single',
                            image: image,
                            caption: null,
                            stretched: null,
                            withBorder: null,
                            images: null,
                            withBackground: null,
                        },
                    }}
                />
            </div>
            <div className="@md:w-1/2">
                <p
                    className="rte-content font-body text-[18px] leading-[26px] tracking-[-0.18px]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text) }}
                />
            </div>
        </div>
    );
}
