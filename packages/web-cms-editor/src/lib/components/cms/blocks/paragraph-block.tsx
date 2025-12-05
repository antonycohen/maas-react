import { CMSParagraphBlock } from '@maas/core-api-models';

export const ParagraphBlock = (props: { block: CMSParagraphBlock }) => {
  const { block } = props;

  if (!block.data) return null;

  return (
    <div className="rte-content text-sm text-neutral-900">
      <p
        dangerouslySetInnerHTML={{ __html: block.data.text }}
        className="body300-regular"
      />
    </div>
  );
};
