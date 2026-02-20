import { useMemo } from 'react';
import {
    ArticlesHighlight,
    CategoryArticles,
    ContentFeed,
    Skeleton,
    useResizedImage,
    type FeedArticleData,
    type FeedMagazineData,
    type FeedFolderData,
    type FeedContentItemData,
    type CategoryArticle,
} from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import { useGetHomepage } from '@maas/core-api';
import { HomepageArticle, HomepageNewsItem, ReadResizedImage } from '@maas/core-api-models';

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

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function mapNewsItemToFeedItem(item: HomepageNewsItem): FeedContentItemData | null {
    switch (item.type) {
        case 'article': {
            const { article } = item;
            const image =
                getResizedImageUrl(article.cover?.resizedImages) ||
                article.cover?.url ||
                'https://images.unsplash.com/photo-1623039405147-547794f92e9e?q=80&w=640&auto=format&fit=crop';
            return {
                type: 'article',
                image,
                title: article.title,
                category: article.categories?.[0]?.name || '',
                author: `${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim(),
                date: formatDate(article.publishedAt),
                link: `/articles/${article.id}`,
            } satisfies FeedArticleData;
        }
        case 'issue': {
            const { issue } = item;
            const image =
                getResizedImageUrl(issue.cover?.resizedImages) ||
                issue.cover?.url ||
                'https://images.unsplash.com/photo-1623039405147-547794f92e9e?q=80&w=640&auto=format&fit=crop';
            return {
                type: 'magazine',
                image,
                title: issue.title,
                category: 'Magazine',
                edition: issue.title,
                issueNumber: issue.issueNumber,
                date: formatDate(issue.publishedAt),
                link: `/magazines/${issue.id}`,
            } satisfies FeedMagazineData;
        }
        case 'folder': {
            const { folder } = item;
            const image = getResizedImageUrl(folder.cover?.resizedImages) || folder.cover?.url || '';
            return {
                type: 'folder',
                image,
                title: folder.name,
                category: 'Dossier',
                articleCount: folder.articleCount ?? 0,
                date: '',
                link: `/dossiers/${folder.id}`,
            } satisfies FeedFolderData;
        }
        default:
            return null;
    }
}

function mapArticleToCategoryArticle(article: HomepageArticle): CategoryArticle {
    const image =
        getResizedImageUrl(article.cover?.resizedImages) ||
        article.cover?.url ||
        'https://images.unsplash.com/photo-1623039405147-547794f92e9e?q=80&w=640&auto=format&fit=crop';
    return {
        image,
        title: article.title,
        description: article.description || '',
        category: article.categories?.[0]?.name || '',
        author: `${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim(),
        date: formatDate(article.publishedAt),
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
        issueFields: 'id,title,cover,published_at,issue_number',
        articleFields: 'id,title,cover,categories,published_at,author,description',
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

    const firstNewsFeedItems = useMemo(() => {
        if (!homepage?.news) return [];
        return homepage.news
            .slice(0, 12)
            .map(mapNewsItemToFeedItem)
            .filter((item): item is FeedContentItemData => item !== null);
    }, [homepage]);

    const jeuxDefiItems = useMemo(() => {
        if (!homepage?.jeuxDefis) return [];
        return homepage.jeuxDefis.map((article) => mapArticleToCategoryArticle(article));
    }, [homepage]);

    const lastNewsFeedItems = useMemo(() => {
        if (!homepage?.news) return [];
        return homepage.news
            .slice(-12)
            .map(mapNewsItemToFeedItem)
            .filter((item): item is FeedContentItemData => item !== null);
    }, [homepage]);

    return (
        <div className="flex flex-col">
            {/* Articles Highlight Section */}
            <div className="container mx-auto">
                {isPending ? <HighlightSkeleton /> : <ArticlesHighlight articles={highlightArticles} />}
            </div>

            {/* First News Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                {isPending ? <ContentFeedSkeleton /> : <ContentFeed items={firstNewsFeedItems} />}
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
                            articles={jeuxDefiItems}
                            viewAllLabel={t('home.viewAllGamesChallenges')}
                            viewAllLink="/categories/jeux-et-defi"
                        />
                    )}
                </div>
            </div>

            {/* Last News Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                {isPending ? <ContentFeedSkeleton /> : <ContentFeed items={lastNewsFeedItems} />}
            </div>
        </div>
    );
};
