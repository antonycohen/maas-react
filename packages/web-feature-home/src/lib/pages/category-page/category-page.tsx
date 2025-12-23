import { ContentFeed, TitleAndDescriptionHero } from '@maas/web-components';
import { fakeFeedItems } from '../mock';

export const CategoryPage = () => {
  return (
    <div className="flex flex-col gap-tg-xl">
      <div className="container mx-auto">
        <TitleAndDescriptionHero
          title="Histoire & Culture"
          description="Découvrez comment les grands mathématiciens ont façonné notre monde, explorez les liens entre les maths et les autres domaines comme l’art, la musique ou même la philosophie, et revivez les moments clés qui ont marqué leur évolution."
        />
      </div>
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
