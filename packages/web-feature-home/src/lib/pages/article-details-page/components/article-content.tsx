import { SubscriptionCTA } from './subscription-cta';
import { useRenderBlocks } from '@maas/web-cms-editor';
import { Article } from '@maas/core-api-models';
import { useSubscriptionStatus } from '@maas/core-api';
import { useResizedImage } from '@maas/web-components';

export const ArticleContent = ({
    title,
    featuredImage,
    content,
    visibility,
}: {
    title?: Article['title'];
    featuredImage?: Article['featuredImage'];
    content?: Article['content'];
    visibility?: Article['visibility'];
}) => {
    const { isUserSubscribed } = useSubscriptionStatus();
    const blocks = useRenderBlocks(content);
    const { resizedImage } = useResizedImage({ images: featuredImage?.resizedImages, width: 960 });
    const coverUrl = resizedImage?.url ?? featuredImage?.url;

    return (
        <article className="flex w-full flex-col items-start gap-10 lg:max-w-[600px]">
            {title && (
                <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight md:text-4xl">{title}</h1>
            )}
            {coverUrl && <img src={coverUrl} alt={title ?? ''} className="w-full rounded-lg object-cover" />}
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
