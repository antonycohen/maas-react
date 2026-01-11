import {
  CMSCardTextBlock,
  CMSCardTextWithImageBlock,
} from '@maas/core-api-models';
import { getImgSrc } from '@maas/core-utils';

export type CardBlockProps = {
  block: CMSCardTextBlock | CMSCardTextWithImageBlock;
};

export const CardBlock = (props: CardBlockProps) => {
  const { block } = props;

  const imgUrl = getImgSrc(block.data?.image);
  const title = block.data?.title;
  const description = block.data?.text;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white p-6">
      {imgUrl && (
        <img alt="track record logo" className="max-h-24" src={imgUrl} />
      )}
      {title && (
        <p className="font-montserrat font-semibold text-neutral-900">
          {title}
        </p>
      )}
      {description && (
        <p
          className="text-xs text-neutral-900"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};
