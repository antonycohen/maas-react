import { useMemo } from 'react';
import { ContentFeed, mapIssueToFeedArticle, NotFoundPage, Skeleton } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import { ArticleContent, ArticleSidebar } from './components';
import { ApiError, useGetArticleById, useGetSimilarArticles } from '@maas/core-api';
import { useParams } from 'react-router';
import { SEO, extractArticleSeo } from '@maas/core-seo';

const ArticleDetailsSkeleton = () => (
    <section className="container mx-auto space-y-10 px-5 py-20">
        <div className="flex flex-col items-start gap-5 gap-y-16 lg:flex-row">
            <aside className="order-last flex w-full shrink-0 flex-col gap-6 pr-5 md:w-[290px] lg:order-first">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                </div>
            </aside>
            <main className="lg:justify-left flex w-full shrink-0 flex-row justify-center lg:w-[600px]">
                <div className="flex w-full flex-col gap-5 lg:max-w-[600px]">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="aspect-video w-full rounded" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </main>
        </div>
    </section>
);

const ArticleDetailsPage = () => {
    const { t } = useTranslation();
    const articleId = useParams<{ id: string }>().id;
    const { data: article, error } = useGetArticleById(
        {
            id: articleId as string,
            fields: {
                content: null,
                title: null,
                description: null,
                keywords: null,
                publishedAt: null,
                featuredImage: null,
                cover: null,
                categories: null,
                visibility: null,
                customFields: null,
                type: {
                    fields: {
                        name: null,
                    },
                },
                author: {
                    fields: {
                        id: null,
                        firstName: null,
                        lastName: null,
                        profileImage: null,
                    },
                },
            },
        },
        {
            retry: (_, error) => !(error instanceof ApiError && error.code === 1001),
        }
    );

    const { data: similarArticlesResponse } = useGetSimilarArticles(
        {
            articleId: articleId as string,
            offset: 0,
            limit: 4,
            fields: {
                id: null,
                title: null,
                cover: null,
                categories: null,
                author: {
                    fields: {
                        firstName: null,
                    },
                },
                publishedAt: null,
            },
        },
        { enabled: !!articleId }
    );

    const similarFeedItems = useMemo(
        () => (similarArticlesResponse?.data ?? []).map(mapIssueToFeedArticle),
        [similarArticlesResponse]
    );

    if (error instanceof ApiError && error.code === 1001) return <NotFoundPage />;
    if (!article) return <ArticleDetailsSkeleton />;
    return (
        <section className={'container mx-auto space-y-10 px-5 py-10'}>
            <SEO {...extractArticleSeo(article)} />
            <div className={'flex flex-col items-start gap-5 gap-y-16 lg:flex-row'}>
                <ArticleSidebar categories={article?.categories} author={article?.author} />
                <main className={'lg:justify-left flex w-full shrink-0 flex-row justify-center lg:w-[600px]'}>
                    <div className="flex flex-col">
                        <ArticleContent
                            title={article?.title}
                            featuredImage={article?.featuredImage}
                            visibility={article?.visibility}
                            content={article?.content}
                            type={article?.type}
                            customFields={article?.customFields}
                        />
                    </div>
                </main>
            </div>
            {similarFeedItems.length > 0 && (
                <div className="container mx-auto flex flex-col gap-5 pt-5">
                    <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                        {t('home.similarArticles')}
                    </h2>
                    <ContentFeed items={similarFeedItems} />
                </div>
            )}
        </section>
    );
};
export default ArticleDetailsPage;
