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
import { HomepageArticle, HomepageCategoryEntry, ReadResizedImage } from '@maas/core-api-models';

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

function mapToFeedArticle(entry: HomepageCategoryEntry): FeedArticleData {
    const image =
        getResizedImageUrl(entry.latestArticle?.cover?.resizedImages) || entry.latestArticle?.cover?.url || '';
    return {
        type: 'article',
        image,
        title: entry.latestArticle?.title || '',
        category: entry.category.name,
        author: '',
        date: '',
        link: `/articles/${entry.latestArticle?.id}`,
    };
}

function mapToCategoryArticle(entry: HomepageCategoryEntry): CategoryArticle {
    const image =
        getResizedImageUrl(entry.latestArticle?.cover?.resizedImages) || entry.latestArticle?.cover?.url || '';
    return {
        image,
        title: entry.latestArticle?.title || '',
        category: entry.category.name,
        author: '',
        date: '',
        link: `/articles/${entry.latestArticle?.id}`,
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

    const feedItems = useMemo(() => {
        if (!homepage?.categories) return [];
        return homepage.categories.filter((entry) => entry.latestArticle).map(mapToFeedArticle);
    }, [homepage]);

    const categoryArticles = useMemo(() => {
        if (!homepage?.categories) return [];
        return homepage.categories.filter((entry) => entry.latestArticle).map(mapToCategoryArticle);
    }, [homepage]);

    return (
        <div className="flex flex-col">
            {/* Articles Highlight Section */}
            <div className="container mx-auto">
                <ArticlesHighlight articles={highlightArticles} />
            </div>

            {/* Content Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                <ContentFeed items={feedItems} />
            </div>

            {/* Jeux & Défis Section - Dark Background */}
            <div className="bg-zinc-900">
                <div className="container mx-auto flex flex-col gap-5 px-5 pt-10 pb-10 xl:px-0">
                    <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                        <span className="text-white">{t('home.discover')}</span>
                        <span className="text-brand-secondary">{t('home.gamesChallenges')}</span>
                    </h2>
                    <CategoryArticles
                        articles={categoryArticles}
                        viewAllLabel={t('home.viewAllGamesChallenges')}
                        viewAllLink="/categories/jeux-et-defis"
                    />
                </div>
            </div>

            {/* Content Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                <ContentFeed items={feedItems} />
            </div>
        </div>
    );
};
