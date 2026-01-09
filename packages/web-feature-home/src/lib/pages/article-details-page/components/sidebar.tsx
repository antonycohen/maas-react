import { Authors } from './authors';
import { Separator, ShareArticles } from '@maas/web-components';
import { Thematiques } from './thematiques';

export const ArticleSidebar = () => {
  const authors = [
    {
      name: 'Bertrand Russell',
      description: 'Mathématicien et philosophe',
      image: 'https://eu.ui-avatars.com/api/?name=Bertrand+Russell&size=250',
    },
    {
      name: 'Sophie Portman',
      description: 'Chief product officer',
      image: 'https://eu.ui-avatars.com/api/?name=Sophie+Portman&size=250',
    },
  ];

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
