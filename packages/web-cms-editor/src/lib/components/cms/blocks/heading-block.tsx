import { CMSHeadingBlock } from '@maas/core-api-models';

type HeadingBlockProps = {
  block: CMSHeadingBlock;
  editMode?: boolean;
};

export function HeadingBlock(props: HeadingBlockProps) {
  const { block } = props;

  switch (block.data.level) {
    case "1":
      return (
        <h1 className="font-bricolage text-[27px] font-semibold text-neutral-900">
          {block.data.title}
        </h1>
      );
    case "2":
      return (
        <h2 className="font-bricolage text-neutral-black text-lg font-semibold">
          {block.data.title}
        </h2>
      );
    case "3":
      return (
        <h3 className="font-bricolage text-neutral-900 text-base font-semibold">
          {block.data.title}
        </h3>
      );
    case "4":
      return (
        <h4 className="font-bricolage text-neutral-900 text-sm font-semibold">
          {block.data.title}
        </h4>
      );
    case "5":
      return (
        <h5 className="font-bricolage text-neutral-900 text-sm font-medium">
          {block.data.title}
        </h5>
      );
    case "6":
      return (
        <h6 className="font-bricolage text-neutral-900 text-xs font-medium">
          {block.data.title}
        </h6>
      );
    default:
      return null;
  }
}
