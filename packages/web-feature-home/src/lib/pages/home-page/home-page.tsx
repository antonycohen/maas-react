import { useMemo } from 'react';
import {
    ArticlesHighlight,
    CategoryArticles,
    ContentFeed,
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
        author: '',
        date: '',
        link: `/articles/${article.id}`,
    };
}

function mapArticleToCategoryArticle(article: HomepageArticle, categoryName: string): CategoryArticle {
    const image = getResizedImageUrl(article.cover?.resizedImages) || article.cover?.url || '';
    return {
        image,
        title: article.title,
        category: categoryName,
        author: '',
        date: '',
        link: `/articles/${article.id}`,
    };
}

export const HomePage = () => {
    const { t } = useTranslation();
    const { data: homepage } = useGetHomepage({
        issueFields: 'id,title,cover',
        articleFields: 'id,title,cover,categories',
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
                <ArticlesHighlight articles={highlightArticles} />
            </div>

            {/* Maths et art - Content Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                <ContentFeed items={mathsArtFeedItems} />
            </div>

            {/* Jeux & Défis Section - Dark Background */}
            <div className="bg-zinc-900">
                <div className="container mx-auto flex flex-col gap-5 px-5 pt-10 pb-10 xl:px-0">
                    <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                        <span className="text-white">{t('home.discover')}</span>
                        <span className="text-brand-secondary">{t('home.gamesChallenges')}</span>
                    </h2>
                    <CategoryArticles
                        articles={jeuxDefiFeedItems}
                        viewAllLabel={t('home.viewAllGamesChallenges')}
                        viewAllLink="/categories/jeux-et-defi"
                    />
                </div>
            </div>

            {/* Histoire & Cultures - Content Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                <ContentFeed items={histoireCulturesFeedItems} />
            </div>
        </div>
    );
};
