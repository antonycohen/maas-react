import { CMSHighlightBlock } from '@maas/core-api-models';

type HighlightBlockProps = {
  block: CMSHighlightBlock;
};
export const HighlightBlock = ({ block }: HighlightBlockProps) => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {block.data.elements.map((element, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-300">
              <span className="text-neutral-black text-base font-semibold">
                {index + 1}
              </span>
            </div>

            <p
              className="rte-content flex-grow text-neutral-900"
              dangerouslySetInnerHTML={{ __html: element.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
