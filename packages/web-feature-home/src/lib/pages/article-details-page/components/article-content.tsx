// import { SubscriptionCTA } from './subscription-cta';
import { useRenderBlocks } from '@maas/web-cms-editor';
import { Article } from '@maas/core-api-models';




export const ArticleContent = ({
  content,
}: {
  content?: Article['content'];
}) => {
  const blocks = useRenderBlocks(content);
  return (
    <article className="flex flex-col gap-10 items-start w-full lg:max-w-[600px]">
      <div className="flex flex-col gap-5 items-start w-full relative">
        {blocks}
        {/*<div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-white to-transparent pointer-events-none"></div>*/}
      </div>
      {/*<SubscriptionCTA />*/}
    </article>
  );
};
