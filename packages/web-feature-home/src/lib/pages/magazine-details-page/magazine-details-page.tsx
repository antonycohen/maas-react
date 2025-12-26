import { FolderCard, MagazineHighlightsHero } from '@maas/web-components';
import { mockCurrentIssue } from '../mock';

export const MagazineDetailsPage = () => {
  return (
    <div className="flex flex-col gap-tg-xl">
      {/* Magazine Hero Section */}
      <div className="bg-brand-primary">
        <div className="container mx-auto">
          <MagazineHighlightsHero
            issue={mockCurrentIssue}
            link={`/magazines/${mockCurrentIssue.id}`}
          />
        </div>
      </div>
      <div className="container mx-auto gap-tg-lg flex flex-col p-5">
        {mockCurrentIssue.folders?.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            link={`/dossiers/${folder.id}`}
          />
        ))}
      </div>
    </div>
  );
};
