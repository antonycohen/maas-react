import { useParams } from 'react-router-dom';

import { ContentFeed, TitleAndDescriptionHero } from '@maas/web-components';
import { fakeFeedItems, mockCurrentIssue } from '../mock';

export const FolderDetailsPages = () => {
  const { id } = useParams();
  const currentFolders = mockCurrentIssue.folders?.find((f) => f.id === id);

  if (!currentFolders) return null; //TODO: Add loader or something else

  const bgImageUrl = currentFolders.cover?.url || 'https://images.unsplash.com/photo-1700773429980-ed1d3287fe1e?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div className="flex flex-col gap-tg-xl">
      <div className={'w-full bg-repeat bg-cover min-h-[530px] flex justify-center items-center bg-center'} style={{
        backgroundImage: `url(${bgImageUrl})`,
      }}>
        <TitleAndDescriptionHero
          titleClassName={'text-white'}
          descriptionClassName={'text-white'}
          title={currentFolders.name}
          description={currentFolders.description || ''}
        />
      </div>
      {currentFolders?.articles && currentFolders?.articles?.length > 0 && (
        <div className="container mx-auto flex flex-col gap-5 pb-10 pt-5">
          <h2 className="font-heading text-[34px] font-semibold leading-[40px] tracking-[-0.85px]">
            <span className="text-brand-primary">Tous les articles</span>
            <span className="text-black">de ce dossier</span>
          </h2>
          <ContentFeed items={fakeFeedItems} />
        </div>
      )}
    </div>
  );
};
