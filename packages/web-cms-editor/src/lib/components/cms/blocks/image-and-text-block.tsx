import { ImageBlock } from './image-block';
import { CMSImageAndTextBlock } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';

type ImageAndTextBlockProps = {
  block: CMSImageAndTextBlock;
  editMode?: boolean;
};

export function ImageAndTextBlock(props: ImageAndTextBlockProps) {
  const { block } = props;
  const { image, imagePlacement } = block.data;

  return (
    <div
      className={cn('@md:flex-row flex flex-col gap-4', {
        'md:flex-row-reverse': imagePlacement === 'right',
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
          className="rte-content text-sm text-neutral-900"
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      </div>
    </div>
  );
}
