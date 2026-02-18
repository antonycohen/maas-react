import { SubscriptionCTA } from './subscription-cta';
import { useRenderBlocks } from '@maas/web-cms-editor';
import { Article } from '@maas/core-api-models';
import { useSubscriptionStatus } from '@maas/core-api';

export const ArticleContent = ({
    content,
    visibility,
}: {
    content?: Article['content'];
    visibility?: Article['visibility'];
}) => {
    const { isUserSubscribed } = useSubscriptionStatus();
    const blocks = useRenderBlocks(content);
    return (
        <article className="flex w-full flex-col items-start gap-10 lg:max-w-[600px]">
            <div className="relative flex w-full flex-col items-start gap-5">
                {blocks}
                {!isUserSubscribed && visibility !== 'public' && (
                    <div className="pointer-events-none absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-t from-white to-transparent"></div>
                )}
            </div>
            {!isUserSubscribed && visibility !== 'public' && <SubscriptionCTA />}
        </article>
    );
};
