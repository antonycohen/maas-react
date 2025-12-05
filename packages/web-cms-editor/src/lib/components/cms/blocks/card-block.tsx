import { CMSCardTextWithImageBlock } from '@maas/core-api-models';
import { getImgSrc } from '@maas/core-utils';

export type CardBlockProps = {
  blockData?: CMSCardTextWithImageBlock['data'];
};

export const CardBlock = (props: CardBlockProps) => {
  const { blockData } = props;

  const imgUrl = getImgSrc(blockData?.image);
  const title = blockData?.title;
  const description = blockData?.text;

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
