import { CMSHeadingBlock } from '@maas/core-api-models';

type HeadingBlockProps = {
  block: CMSHeadingBlock;
  editMode?: boolean;
};

export function HeadingBlock(props: HeadingBlockProps) {
  const { block } = props;

  switch (block.data.level) {
    case '1':
      return (
        <h1 className="font-heading text-4xl leading-[40px] md:leading-[52px] md:text-[48px] font-semibold tracking-[-1.32px]">
          {block.data.title}
        </h1>
      );
    case '2':
      return (
        <h2 className="font-heading text-[34px] leading-[40px] md:text-[36px] md:leading-[44px] font-semibold tracking-[-0.85px]">
          {block.data.title}
        </h2>
      );
    case '3':
      return (
        <h3 className="font-heading text-2xl leading-[28px] md:text-[24px] md:leading-[32px] font-semibold tracking-[-0.5px]">
          {block.data.title}
        </h3>
      );
    case '4':
      return (
        <h4 className="font-heading text-xl leading-[24px] md:text-[20px] md:leading-[28px] font-semibold tracking-[-0.25px]">
          {block.data.title}
        </h4>
      );
    case '5':
      return (
        <h5 className="font-heading text-lg leading-[20px] md:text-[18px] md:leading-[24px] font-medium tracking-[-0.1px]">
          {block.data.title}
        </h5>
      );
    case '6':
      return (
        <h6 className="font-heading text-base leading-[18px] md:text-[16px] md:leading-[20px] font-medium tracking-0">
          {block.data.title}
        </h6>
      );
    default:
      return null;
  }
}
