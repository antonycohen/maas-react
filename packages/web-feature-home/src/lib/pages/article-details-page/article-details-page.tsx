import { ContentFeed } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import { fakeFeedItems } from '../mock';
import { ArticleContent, ArticleSidebar } from './components';
import { useGetArticleById } from '@maas/core-api';
import { useParams } from 'react-router-dom';

const ArticleDetailsPage = () => {
    const { t } = useTranslation();
    const articleId = useParams<{ id: string }>().id;
    const { data: article } = useGetArticleById({
        id: articleId as string,
        fields: {
            content: null,
            title: null,
            featuredImage: null,
            categories: null,
            author: {
                fields: {
                    id: null,
                    firstName: null,
                    lastName: null,
                    profileImage: null,
                },
            },
        },
    });

    return (
        <section className={'container mx-auto space-y-10 px-5 py-10'}>
            <div className={'flex flex-col items-start gap-5 gap-y-16 lg:flex-row'}>
                <ArticleSidebar categories={article?.categories} author={article?.author} />
                <main className={'lg:justify-left flex w-full shrink-0 flex-row justify-center lg:w-[600px]'}>
                    <div className="flex flex-col">
                        <ArticleContent visibility={article?.visibility} content={article?.content} />
                    </div>
                </main>
            </div>
            <div className="container mx-auto flex flex-col gap-5 pt-5 pb-10">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    {t('home.similarArticles')}
                </h2>
                <ContentFeed items={fakeFeedItems} />
            </div>
        </section>
    );
};
export default ArticleDetailsPage;
