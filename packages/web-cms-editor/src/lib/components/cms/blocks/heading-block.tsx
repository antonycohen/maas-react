import { CMSHeadingBlock } from '@maas/core-api-models';

type HeadingBlockProps = {
  block: CMSHeadingBlock;
  editMode?: boolean;
};

export function HeadingBlock(props: HeadingBlockProps) {
  const { block } = props;

  switch (block.data.level) {
    case 1:
      return (
        <h1 className="font-bricolage text-[27px] font-semibold text-neutral-900">
          {block.data.title}
        </h1>
      );
    case 2:
      return (
        <h2 className="font-bricolage text-neutral-black text-lg font-semibold">
          {block.data.title}
        </h2>
      );
    default:
      return null;
  }
}
