import { ContentFeed } from '@maas/web-components';
import { fakeFeedItems } from '../mock';
import { ArticleContent, ArticleSidebar } from './components';
import { useGetArticleById } from '@maas/core-api';
import { useParams } from 'react-router-dom';

const ArticleDetailsPage = () => {
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
    <section className={'container mx-auto py-10 space-y-10 px-5'}>
      <div className={'flex flex-col gap-y-16 lg:flex-row gap-5 items-start'}>
        <ArticleSidebar
          categories={article?.categories}
          author={article?.author}
        />
        <main
          className={
            'w-full lg:w-[600px] flex flex-row justify-center lg:justify-left shrink-0'
          }
        >
          <div className="flex flex-col">
            <ArticleContent content={article?.content} />
          </div>
        </main>
      </div>
      <div className="container mx-auto flex flex-col gap-5 pb-10 pt-5">
        <h2 className="font-heading  text-2xl md:text-[34px] font-semibold leading-[40px] tracking-[-0.85px]">
          Articles Similaires
        </h2>
        <ContentFeed items={fakeFeedItems} />
      </div>
    </section>
  );
};
export default ArticleDetailsPage;
