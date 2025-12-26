import { FolderCard, TitleAndDescriptionHero } from '@maas/web-components';
import { mockCurrentIssue } from '../mock';

export const FoldersPage = () => {
  return (
    <div className="flex flex-col gap-tg-xl">
      <div className="container mx-auto">
        <TitleAndDescriptionHero
          title="Dossiers"
          description="Découvrez comment les grands mathématiciens ont façonné notre monde, explorez les liens entre les maths et les autres domaines comme l’art, la musique ou même la philosophie, et revivez les moments clés qui ont marqué leur évolution."
        />
      </div>
      <div className="container mx-auto gap-tg-lg flex flex-col py-tg-xl">
        {mockCurrentIssue.folders?.map((folder) => (
          <FolderCard key={`folder-${folder.id}`} folder={folder} link={`/dossiers/${folder.id}`} />
        ))}
      </div>
    </div>
  );
};
