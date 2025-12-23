import {
  ArticlesHighlight,
  CategoryArticles,
  ContentFeed,
} from '@maas/web-components';
import { fakeArticles, fakeCategoryArticles, fakeFeedItems } from '../mock';

export const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Articles Highlight Section */}
      <div className="container mx-auto">
        <ArticlesHighlight articles={fakeArticles} />
      </div>

      {/* Content Feed Section */}
      <div className="container mx-auto flex flex-col gap-5 pb-10 pt-5">
        <h2 className="font-heading text-[34px] font-semibold leading-[40px] tracking-[-0.85px]">
          <span className="text-brand-primary">L'actualité mathématique</span>
          <span className="text-black"> en continu</span>
        </h2>
        <ContentFeed items={fakeFeedItems} />
      </div>

      {/* Jeux & Défis Section - Dark Background */}
      <div className="bg-zinc-900">
        <div className="container mx-auto flex flex-col gap-5 pb-10 pt-10">
          <h2 className="font-heading text-[34px] font-semibold leading-[40px] tracking-[-0.85px]">
            <span className="text-white">Découvrez les </span>
            <span className="text-brand-secondary">Jeux & Défis</span>
          </h2>
          <CategoryArticles
            articles={fakeCategoryArticles}
            viewAllLabel="Voir tous les Jeux & Défis"
            viewAllLink="/categories/jeux-et-defis"
          />
        </div>
      </div>

      {/* Content Feed Section */}
      <div className="container mx-auto flex flex-col gap-5 pb-10 pt-5">
        <h2 className="font-heading text-[34px] font-semibold leading-[40px] tracking-[-0.85px]">
          <span className="text-brand-primary">L'actualité mathématique</span>
          <span className="text-black"> en continu</span>
        </h2>
        <ContentFeed items={fakeFeedItems} />
      </div>
    </div>
  );
};
