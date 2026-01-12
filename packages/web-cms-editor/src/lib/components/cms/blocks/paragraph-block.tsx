import { CMSParagraphBlock } from '@maas/core-api-models';

export const ParagraphBlock = (props: { block: CMSParagraphBlock }) => {
  const { block } = props;

  if (!block.data) return null;

  return (
    <div className="rte-content font-body text-[18px] leading-[26px] tracking-[-0.18px]">
      <p
        dangerouslySetInnerHTML={{ __html: block.data.text }}
        className="body300-regular whitespace-pre-line"
      />
    </div>
  );
};
