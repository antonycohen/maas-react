import { FolderCard, TitleAndDescriptionHero } from '@maas/web-components';
import { useGetFolders } from '@maas/core-api';

export const FoldersPage = () => {
  const { data: response } = useGetFolders({
    limit: 10,
    offset: 0,
    fields: {
      id: null,
      name: null,
      description: null,
      type: null,
      articleCount: null,
      cover: {
        fields: {
          resizedImages: null,
        },
      },
      articles: {
        fields: {
          title: null,
          id: null,
          featuredImage: {
            fields: {
              url: null,
            },
          },
          author: {
            fields: {
              firstName: null,
              lastName: null,
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-tg-xl px-5 xl:px-0">
      <div className="container mx-auto">
        <TitleAndDescriptionHero
          title="Dossiers"
          description="Découvrez comment les grands mathématiciens ont façonné notre monde, explorez les liens entre les maths et les autres domaines comme l’art, la musique ou même la philosophie, et revivez les moments clés qui ont marqué leur évolution."
        />
      </div>
      <div className="container mx-auto gap-tg-lg flex flex-col py-tg-xl">
        {response?.data?.map((folder) => (
          <FolderCard
            key={`folder-${folder.id}`}
            folder={folder}
            link={`/dossiers/${folder.id}`}
          />
        ))}
      </div>
    </div>
  );
};
