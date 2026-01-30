import { FolderCard, MagazineHighlightsHero } from '@maas/web-components';
import { useGetIssueById } from '@maas/core-api';
import { useParams } from 'react-router-dom';

export const MagazineDetailsPage = () => {
  const issueId = useParams<{ id: string }>().id;
  const { data: magazines } = useGetIssueById({
    id: issueId as string,
    fields: {
      id: null,
      description: null,
      title: null,
      cover: null,
      publishedAt: null,
      folders: {
        fields: {
          id: null,
          name: null,
          description: null,
          type: null,
          articleCount: null,
          cover: null,
          articles: {
            fields: {
              title: null,
              id: null,
              cover: null,
              author: {
                fields: {
                  firstName: null,
                  lastName: null,
                },
              },
            },
          },
        },
      },
      brand: {
        fields: {
          issueConfiguration: {
            fields: {
              color: null,
            },
          },
        },
      },
    },
  });

  //TODO: redirect to 404 page if not found



  return (
    <div className="flex flex-col gap-tg-xl">
      {/* Magazine Hero Section */}
      <div
        className="bg-brand-primary"
        style={{
          backgroundColor: magazines?.brand?.issueConfiguration
            ?.color as string,
        }}
      >
        <div className="container mx-auto">
          <MagazineHighlightsHero
            issue={magazines}
            link={`/magazines/${magazines?.id}`}
          />
        </div>
      </div>
      <div className="container mx-auto gap-tg-lg flex flex-col p-5">
        {magazines?.folders?.map((folder) => (
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
