import {
  ArticlesHighlight,
  CategoryArticle,
  CategoryArticles,
  ContentFeed,
  FeedContentItemData,
} from '@maas/web-components';

const fakeArticles = [
  {
    image: 'https://images.unsplash.com/photo-1529480780361-9e8a4a9a5c8e?w=800&q=80',
    title: 'Quatre tours de mathemagie',
    category: 'Numero',
    link: '/articles/magie',
  },
  {
    image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=400&q=80',
    title: 'Condorcet, un (vrai) mathematicien ?',
    category: 'Thematiques',
    link: '/articles/condorcet',
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    title: "A la recherche d'un contre-exemple : un probleme en analyse",
    category: 'Jeux & Defis',
    link: '/articles/contre-exemple',
  },
  {
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    title: 'Antoine Houlou-Garcia',
    category: 'Notes de Lecture',
    link: '/articles/houlou-garcia',
  },
  {
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
    title: 'La marquise et les savants de son temps',
    category: 'Article',
    link: '/articles/marquise',
  },
];

const fakeFeedItems: FeedContentItemData[] = [
  {
    type: 'article',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
    title: 'Les polygones reguliers',
    category: 'Article',
    author: 'Jean-Jacques Dupas',
    date: '13 aout 2025',
    link: '/articles/polygones',
  },
  {
    type: 'article',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    title: 'Quelques constructions',
    category: 'Article',
    author: 'Jean-Jacques Dupas',
    date: '13 aout 2025',
    link: '/articles/constructions',
  },
  {
    type: 'article',
    image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&q=80',
    title: "Qu'est-ce qu'un polygone ?",
    category: 'Article',
    author: 'Jean-Jacques Dupas',
    date: '13 aout 2025',
    link: '/articles/polygone',
  },
  {
    type: 'article',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
    title: 'Editorial',
    category: 'Article',
    author: 'Jean-Jacques Dupas et Francois Lavallou',
    date: '13 aout 2025',
    link: '/articles/editorial',
  },
  {
    type: 'folder',
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80',
    title: 'Sous plusieurs angles',
    category: 'Dossier',
    articleCount: 4,
    date: '13 aout 2025',
    link: '/dossiers/angles',
  },
  {
    type: 'magazine',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80',
    title: 'Les tresors des polygones',
    category: 'Magazine',
    edition: 'Hors-Serie N° 92',
    date: '13 aout 2025',
    link: '/magazines/polygones',
  },
  {
    type: 'article',
    image: 'https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=400&q=80',
    title: 'Des abeilles a la dyscalculie',
    category: 'Article',
    author: 'Mireille Schumacher',
    date: '13 aout 2025',
    link: '/articles/abeilles',
  },
  {
    type: 'article',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80',
    title: 'La geometrie des alveoles',
    category: 'Article',
    author: 'Jean-Christophe Pain',
    date: '13 aout 2025',
    link: '/articles/alveoles',
  },
];

const fakeCategoryArticles: CategoryArticle[] = [
  {
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80',
    title: "Existe-t-il une infinite de nombres premiers jumeaux ?",
    category: 'Jeux & Defis',
    author: 'Auteur non renseigne',
    date: '14 juillet 2025',
    link: '/articles/nombres-premiers',
  },
  {
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80',
    title: 'Toute fonction continue est-elle derivable presque partout ?',
    category: 'Jeux & Defis',
    author: 'Auteur non renseigne',
    date: '14 juillet 2025',
    link: '/articles/fonction-continue',
  },
  {
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80',
    title: 'Peut-on toujours... ? Une question ouverte en topologie',
    category: 'Jeux & Defis',
    author: 'Auteur non renseigne',
    date: '14 juillet 2025',
    link: '/articles/topologie',
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    title: "A la recherche d'un contre-exemple : un probleme en analyse reelle",
    category: 'Jeux & Defis',
    author: 'Auteur non renseigne',
    date: '14 juillet 2025',
    link: '/articles/contre-exemple',
  },
];

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
