import {
  ContentFeed,
} from '@maas/web-components';
import { fakeFeedItems } from '../mock';
import { ArticleContent, ArticleSidebar } from './components';

const ArticleDetailsPage = () => {
  //const {id} = useParams<{id: string}>();
  //TODO: fetch the articles by id
  return (
    <section className={'container mx-auto py-10 space-y-10 px-5'}>
      <div className={'flex flex-col gap-y-16 md:flex-row gap-5 items-start'}>
        <ArticleSidebar />
        <main className={'w-full md:w-[600px] shrink-0'}>
          <ArticleContent />
        </main>
      </div>
      <div className="container mx-auto flex flex-col gap-5 pb-10 pt-5">
        <h2 className="font-heading text-[34px] font-semibold leading-[40px] tracking-[-0.85px]">
          Articles Similaires
        </h2>
        <ContentFeed items={fakeFeedItems} />
      </div>
    </section>
  );
};
export default ArticleDetailsPage;
