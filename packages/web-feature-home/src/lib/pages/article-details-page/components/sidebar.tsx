import { Authors } from './authors';
import { Separator, ShareArticles } from '@maas/web-components';
import { Thematiques } from './thematiques';
import { Article } from '@maas/core-api-models';

interface ArticleSidebarProps {
  author?: Article['author'];
}

export const ArticleSidebar = ({ author }: ArticleSidebarProps) => {
  const authors = author ? [author] : [];

  const fakeTags = [
    'Théorème',
    'Démonstration',
    'Conjecture',
    'Algèbre',
    'Analyse',
    'Probabilités',
    'Statistiques',
    'Calcul différentiel',
    'Intégrale',
  ];

  return (
    <aside
      className={
        'order-last  lg:order-first flex flex-col gap-6 w-full md:w-[290px] pr-5 shrink-0'
      }
    >
      <Authors authors={authors} />
      <Separator />
      <Thematiques tags={fakeTags} />
      <Separator />
      <ShareArticles
        links={{ facebook: '#', x: '#', instagram: '#', linkedin: '#' }}
      />
    </aside>
  );
};
