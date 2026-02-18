import { useMemo } from 'react';
import {
    ArticlesHighlight,
    CategoryArticles,
    ContentFeed,
    Skeleton,
    useResizedImage,
    type FeedArticleData,
    type CategoryArticle,
} from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import { useGetHomepage } from '@maas/core-api';
import { HomepageArticle, ReadResizedImage } from '@maas/core-api-models';

const HOMEPAGE_SLUGS = ['maths-et-art', 'jeux-et-defi', 'histoire-et-cultures'];

function getResizedImageUrl(images: ReadResizedImage[] | null | undefined, width = 640): string {
    const resized = images?.find((i) => i.width === width);
    return resized?.url || images?.[0]?.url || '';
}

function mapFeaturedToHighlight(article: HomepageArticle) {
    return {
        image: getResizedImageUrl(article.cover?.resizedImages) || article.cover?.url || '',
        title: article.title,
        category: article.categories?.[0]?.name || '',
        link: `/articles/${article.id}`,
    };
}

function mapArticleToFeedItem(article: HomepageArticle, categoryName: string): FeedArticleData {
    const image = getResizedImageUrl(article.cover?.resizedImages) || article.cover?.url || '';
    return {
        type: 'article',
        image,
        title: article.title,
        category: categoryName,
        author: `${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim(),
        date: article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              })
            : '',
        link: `/articles/${article.id}`,
    };
}

function mapArticleToCategoryArticle(article: HomepageArticle, categoryName: string): CategoryArticle {
    const image = getResizedImageUrl(article.cover?.resizedImages) || article.cover?.url || '';
    return {
        image,
        title: article.title,
        category: categoryName,
        author: `${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim(),
        date: article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              })
            : '',
        link: `/articles/${article.id}`,
    };
}

const HighlightSkeleton = () => (
    <section className="flex w-full items-center justify-center">
        <div className="container flex w-full items-center justify-center px-5 py-4 md:pt-5 md:pb-10 xl:px-0">
            <div className="flex h-[640px] w-full flex-col gap-3 md:h-[480px] md:flex-row md:gap-5">
                <Skeleton className="min-w-0 flex-1 basis-0 rounded-[12px]" />
                <div className="flex min-w-0 flex-1 basis-0 gap-3 md:gap-5">
                    <div className="flex h-full min-w-0 flex-1 basis-0 flex-col gap-3 md:gap-5">
                        <Skeleton className="min-h-0 flex-1 basis-0 rounded-[12px]" />
                        <Skeleton className="min-h-0 flex-1 basis-0 rounded-[12px]" />
                    </div>
                    <div className="flex h-full min-w-0 flex-1 basis-0 flex-col gap-3 md:gap-5">
                        <Skeleton className="min-h-0 flex-1 basis-0 rounded-[12px]" />
                        <Skeleton className="min-h-0 flex-1 basis-0 rounded-[12px]" />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ContentFeedSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[282/199] w-full rounded-[12px]" />
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-3/4 rounded" />
            </div>
        ))}
    </div>
);

const CategoryArticlesSkeleton = () => (
    <div className="flex flex-col gap-5">
        {Array.from({ length: 2 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-5">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex min-w-0 flex-1 basis-0 gap-3 rounded-[12px] border border-[#333] p-3">
                        <Skeleton className="aspect-[282/199] min-w-0 flex-1 basis-0 rounded" />
                        <div className="flex min-w-0 flex-1 basis-0 flex-col justify-between px-3 py-2">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-6 w-24 rounded" />
                                <Skeleton className="h-5 w-full rounded" />
                                <Skeleton className="h-5 w-3/4 rounded" />
                            </div>
                            <Skeleton className="h-4 w-32 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </div>
);

export const HomePage = () => {
    const { t } = useTranslation();
    const { data: homepage, isPending } = useGetHomepage({
        issueFields: 'id,title,cover,published_at,author',
        articleFields: 'id,title,cover,categories,published_at,author',
        categoriesSlugs: HOMEPAGE_SLUGS,
    });

    const { resizedImage: issueCover } = useResizedImage({
        images: homepage?.latestIssue?.cover?.resizedImages,
        width: 640,
    });

    const highlightArticles = useMemo(() => {
        const articles = (homepage?.featuredArticles ?? []).map(mapFeaturedToHighlight);

        // Prepend the latest issue as the featured (first) highlight
        if (homepage?.latestIssue) {
            articles.unshift({
                image: issueCover?.url || homepage.latestIssue.cover?.url || '',
                title: homepage.latestIssue.title,
                category: 'Magazine',
                link: `/magazines/${homepage.latestIssue.id}`,
            });
        }

        return articles;
    }, [homepage, issueCover]);

    const mathsArtFeedItems = useMemo(() => {
        const entry = homepage?.categories?.[0];
        if (!entry) return [];
        return entry.articles
            .filter((a) => a.cover)
            .slice(0, 12)
            .map((article) => mapArticleToFeedItem(article, entry.category.name));
    }, [homepage]);

    const jeuxDefiFeedItems = useMemo(() => {
        const entry = homepage?.categories?.[1];
        if (!entry) return [];
        return entry.articles
            .filter((a) => a.cover)
            .slice(0, 12)
            .map((article) => mapArticleToCategoryArticle(article, entry.category.name));
    }, [homepage]);

    const histoireCulturesFeedItems = useMemo(() => {
        const entry = homepage?.categories?.[2];
        if (!entry) return [];
        return entry.articles
            .filter((a) => a.cover)
            .slice(0, 12)
            .map((article) => mapArticleToFeedItem(article, entry.category.name));
    }, [homepage]);

    return (
        <div className="flex flex-col">
            {/* Articles Highlight Section */}
            <div className="container mx-auto">
                {isPending ? <HighlightSkeleton /> : <ArticlesHighlight articles={highlightArticles} />}
            </div>

            {/* Maths et art - Content Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                {isPending ? <ContentFeedSkeleton /> : <ContentFeed items={mathsArtFeedItems} />}
            </div>

            {/* Jeux & Défis Section - Dark Background */}
            <div className="bg-zinc-900">
                <div className="container mx-auto flex flex-col gap-5 px-5 pt-10 pb-10 xl:px-0">
                    <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                        <span className="text-white">{t('home.discover')}</span>
                        <span className="text-brand-secondary">{t('home.gamesChallenges')}</span>
                    </h2>
                    {isPending ? (
                        <CategoryArticlesSkeleton />
                    ) : (
                        <CategoryArticles
                            articles={jeuxDefiFeedItems}
                            viewAllLabel={t('home.viewAllGamesChallenges')}
                            viewAllLink="/categories/jeux-et-defi"
                        />
                    )}
                </div>
            </div>

            {/* Histoire & Cultures - Content Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                {isPending ? <ContentFeedSkeleton /> : <ContentFeed items={histoireCulturesFeedItems} />}
            </div>
        </div>
    );
};
