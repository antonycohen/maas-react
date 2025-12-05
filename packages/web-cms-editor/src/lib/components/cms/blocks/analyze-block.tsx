import { CMSAnalyzeBlock } from '@maas/core-api-models';
import { getImgSrc } from '@maas/core-utils';

type AnalyzeBlockProps = {
  block: CMSAnalyzeBlock;
  editMode?: boolean;
};

export function AnalyzeBlock(props: AnalyzeBlockProps) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4">
      <header className="flex items-center gap-2">
        <img
          src={getImgSrc(props.block.data.image)}
          alt=""
          className="h-16 w-16 rounded-full"
        />
        <div>
          <p className="text-sm text-neutral-900">{props.block.data.author}</p>
          <p className="text-sm font-semibold text-neutral-900">
            {props.block.data.subtitle}
          </p>
        </div>
      </header>
      <p
        className="rte-content text-sm text-neutral-900"
        dangerouslySetInnerHTML={{ __html: props.block.data.content }}
      />
    </article>
  );
}
